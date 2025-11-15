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
                // Deploy Frontend
                sh "sudo /usr/bin/rsync -av --delete ${env.WORKSPACE}/client/dist/ /var/www/portofolio.natte.site/"
                sh 'sudo /usr/bin/chown -R www-data:www-data /var/www/portofolio.natte.site/'
                sh 'sudo /bin/systemctl reload nginx'

                // Deploy Backend (Docker Compose)
                echo 'FORCE-KILLING any process on conflicting ports...'
                // Menemukan dan membunuh proses di port 4329 dan 4238. '|| true' untuk mencegah error jika tidak ada proses yang ditemukan.
                sh "sudo kill -9 \$(sudo lsof -t -i:4329) || true"
                sh "sudo kill -9 \$(sudo lsof -t -i:4328) || true"

                sh "cd ${env.WORKSPACE} && sudo /usr/local/bin/docker-compose down --remove-orphans"
                sh "cd ${env.WORKSPACE} && sudo /usr/local/bin/docker-compose up -d --build backend"
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
