/*

Dcumentation:

1. azurerm_traffic_manager_profile - https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/traffic_manager_profile

2. azurerm_traffic_manager_azure_endpoint - https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/traffic_manager_azure_endpoint

3. 

*/

resource "azurerm_traffic_manager_profile" "bs-profile" {
  name                   = "bs-profile-100"
  resource_group_name    = var.resource_group_name
  traffic_routing_method = "Priority"

  dns_config {
    relative_name = "bs-profile-100"
    ttl           = 100
  }

  monitor_config {
    protocol                     = "HTTPS"
    port                         = 443
    path                         = "/"
    interval_in_seconds          = 30
    timeout_in_seconds           = 9
    tolerated_number_of_failures = 3
  }

  depends_on = [azurerm_resource_group.appgrp]
}

resource "azurerm_traffic_manager_azure_endpoint" "primaryendpoint" {
  name               = "primaryendpoint"
  profile_id         = azurerm_traffic_manager_profile.bs-profile.id
  priority           = 1
  weight             = 100
  target_resource_id = azurerm_linux_web_app.bs01app.id

  custom_header {
    name  = "host"
    value = "${azurerm_linux_web_app.bs01app.name}.azurewebsites.net"
  }
  depends_on = [azurerm_linux_web_app.bs01app]
}

resource "azurerm_traffic_manager_azure_endpoint" "secondaryendpoint" {
  name               = "secondaryendpoint"
  profile_id         = azurerm_traffic_manager_profile.bs-profile.id
  priority           = 2
  weight             = 100
  target_resource_id = azurerm_linux_web_app.bs02app.id

  custom_header {
    name  = "host"
    value = "${azurerm_linux_web_app.bs02app.name}.azurewebsites.net"
  }
  depends_on = [azurerm_linux_web_app.bs02app]
}
