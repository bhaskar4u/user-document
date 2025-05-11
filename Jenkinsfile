pipeline {
  agent any

  environment {
    DOCKER_REGISTRY = 'bhaskarsahni'
    IMAGE_TAG = "${env.BUILD_NUMBER}"
  }

  stages {

    stage('Checkout') {
      steps {
        git branch: 'master', url: 'https://github.com/bhaskar4u/user-document.git'
      }
    }

    stage('Build Docker Images') {
      steps {
        script {
          def services = ['auth', 'documents', 'ingestion', 'api-gateway']
          for (svc in services) {
            sh """
              docker build \
                --target production \
                -f apps/${svc}/Dockerfile \
                -t $DOCKER_REGISTRY/${svc}:${IMAGE_TAG} .
            """
          }
        }
      }
    }
  }
}

