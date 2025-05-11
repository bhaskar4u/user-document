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

    stage('Run Tests') {
      steps {
        sh 'npm install'
        sh 'npm run test'
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
        sh 'docker compose -f docker.compose.yml up -d --build'
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
