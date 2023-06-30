variable "resource_group_name" {
  type    = string
  default = "bs-grp"
}

variable "location" {
  type    = string
  default = "North Europe"
}

variable "virtual_network" {
  type = map(any)
  default = {
    name          = "bs-network"
    address_space = "10.0.0.0/16"
  }
}

variable "subnets_info" {
  type = map(any)
  default = {
    subnetA = {
      name           = "bs-subnetA"
      address_prefix = "10.0.0.0/24"
    }
    subnetB = {
      name           = "bs-subnetB"
      address_prefix = "10.0.1.0/24"
    }
  }
}

variable "subnets_info_list" {
  type = list(any)
  default = [
    {
      subnetA_name           = "bs-subnetA"
      subnetA_address_prefix = "10.0.0.0/24"
    },
    {
      subnetB_name           = "bs-subnetB"
      subnetB_address_prefix = "10.0.1.0/24"
    }
  ]
}

variable "appinterface_name" {
  type    = string
  default = "bs-nic"
}

variable "apppublicip_name" {
  type    = string
  default = "bs-public-IP"
}

variable "ip_configuration_name" {
  type    = string
  default = "bs-ip-configuration"
}

variable "private_ip_address_allocation" {
  type    = string
  default = "Dynamic"
}

variable "apppublicip_allocation_method" {
  type    = string
  default = "Static"
}

variable "appsecuritygroup_name" {
  type    = string
  default = "bs-securitygroup"
}

variable "appvm_name" {
  type    = string
  default = "bs-VM"
}

variable "appvm_size" {
  type    = string
  default = "Standard_DS1_v2"
}

variable "appvm_admin_username" {
  type    = string
  default = "adminuser"
}

variable "appdisk_name" {
  type    = string
  default = "bs-disk"
}

variable "vm_os_disk_caching" {
  type    = string
  default = "ReadWrite"
}

variable "vm_os_disk_storage_account_type" {
  type    = string
  default = "Standard_LRS"
}

variable "appdisk_create_option" {
  type    = string
  default = "Empty"
}

variable "appdisk_disk_size_gb" {
  type    = string
  default = "16"
}

variable "diskattach_lun" {
  type    = string
  default = "0"
}

variable "diskattach_caching" {
  type    = string
  default = "ReadWrite"
}

variable "linuxkey_algorithm" {
  type    = string
  default = "RSA"
}

variable "linuxkey_rsa_bits" {
  type    = number
  default = 4096
}

variable "linuxpemkey_filename" {
  type    = string
  default = "linuxkey.pem"
}

variable "deployment_script_extension_name" {
  type    = string
  default = "deployment-script"
}

variable "networksecuritygroup_rules" {
  type = list(any)
  default = [
    {
      priority               = 200
      destination_port_range = "22"
    },
    {
      priority               = 300
      destination_port_range = "80"
    }
  ]
}

variable "service_plan_name" {
  type    = string
  default = "bs-service-plan"
}

variable "webapp_name" {
  type    = string
  default = "bs-webapp"
}

variable "webapp_docker_image" {
  type    = string
  default = "crepic21/my-website"
}

variable "webapp_docker_image_tag" {
  type    = string
  default = "148"
}

variable "webapp_docker_image_tag_staging" {
  type    = string
  default = "131"
}

variable "log_analytics_workspace_sku" {
  type    = string
  default = "PerGB2018"
}

variable "log_analytics_workspace_retention_in_days" {
  type    = number
  default = 30
}

variable "web_app_node_version" {
  type    = string
  default = "16-lts"
}

variable "application_insights_application_type" {
  type    = string
  default = "web"
}

variable "webappplan_os_type" {
  type    = string
  default = "Linux"
}

variable "webappplan_sku_name" {
  type    = string
  default = "S1"
}

variable "web_app_slot_name" {
  type    = string
  default = "staging"
}

variable "bs_source_control_repo_url" {
  type    = string
  default = "https://github.com/CREPIC21/businessregistry"
}

variable "bs_source_control_repo_branch" {
  type    = string
  default = "main"
}

variable "NODE_ENV" {
  type = string
}

variable "PORT" {
  type = string
}

variable "MONGO_URI" {
  type = string
}

variable "GEOCODER_PROVIDER" {
  type = string
}

variable "GEOCODER_API_KEY" {
  type = string
}

variable "FILE_UPLOAD_PATH" {
  type = string
}

variable "MAX_FILE_UPLOAD" {
  type = string
}

variable "JWT_SECRET" {
  type = string
}

variable "JWT_EXPIRE" {
  type = string
}

variable "JWT_COOKIE_EXPIRE" {
  type = string
}

variable "SMTP_HOST" {
  type = string
}

variable "SMTP_PORT" {
  type = string
}

variable "SMTP_EMAIL" {
  type = string
}

variable "SMTP_PASSWORD" {
  type = string
}

variable "FROM_EMAIL" {
  type = string
}

variable "FROM_NAME" {
  type = string
}

variable "PAY_PAL_CLIENT_ID" {
  type = string
}

variable "PAY_PAL_CLIENT_SECRET" {
  type = string
}

variable "SHEETY_API_POST" {
  type = string
}