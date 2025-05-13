pipeline {
  agent any

environment {
  DOCKER_HOST = 'tcp://localhost:2375'
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
        bat """
          docker build ^
            --target production ^
            -f apps/${svc}/Dockerfile ^
            -t %DOCKER_REGISTRY%/${svc}:%IMAGE_TAG% .
        """
      }
    }
  }
}

   stage('Run Test for all services') {
      steps {
        bat 'npm install'
        bat 'npm run test'
      }
    }
      stage('Deploy') {
      steps {
        bat 'docker compose -f docker.compose.yml up -d --build'
      }
    }
  
  }
  post {
    failure {
      echo "Build or deployment failed."
    }
    success {
      echo "Pipeline executed successfully."
    }
  }
  
}

