pipeline {
  agent any

  parameters {
    choice(
      name: 'ENV',
      choices: ['dev', 'ci'],
      description: 'Select environment (dev / ci)'
    )
  }

  environment {
    DOCKER_BUILDKIT = '1'
    COMPOSE_FILE    = "docker-compose.infra.yml;docker-compose.${params.ENV}.yml"
  }

  stages {

    /* ---------------- CHECKOUT ---------------- */
    stage('Checkout') {
      steps {
        git branch: 'master',
            url: 'https://github.com/bhaskar4u/user-document.git'
      }
    }

    /* ---------------- INSTALL & TEST ---------------- */
    stage('Test') {
      steps {
        bat 'npm ci'
        bat 'npm run test'
      }
    }

    /* ---------------- PREPARE ENV (SECURE) ---------------- */
    stage('Prepare Env') {
      steps {
        script {
          def envCredentialMap = [
            dev: 'apps-env-dev',
            ci : 'apps-env-ci'
          ]

          withCredentials([
            file(
              credentialsId: envCredentialMap[params.ENV],
              variable: 'ENV_FILE'
            )
          ]) {
            bat '''
              if not exist apps mkdir apps
              copy %ENV_FILE% apps\\.env
            '''
          }
        }
      }
    }

    /* ---------------- BUILD & DEPLOY ---------------- */
    stage('Build & Deploy') {
      steps {
        bat 'docker compose up -d --build'
      }
    }
  }

  post {
    success {
      echo "✅ Deployed successfully using ENV=${params.ENV}"
    }
    failure {
      echo "❌ Pipeline failed"
    }
    always {
      echo "🧹 Build finished"
    }
  }
}
