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
    stage('Install & Unit Test') {
      steps {
        bat 'node -v'
        bat 'npm -v'
        bat 'corepack enable'
        bat 'npm install -g pnpm'
        bat 'pnpm --version'
        bat 'pnpm install --frozen-lockfile'
        bat 'pnpm run test'
      }
    }

    /* ---------------- PREPARE ENV ---------------- */
    stage('Prepare Env') {
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

    /* ---------------- DEBUG ---------------- */
    stage('Debug Compose Files') {
      steps {
        bat 'dir'
      }
    }

    /* ---------------- BUILD ---------------- */
    stage('Build Images') {
      steps {
        bat 'docker compose build'
      }
    }

    /* ---------------- PUSH (CI ONLY) ---------------- */
    stage('Push Images') {
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
        bat 'docker compose down'
        bat 'docker compose up -d --remove-orphans'
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
