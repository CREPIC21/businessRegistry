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
					echo "Path - $PATH"
					echo "Build Number - $env.BUILD_NUMBER"
					echo "Build ID - $env.BUILD_ID"
					echo "Job Name - $env.JOB_NAME"
					echo "Build Tag - $env.BUILD_TAG"
					echo "Build URL - $env.BUILD_URL"
				}
			}
			stage ('Build Docker Image') {
				steps {
					// docker build -t crepic21/hello-world-bsnodejs:${env.BUILD_ID}
					script {
						dockerImage = docker.build("crepic21/hello-world-bsnodejs:${env.BUILD_ID}")
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
			echo "I am awsome. I run always."
		}
		success {
			echo "I run when you are successful"
		}
		failure {
			echo "I run when you fail"
		}
		changed {
			echo "I run when you build fails showing what changed and vice versa"
		}
	}
}