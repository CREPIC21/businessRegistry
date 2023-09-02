## Azure Infrastructure Automation with Terraform

This project harnesses Terraform to streamline the provisioning of essential Azure resources, enabling the automated deployment of a web application on Azure Web App services.

The core concept behind this project is to programmatically automate the provisioning of a web application on Azure Web App using GitHub repository. The Azure Web App is configured with different slots - one for staging and one for production. This design allows for a clear separation of environments, with one slot serving as a testing and development environment and the other dedicated to production.

The project encompasses the creation of the following Azure resources:
- Resource Group: A logical container for Azure resources, helping in managing and organizing resources
- Service Plan: This determines the region, size, and capacity of the underlying web hosting plan for the web app. It's essential for optimizing resource allocation and scaling.
- Linux Web App: The core web application service that hosts web application code. It provides a platform for running your application.
- Web App Slot (for staging): Azure Web App slot used to create separate environments for testing, staging, or development. This staging slot allows to safely test new changes before deploying them to production.
- Web App Active Slot (for production): This slot represents the production environment for web application. It's where live application is hosted, and it can be seamlessly swapped with the staging slot to deploy updates.

In addition to the above resources, this project also includes the following for monitoring and diagnostics:
- Log Analytics Workspace: This resource sets up an Azure Log Analytics workspace, which is used for collecting and analyzing log data from various Azure resources. It helps in monitoring and gaining insights into the behavior of infrastructure.
- Application Insights: Used for monitoring the performance and usage of application. It provides detailed telemetry data, including request rates, failure rates, and dependency tracking, to help identify and diagnose issues in application.
- These monitoring and diagnostics resources (Log Analytics and Application Insights) play a crucial role in ensuring the reliability and performance of your web application by providing insights into its behavior and performance.

By combining Terraform with Azure resources like Log Analytics Workspace and Application Insights, this project not only automates the provisioning of the infrastructure but also empowers you with the tools to monitor, troubleshoot, and optimize web application effectively.

### Getting Started
1. Clone this repository to your local machine:
```shell
git clone https://github.com/CREPIC21/businessregistry
```
2. Change into the project directory:
```shell
cd businessregistry/azure_terraform/01_WebApp_Deployment
```
3. Initialize your Terraform workspace:
```shell
terraform init
```
### Terraform Configuration
Ensure that you review and customize the Terraform configuration according to your specific requirements, such as resource names, region etc.

### Deployment
1. Deploy the Azure resources by running:
```shell
terraform apply
```
- you will be prompted to confirm the deployment, type `yes` to proceed

2. Terraform will provision the specified Azure resources, including the Linux Web App. Once the deployment is complete, the `azurerm_app_service_source_control` resource will deploy the web application from GitHub.

### Clean Up
To avoid incurring unnecessary charges, it's essential to clean up the Azure resources when you're done with them. Run the following command to destroy the resources created by Terraform:
```shell
terraform destroy
```
- you will be prompted to confirm the deployment, type `yes` to proceed
