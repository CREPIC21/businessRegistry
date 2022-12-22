resource "azurerm_resource_group" "resource_group" {
  name     = "${var.resource_group}_${var.environment}"
  location = var.location
}

provider "azurerm" {
  //version = "~>2.0.0"
  features {}
}

resource "azurerm_kubernetes_cluster" "terraform-k8s" {
  name                = "${var.cluster_name}_${var.environment}"
  location            = azurerm_resource_group.resource_group.location
  resource_group_name = azurerm_resource_group.resource_group.name
  dns_prefix          = var.dns_prefix

  linux_profile {
    admin_username = "ubuntu"

    ssh_key {
      key_data = file(var.ssh_public_key)
    }
  }

  default_node_pool {
    name            = "agentpool"
    node_count      = var.node_count
    vm_size         = "standard_b2ms"
    # vm_size         = "standard_d2as_v5"      CHANGE IF AN ERROR ARISES 
  }

  service_principal {
    client_id     = var.client_id
    client_secret = var.client_secret
  }

  tags = {
    Environment = var.environment
  }
}

terraform {
  backend "azurerm" {
    # storage_account_name="<<storage_account_name>>" #OVERRIDE in TERRAFORM init
    # access_key="<<storage_account_key>>" #OVERRIDE in TERRAFORM init
    # key="<<env_name.k8s.tfstate>>" #OVERRIDE in TERRAFORM init
    # container_name="<<storage_account_container_name>>" #OVERRIDE in TERRAFORM init
  }
}

# # to create client_id and client_secret
# - login to azure from console -> az login
# - run -> az ad sp create-for-rbac --role="Contributor" --scopes="/subscriptions/<subscription_id>"
# -- save all created credentails somwhere secure
# -- appId -> client_id
# -- password -> client_secret

# # to create ssh_public_key
# - run -> ssh-keygen -m PEM -t rsa -b 4096 (on Windows run command in GitBash)

# # nessesary terraform plugins for azure pipelines
# - https://marketplace.visualstudio.com/items?itemName=ms-devlabs.custom-terraform-tasks
# - https://marketplace.visualstudio.com/items?itemName=charleszipp.azure-pipelines-tasks-terraform

# # 3 connect to K8C
# - run -> az aks get-credentials --name <K8C_name> --resource-group <resource_group_name>

# https://stackoverflow.com/questions/61171623/azure-devops-why-is-my-subscription-not-shown-when-creating-a-new-service-conne/61227239#61227239
# https://jhooq.com/terraform-conidtional-check-failed/
