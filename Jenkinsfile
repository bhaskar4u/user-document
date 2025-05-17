pipeline {
  agent any

environment {
  DOCKER_HOST = 'tcp://localhost:2375'
  DOCKER_REGISTRY = 'bhaskarsahni'
  IMAGE_TAG = "${env.BUILD_NUMBER}"
  GIT_COMMIT = ""
  DATE_TAG = ""
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
      def gitSha = bat(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
      def dateTag = bat(script: 'powershell -Command "Get-Date -Format yyyyMMddHHmmss"', returnStdout: true).trim()
      
      env.GIT_COMMIT = gitSha
      env.DATE_TAG = dateTag
    }
  }
}


  stage('Docker Login') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
          bat 'echo Logging into Docker Hub...'
          bat "docker login -u %DOCKERHUB_USER% -p %DOCKERHUB_PASS%"
        }
      }
    }

stage('Build Docker Images') {
  steps {
    script {
      def services = ['auth', 'documents', 'ingestion', 'api-gateway']
      for (svc in services) {
        def dockerfilePath = "apps/${svc}/Dockerfile"
        def imageName = "${env.DOCKER_REGISTRY}/${svc}:${env.IMAGE_TAG}"
        echo "Pushing image: ${imageName}"

        bat """
          docker build ^
            --target production ^
            -f ${dockerfilePath} ^
            -t ${imageName} .
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
  steps {
    script {
      withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
        bat "echo %DOCKERHUB_PASS% | docker login -u %DOCKERHUB_USER% --password-stdin"

        def services = ['auth', 'documents', 'ingestion', 'api-gateway']
        for (svc in services) {
          bat "docker push %DOCKER_REGISTRY%/${svc}:%IMAGE_TAG%"
          bat "docker push %DOCKER_REGISTRY%/${svc}:%GIT_COMMIT%"
          bat "docker push %DOCKER_REGISTRY%/${svc}:%DATE_TAG%"
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

