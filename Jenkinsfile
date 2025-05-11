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

}
}

