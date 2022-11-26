# aws --version
# aws eks --region us-east-1 update-kubeconfig --name in28minutes-cluster
# Uses default VPC and Subnet. Create Your Own VPC and Private Subnets for Prod Usage.
# terraform-backend-state-crepic21-987


terraform {
  backend "s3" {
    bucket = "mybucket"       # Will be overridden from build
    key    = "path/to/my/key" # Will be overridden from build
    region = "eu-west-1"
  }
}

resource "aws_default_vpc" "default" {

}

data "aws_subnet_ids" "subnets" {
  vpc_id = aws_default_vpc.default.id
}

provider "kubernetes" {
  host                   = data.aws_eks_cluster.cluster.endpoint
  cluster_ca_certificate = base64decode(data.aws_eks_cluster.cluster.certificate_authority.0.data)
  token                  = data.aws_eks_cluster_auth.cluster.token
  version                = "~> 2.12"
}

module "eks" {
  source          = "terraform-aws-modules/eks/aws"
  version         = "~> 18.0"
  cluster_name    = "crepic21-cluster"
  cluster_version = "1.22"

  vpc_id     = aws_default_vpc.default.id
  subnet_ids = ["subnet-0f2b5c3fbd67e7d1d", "subnet-06424c5fa2fbfec9c", "subnet-00918fdd3066b2c5a"] #CHANGE

  eks_managed_node_groups = {
    one = {
      name = "node-group-1"
      instance_types = ["t2.micro"]
      min_size     = 3
      max_size     = 5
      desired_size = 3
    }
  }
}

data "aws_eks_cluster" "cluster" {
  name = module.eks.cluster_id
}

data "aws_eks_cluster_auth" "cluster" {
  name = module.eks.cluster_id
}


# We will use ServiceAccount to connect to K8S Cluster in CI/CD mode
# ServiceAccount needs permissions to create deployments 
# and services in default namespace
resource "kubernetes_cluster_role_binding" "example" {
  metadata {
    name = "crepic21-rbac"
  }
  role_ref {
    api_group = "rbac.authorization.k8s.io"
    kind      = "ClusterRole"
    name      = "cluster-admin"
  }
  subject {
    kind      = "ServiceAccount"
    name      = "default"
    namespace = "default"
  }
}

# Needed to set the default region
provider "aws" {
  region = "eu-west-1"
}


### IMPORTANT ###
# - steps to connect to aws kubernetes cluster for purposes of creating kubernetes service connaction in Azure DevOpos
# -- aws --version
# -- aws configure
# -- aws eks --region <region_name> update-kubeconfig --name=<cluster_name>
# -- kubectl version
# -- kubectl get all -o wide
# -- kubectl cluster-info
# ---- Kubernetes control plane is running at URL <--- THIS URL IS FOR SERVER URL IN kubernetes service connaction in Azure DevOpos
# -- kubectl get serviceaccounts default -o yaml -> to get the name of the secret
# -- kubectl get secret default-token-j9wxj -o yaml -> the whole output is a secret for kubernetes service connaction in Azure DevOpos

### ISSUE ###
# - deploying on AWS cluster not working as app can't connect to MongoDB Atlas database
# - possible solution peering
# -- https://cloud.mongodb.com/v2/6150399f555d3d674f00748d#security/network/peering
# -- https://www.mongodb.com/docs/atlas/troubleshoot-connection/#attempting-to-connect-to-a-database-deployment-from-behind-a-firewall
# -- https://stackoverflow.com/questions/56402472/kubernetes-node-js-container-cannot-connect-to-mongodb-atlas