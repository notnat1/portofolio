pipeline {
    agent any

    tools {
        nodejs 'NodeJS 18'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from GitHub...'
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

        stage('Deploy') {
            steps {
                echo 'Deploying application...'
                // Menggunakan variabel ${env.WORKSPACE} untuk path yang dinamis dan benar
                sh "sudo /usr/bin/rsync -av --delete ${env.WORKSPACE}/client/dist/ /var/www/portofolio.natte.site/"
                sh 'sudo /usr/bin/chown -R www-data:www-data /var/www/portofolio.natte.site/'
                sh 'sudo /usr/sbin/systemctl reload nginx'

                // Deploy Backend (Docker Compose)
                sh "cd ${env.WORKSPACE} && sudo /usr/local/bin/docker-compose down"
                sh "cd ${env.WORKSPACE} && sudo /usr/local/bin/docker-compose up -d --build"
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished.'
        }
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed!'
        }
    }
}
