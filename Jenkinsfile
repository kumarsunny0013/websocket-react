pipeline {
     agent any
     stages {
        stage('Build') {

        steps {

            nodejs(nodeJSInstallationName: 'nodeJS_16.16.0') {

                sh """
                cd ./websocket-react
                npm install
                npm run-script build
                """
            }
        }
    }
        // stage("Deploy") {
        //     steps {
        //         sh "sudo rm -rf /var/www/jenkins-react-app"
        //         sh "sudo cp -r ${WORKSPACE}/build/ /var/www/jenkins-react-app/"
        //     }
        // }
    }
}