pipeline {
  agent any

  environment {
    DOCKER_HOST = 'tcp://localhost:2375'
    DOCKER_REGISTRY = 'bhaskarsahni'
    IMAGE_TAG = "${env.BUILD_NUMBER}"
    GIT_COMMIT = ''
    DATE_TAG = ''
  }

  stages {
    stage('Checkout') {
      steps {
        git branch: 'master', url: 'https://github.com/bhaskar4u/user-document.git'
      }
    }

    stage('Init Tags') {
      steps {
        script {
          env.GIT_COMMIT = bat(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
          env.DATE_TAG = bat(script: 'powershell -Command "Get-Date -Format yyyyMMddHHmmss"', returnStdout: true).trim()
        }
      }
    }

    stage('Docker Login') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
          bat 'echo Logging into Docker Hub...'
          bat "echo %DOCKERHUB_PASS% | docker login -u %DOCKERHUB_USER% --password-stdin"
        }
      }
    }

    stage('Build & Tag Docker Images') {
      steps {
        script {
          def services = ['auth', 'documents', 'ingestion', 'api-gateway']

          for (svc in services) {
            def dockerfilePath = "apps/${svc}/Dockerfile"
            def imageBase = "${env.DOCKER_REGISTRY}/${svc}"
            def imageTag = "${imageBase}:${env.IMAGE_TAG}"
            def gitTag = "${imageBase}:${env.GIT_COMMIT}"
            def dateTag = "${imageBase}:${env.DATE_TAG}"

            echo "Building image for ${svc}..."
            bat """
              docker build ^
                --target production ^
                -f ${dockerfilePath} ^
                -t ${imageTag} ^
                -t ${gitTag} ^
                -t ${dateTag} .
            """
          }
        }
      }
    }

    stage('Run Tests') {
      steps {
        bat 'npm install'
        bat 'npm run test'
      }
    }

    stage('Push Docker Images') {
      steps {
        script {
          def services = ['auth', 'documents', 'ingestion', 'api-gateway']

          for (svc in services) {
            def imageBase = "${env.DOCKER_REGISTRY}/${svc}"
            def tags = [env.IMAGE_TAG, env.GIT_COMMIT, env.DATE_TAG]

            for (tag in tags) {
              if (tag?.trim()) {
                def fullImage = "${imageBase}:${tag}"
                echo "Pushing image: ${fullImage}"
                bat "docker push ${fullImage}"
              }
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
      echo 'Build or deployment failed.'
    }
    success {
      echo 'Pipeline executed successfully.'
    }
  }
}
