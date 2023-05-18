SONARQUBE_URL=13.232.132.105:9000
REPO_NAME=$(pwd)
PROJECT_KEY=NFT_UI
CACHE_PATH=$(pwd)/.sonar-cache
EXCLUSION_LIST="venv/**, static/**, cypress/**, dist/**, instrumented/** webpack.common.js webpack.qa.js webpack.prod.js webpack.dev.js"
SONARQUBE_KEY=ff0784f45b7a91ec90f793a61c73794c673535d0
docker run \
--rm \
-e SONAR_HOST_URL="http://${SONARQUBE_URL}" \
-e SONAR_LOGIN="${SONARQUBE_KEY}" \
-v "${REPO_NAME}:/usr/src" \
-v "$CACHE_PATH:/opt/sonar-scanner/.sonar/cache" \
sonarsource/sonar-scanner-cli -Dsonar.projectKey="$PROJECT_KEY" -Dsonar.exclusions="$EXCLUSION_LIST"
