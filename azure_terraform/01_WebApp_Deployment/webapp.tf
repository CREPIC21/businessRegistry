/*

Dcumentation:

1. azurerm_service_plan - https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/service_plan

2. azurerm_linux_web_app - https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/linux_web_app

3. azurerm_app_service_source_control - https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/app_service_source_control

*/

# Creating App Service Plan
resource "azurerm_service_plan" "webappplan" {
  name                = var.service_plan_name
  resource_group_name = var.resource_group_name
  location            = var.location
  os_type             = var.webappplan_os_type
  sku_name            = var.webappplan_sku_name
  depends_on          = [azurerm_resource_group.appgrp]
}

# Creating Web App
resource "azurerm_linux_web_app" "businessregistry" {
  name                = var.webapp_name
  resource_group_name = var.resource_group_name
  location            = var.location
  service_plan_id     = azurerm_service_plan.webappplan.id

  site_config {
    application_stack {
      node_version = var.web_app_node_version
    }
  }

  app_settings = {
    // envs
    "NODE_ENV"              = var.NODE_ENV
    "PORT"                  = var.PORT
    "MONGO_URI"             = var.MONGO_URI
    "GEOCODER_PROVIDER"     = var.GEOCODER_PROVIDER
    "GEOCODER_API_KEY"      = var.GEOCODER_API_KEY
    "FILE_UPLOAD_PATH"      = var.FILE_UPLOAD_PATH
    "MAX_FILE_UPLOAD"       = var.MAX_FILE_UPLOAD
    "JWT_SECRET"            = var.JWT_SECRET
    "JWT_EXPIRE"            = var.JWT_EXPIRE
    "JWT_COOKIE_EXPIRE"     = var.JWT_COOKIE_EXPIRE
    "SMTP_HOST"             = var.SMTP_HOST
    "SMTP_PORT"             = var.SMTP_PORT
    "SMTP_EMAIL"            = var.SMTP_EMAIL
    "SMTP_PASSWORD"         = var.SMTP_PASSWORD
    "FROM_EMAIL"            = var.FROM_EMAIL
    "FROM_NAME"             = var.FROM_NAME
    "PAY_PAL_CLIENT_ID"     = var.PAY_PAL_CLIENT_ID
    "PAY_PAL_CLIENT_SECRET" = var.PAY_PAL_CLIENT_SECRET
    "SHEETY_API_POST"       = var.SHEETY_API_POST

    // mapping our Web App to application insights
    "APPINSIGHTS_INSTRUMENTATIONKEY"             = azurerm_application_insights.bsappinsights.instrumentation_key
    "APPLICATIONINSIGHTS_CONNECTION_STRING"      = azurerm_application_insights.bsappinsights.connection_string
    "ApplicationInsightsAgent_EXTENSION_VERSION" = "~3"
    "XDT_MicrosoftApplicationInsights_Mode"      = "default"
  }
  depends_on = [
    azurerm_service_plan.webappplan
  ]
}

# Creating a resource for source control to deploy the app from GitHub to the Web App
resource "azurerm_app_service_source_control" "bs_source_control" {
  app_id                 = azurerm_linux_web_app.businessregistry.id
  repo_url               = var.bs_source_control_repo_url
  branch                 = var.bs_source_control_repo_branch
  use_manual_integration = true
  depends_on             = [azurerm_linux_web_app.businessregistry]
}
