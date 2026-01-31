pipeline {
  agent any

  parameters {
    choice(
      name: 'ENV',
      choices: ['dev', 'ci'],
      description: 'dev = local only | ci = build + push + deploy'
    )
  }

  environment {
    DOCKER_BUILDKIT = '1'
    DOCKER_REGISTRY = 'bhaskarsahni'
    COMPOSE_FILE = "docker-compose.infra.yml;docker-compose.${params.ENV}.yml"
  }

  stages {

    /* ---------------- CHECKOUT ---------------- */
    stage('Checkout') {
      steps {
        git branch: 'master',
            url: 'https://github.com/bhaskar4u/user-document.git'
      }
    }

    /* ---------------- TEST ---------------- */
    stage('Test') {
      steps {
        bat 'npm ci'
        bat 'npm run test'
      }
    }

    /* ---------------- PREPARE ENV ---------------- */
    stage('Prepare Env (Conditional)') {
  steps {
    bat '''
      if exist apps\\.env (
        echo Using existing .env
      ) else (
        echo ERROR: apps\\.env not found
        exit /b 1
      )
    '''
  }
}
    stage('Verify Env') {
  steps {
    bat '''
      if not exist apps\\.env (
        echo ERROR: .env missing
        exit /b 1
      )
      for /f "usebackq delims==" %%A in (`findstr /R "=" apps\\.env`) do (
        echo ENV OK
        goto :done
      )
      echo ERROR: .env is empty
      exit /b 1
      :done
    '''
  }
}

    stage('Debug Compose Files') {
  steps {
    bat 'dir'
  }
}

    /* ---------------- BUILD (ALWAYS) ---------------- */
    stage('Build Images') {
      steps {
        bat 'docker compose build'
      }
    }

    /* ---------------- PUSH (CI ONLY) ---------------- */
    stage('Push Images (CI only)') {
      when {
        expression { params.ENV == 'ci' }
      }
      steps {
        withCredentials([
          usernamePassword(
            credentialsId: 'docker-hub-credentials',
            usernameVariable: 'DOCKERHUB_USER',
            passwordVariable: 'DOCKERHUB_PASS'
          )
        ]) {
          bat 'echo %DOCKERHUB_PASS% | docker login -u %DOCKERHUB_USER% --password-stdin'

          bat '''
            docker tag user-document2-auth        %DOCKER_REGISTRY%/auth:latest
            docker tag user-document2-documents   %DOCKER_REGISTRY%/documents:latest
            docker tag user-document2-ingestion   %DOCKER_REGISTRY%/ingestion:latest
            docker tag user-document2-api-gateway %DOCKER_REGISTRY%/api-gateway:latest

            docker push %DOCKER_REGISTRY%/auth:latest
            docker push %DOCKER_REGISTRY%/documents:latest
            docker push %DOCKER_REGISTRY%/ingestion:latest
            docker push %DOCKER_REGISTRY%/api-gateway:latest
          '''
        }
      }
    }

    /* ---------------- DEPLOY ---------------- */
    stage('Deploy') {
      steps {
        bat 'docker compose up -d'
      }
    }
  }

  post {
    success {
      echo "✅ ${params.ENV.toUpperCase()} pipeline completed successfully"
    }
    failure {
      echo "❌ ${params.ENV.toUpperCase()} pipeline failed"
    }
  }
}
