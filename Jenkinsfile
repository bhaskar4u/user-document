pipeline {
  agent any

  environment {
    DOCKER_BUILDKIT = '1'
  }

  stages {
    stage('Checkout') {
      steps {
        git branch: 'master', url: 'https://github.com/bhaskar4u/user-document.git'
      }
    }

    stage('Test') {
      steps {
        bat 'npm ci'
        bat 'npm run test'
      }
    }

    stage('Build & Deploy') {
      steps {
        bat 'docker compose up -d --build'
      }
    }
  }

  post {
    success {
      echo '✅ Built & deployed locally (no registry)'
    }
    failure {
      echo '❌ Pipeline failed'
    }
  }
}
