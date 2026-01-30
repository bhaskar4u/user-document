pipeline {
  agent any

  environment {
    DOCKER_REGISTRY = 'bhaskarsahni'
    IMAGE_TAG = "${env.BUILD_NUMBER}"
    DOCKER_BUILDKIT = '1'
  }

  stages {

    stage('Checkout') {
      steps {
        git branch: 'master', url: 'https://github.com/bhaskar4u/user-document.git'
      }
    }

    stage('Install & Test') {
      steps {
        bat 'npm ci'
        bat 'npm run test'
      }
    }

    stage('Docker Login') {
      steps {
        withCredentials([
          usernamePassword(
            credentialsId: 'docker-hub-credentials',
            usernameVariable: 'DOCKERHUB_USER',
            passwordVariable: 'DOCKERHUB_PASS'
          )
        ]) {
          bat 'echo %DOCKERHUB_PASS% | docker login -u %DOCKERHUB_USER% --password-stdin'
        }
      }
    }

    // stage('Build Images') {
    //   steps {
    //     script {
    //       def services = ['auth', 'documents', 'ingestion', 'api-gateway']

    //       for (svc in services) {
    //         def image = "${env.DOCKER_REGISTRY}/${svc}"

    //         bat """
    //           docker build ^
    //             --cache-from=${image}:latest ^
    //             -t ${image}:${env.IMAGE_TAG} ^
    //             -t ${image}:latest ^
    //             apps/${svc}
    //         """
    //       }
    //     }
    //   }
    // }
    stage('Build Images') {
      steps {
        script {
          def services = ['auth', 'documents', 'ingestion', 'api-gateway']

          for (svc in services) {
            def image = "bhaskarsahni/${svc}"

            bat """
            docker build ^
            --cache-from=${image}:latest ^
            -f apps/${svc}/Dockerfile ^
            -t ${image}:${BUILD_NUMBER} ^
            -t ${image}:latest ^
            .
            """
      }
    }
  }
}

    // stage('Push Images') {
    //   steps {
    //     script {
    //       def services = ['auth', 'documents', 'ingestion', 'api-gateway']

    //       for (svc in services) {
    //         def image = "${env.DOCKER_REGISTRY}/${svc}"

    //         bat "docker push ${image}:${env.IMAGE_TAG}"
    //         bat "docker push ${image}:latest"
    //       }
    //     }
    //   }
    }

    stage('Deploy') {
      steps {
        bat 'docker compose up -d'
      }
    }
  }

  post {
    success {
      echo '✅ Pipeline completed successfully'
    }
    failure {
      echo '❌ Pipeline failed'
    }
  }
}
