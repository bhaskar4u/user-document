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

   stage('Run Test for all service') {
      steps {
        bat 'npm install'
        bat 'npm run test'
      }
    }


     stage('Push to Docker Hub') {
      when {
        expression { return env.BRANCH_NAME == 'main' }
      }
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
          sh 'echo $PASSWORD | docker login -u $USERNAME --password-stdin'
          script {
            def services = ['auth', 'documents', 'ingestion', 'api-gateway']
            for (svc in services) {
              sh "docker push $DOCKER_REGISTRY/${svc}:${IMAGE_TAG}"
            }
          }
        }
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

