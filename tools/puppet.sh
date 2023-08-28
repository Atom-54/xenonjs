#!/bin/sh
#set -m # enable job control

echo "[puppet.sh]:: spinning up webserver"

PORT=$(npm run --silent get_port)
node ./node_modules/local-web-server/bin/cli.mjs -p $PORT "$@" &
PID="$!";

echo "[puppet.sh]:: run puppeteer"
node ./tools/puppet.js
TEST_CODE="$?";

echo "[puppet.sh]:: kill webserver"
kill $PID || echo "server was not running"

# forward the puppeteer exit code
exit $TEST_CODE;
