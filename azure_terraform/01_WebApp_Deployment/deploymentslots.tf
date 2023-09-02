/*

Dcumentation:

1. azurerm_linux_web_app_slot - https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/linux_web_app_slot

2. azurerm_web_app_active_slot - https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/web_app_active_slot

*/

# Creating additional Web App Deployment Slot
resource "azurerm_linux_web_app_slot" "web_app_slot" {
  name           = var.web_app_slot_name
  app_service_id = azurerm_linux_web_app.businessregistry.id

  site_config {
    application_stack {
      node_version = var.web_app_node_version
    }
  }

  depends_on = [azurerm_service_plan.webappplan]
}

# # Configuring staging slot as active slot
# resource "azurerm_web_app_active_slot" "active_slot" {
#   slot_id = azurerm_linux_web_app_slot.web_app_slot.id
# }
