// // SCRIPTED PIPELINE APROACH
// node {
// 	stage('Build') {
// 		echo "Build"
// 	}
// 	stage('Test') {
// 		echo "Test"
// 	}
// 	stage('Integration Test') {
// 		echo "Integration Test"
// 	}
// 	echo "Build"
// 	echo "Test"
// 	echo "Integration Test"
// }

// DECLARETIVE PIPELINE APROACH
pipeline {
	agent any
	environment {
		dockerHome = tool "myDocker"
        nodejsHome = tool "myNodeJS"
		PATH="$dockerHome/bin:$nodejsHome/bin:$PATH"
	}
	stages {
			stage('Checkout') {
				steps {
					sh "node --version"
					sh "docker version"
					// echo "Path - $PATH"
					// echo "Build Number - $env.BUILD_NUMBER"
					// echo "Build ID - $env.BUILD_ID"
					// echo "Job Name - $env.JOB_NAME"
					// echo "Build Tag - $env.BUILD_TAG"
					// echo "Build URL - $env.BUILD_URL"
				}
			}
			stage ('Build Docker Image') {
				steps {
					// dockerImage = sh "docker build -t crepic21/hello-world-bsnodejs:${env.BUILD_ID} --build-arg MONGO_URI_ARG='${env.MONGO_URI}' ."
					script {
						dockerImage = docker.build("crepic21/hello-world-bsnodejs:${env.BUILD_ID}", "--build-arg NODE_ENV_ARG='${env.NODE_ENV}' --build-arg PORT_ARG='${env.PORT}' --build-arg MONGO_URI_ARG='${env.MONGO_URI}' --build-arg GEOCODER_PROVIDER_ARG='${env.GEOCODER_PROVIDER}' --build-arg GEOCODER_API_KEY_ARG='${env.GEOCODER_API_KEY}' --build-arg FILE_UPLOAD_PATH_ARG='${env.FILE_UPLOAD_PATH}' --build-arg MAX_FILE_UPLOAD_ARG='${env.MAX_FILE_UPLOAD}' --build-arg JWT_SECRET_ARG='${env.JWT_SECRET}' --build-arg JWT_EXPIRE_ARG='${env.JWT_EXPIRE}' --build-arg JWT_COOKIE_EXPIRE_ARG='${env.JWT_COOKIE_EXPIRE}' --build-arg SMTP_HOST_ARG='${env.SMTP_HOST}' --build-arg SMTP_PORT_ARG='${env.SMTP_PORT}' --build-arg SMTP_EMAIL_ARG='${env.SMTP_EMAIL}' --build-arg SMTP_PASSWORD_ARG='${env.SMTP_PASSWORD}' --build-arg FROM_EMAIL_ARG='${env.FROM_EMAIL}' --build-arg FROM_NAME_ARG='${env.FROM_NAME}' --build-arg PAY_PAL_CLIENT_ID_ARG='${env.PAY_PAL_CLIENT_ID}' --build-arg PAY_PAL_CLIENT_SECRET_ARG='${env.PAY_PAL_CLIENT_SECRET}' --build-arg SHEETY_API_POST_ARG='${env.SHEETY_API_POST}' .")
					}
				}
			}
			stage ('Push Docker Image') {
				steps {
                    // docker push crepic21/hello-world-bsnodejs:${env.BUILD_ID}
					script {
						docker.withRegistry("", "dockerHub") {
							dockerImage.push();
							// dockerImage.push('latest');
						}
					}
				}
		}
	} 
	post {
		always {
			echo "I run always."
		}
		success {
			echo "I run when you are successful."
		}
		failure {
			echo "I run when you fail."
		}
		changed {
			echo "I run when build fails showing what changed and vice versa."
		}
	}
}

// IMPORTANT -> JENKINS SETUP for ENVs
// - https://blog.bitsrc.io/how-to-pass-environment-info-during-docker-builds-1f7c5566dd0e
// - add all envs from config.env to Manage Jenkins -> Configure System -> Global properties -> Environment variables
// - set up ARGs for all envs from config.env in Dockerfile and add them to docker.build command
// - set up ENVs in Dockerfile to reference coresponding ARGs

// NODEJS PLUGIN
// - https://blog.devgenius.io/integrating-jenkins-with-a-nodejs-project-219d249b1fb2

// TESTING
// - once the image is build and pushed using Jenkins pipeline, pull the image fro DockerHub and test if container is working
// - docker run -i -t -d -p 5000:5000 crepic21/hello-world-bsnodejs:<tag_name>