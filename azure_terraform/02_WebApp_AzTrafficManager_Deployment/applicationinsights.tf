# First we need to create central log analytics workspace
resource "azurerm_log_analytics_workspace" "bsworkspace01" {
  name                = "${var.webapp_name}-workspace666652"
  location            = var.location
  resource_group_name = var.resource_group_name
  sku                 = var.log_analytics_workspace_sku
  retention_in_days   = var.log_analytics_workspace_retention_in_days
  depends_on          = [azurerm_resource_group.appgrp]
}

# Now we can create application insights resource which is linked to central log analytics workspace
resource "azurerm_application_insights" "bsappinsights01" {
  name                = "${var.webapp_name}-appinsights01"
  location            = var.location
  resource_group_name = var.resource_group_name
  application_type    = var.application_insights_application_type
  workspace_id        = azurerm_log_analytics_workspace.bsworkspace01.id
  depends_on          = [azurerm_log_analytics_workspace.bsworkspace01]
}

###############################################################################################################
# First we need to create central log analytics workspace
resource "azurerm_log_analytics_workspace" "bsworkspace02" {
  name                = "${var.webapp_name}-workspace777652"
  location            = var.location
  resource_group_name = var.resource_group_name
  sku                 = var.log_analytics_workspace_sku
  retention_in_days   = var.log_analytics_workspace_retention_in_days
  depends_on          = [azurerm_resource_group.appgrp]
}

# Now we can create application insights resource which is linked to central log analytics workspace
resource "azurerm_application_insights" "bsappinsights02" {
  name                = "${var.webapp_name}-appinsights02"
  location            = var.location
  resource_group_name = var.resource_group_name
  application_type    = var.application_insights_application_type
  workspace_id        = azurerm_log_analytics_workspace.bsworkspace02.id
  depends_on          = [azurerm_log_analytics_workspace.bsworkspace02]
}
