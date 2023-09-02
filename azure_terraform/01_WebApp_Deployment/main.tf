/*

Dcumentation:

1. azurerm_resource_group - https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/resource_group

*/

# Creating a resource group
resource "azurerm_resource_group" "appgrp" {
  name     = var.resource_group_name
  location = var.location
}


