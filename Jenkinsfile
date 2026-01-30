pipeline {
  agent any

  environment {
    DOCKER_HOST     = 'tcp://localhost:2375'
    DOCKER_REGISTRY = 'bhaskarsahni'
    IMAGE_TAG       = "${env.BUILD_NUMBER}"
    GIT_COMMIT      = ''
    DATE_TAG        = ''
  }

  stages {

    /* ---------------- CHECKOUT ---------------- */
    stage('Checkout') {
      steps {
        git branch: 'master',
            url: 'https://github.com/bhaskar4u/user-document.git'
      }
    }

    /* ---------------- INIT TAGS ---------------- */
    stage('Init Tags') {
      steps {
        script {
          env.GIT_COMMIT = bat(
            script: 'git rev-parse --short HEAD',
            returnStdout: true
          ).trim()

          env.DATE_TAG = bat(
            script: 'powershell -Command "Get-Date -Format yyyyMMddHHmmss"',
            returnStdout: true
          ).trim()
        }
      }
    }

    /* ---------------- DOCKER LOGIN ---------------- */
    stage('Docker Login') {
      steps {
        withCredentials([
          usernamePassword(
            credentialsId: 'docker-hub-credentials',
            usernameVariable: 'DOCKERHUB_USER',
            passwordVariable: 'DOCKERHUB_PASS'
          )
        ]) {
          bat 'echo Logging into Docker Hub...'
          bat 'echo %DOCKERHUB_PASS% | docker login -u %DOCKERHUB_USER% --password-stdin'
        }
      }
    }

    /* ---------------- BUILD IMAGES ---------------- */
    stage('Build & Tag Docker Images') {
      steps {
        script {
          def services = ['auth', 'documents', 'ingestion', 'api-gateway']

          for (svc in services) {
            def dockerfilePath = "apps/${svc}/Dockerfile"
            def imageBase      = "${env.DOCKER_REGISTRY}/${svc}"

            echo "Building image for ${svc}..."

            bat """
              docker build ^
                --target production ^
                -f ${dockerfilePath} ^
                -t ${imageBase}:${env.IMAGE_TAG} ^
                -t ${imageBase}:${env.GIT_COMMIT} ^
                -t ${imageBase}:${env.DATE_TAG} ^
                .
            """
          }
        }
      }
    }

    /* ---------------- TESTS ---------------- */
    stage('Run Tests') {
      steps {
        bat 'npm ci'
        bat 'npm run test'
      }
    }

    /* ---------------- PUSH IMAGES ---------------- */
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

    /* ---------------- DEPLOY ---------------- */
    stage('Deploy') {
      steps {
        bat 'docker compose -f docker-compose.yml up -d --build'
      }
    }
  }

  /* ---------------- POST ---------------- */
  post {
    success {
      echo '✅ Pipeline executed successfully.'
    }
    failure {
      echo '❌ Build or deployment failed.'
    }
  }
}
