# Creating additional Web App Deployment Slot
resource "azurerm_linux_web_app_slot" "web_app_slot_01" {
  name           = "${azurerm_linux_web_app.bs01app.name}-prod-slot"
  app_service_id = azurerm_linux_web_app.bs01app.id

  site_config {
    application_stack {
      node_version = var.web_app_node_version
    }
  }

  depends_on = [azurerm_service_plan.bs01appplan]
}

# # Configuring staging slot as active slot
# resource "azurerm_web_app_active_slot" "active_slot" {
#   slot_id = azurerm_linux_web_app_slot.web_app_slot.id
# }

# Creating additional Web App Deployment Slot
resource "azurerm_linux_web_app_slot" "web_app_slot" {
  name           = "${azurerm_linux_web_app.bs02app.name}-prod-slot"
  app_service_id = azurerm_linux_web_app.bs02app.id

  site_config {
    application_stack {
      node_version = var.web_app_node_version
    }
  }

  depends_on = [azurerm_service_plan.bs02appplan]
}

# # Configuring staging slot as active slot
# resource "azurerm_web_app_active_slot" "active_slot" {
#   slot_id = azurerm_linux_web_app_slot.web_app_slot.id
# }
