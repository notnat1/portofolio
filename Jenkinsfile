pipeline {
    agent any

    tools {
        nodejs 'NodeJS 18'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from GitHub...'
                // Menggunakan credential 'github-ssh-key' yang sudah kita buat
                git credentialsId: 'github-ssh-key', url: 'git@github.com:notnat1/portofolio.git', branch: 'main'
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                echo 'Installing backend dependencies...'
                sh 'npm install'
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                echo 'Installing frontend dependencies...'
                dir('client') {
                    sh 'npm install'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                echo 'Building frontend...'
                dir('client') {
                    sh 'npm run build'
                }
            }
        }

        stage('Deploy (Placeholder)') {
            steps {
                echo 'Deployment will be configured in the next step.'
                echo 'This stage is a placeholder to confirm the build is working.'
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished.'
        }
    }
}
