#!/bin/sh
clear
set -m # enable job control
PORT=$(npm run --silent get_port)

cd pkg
node ../node_modules/local-web-server/bin/cli.mjs -p $PORT "$@" &

echo $! >> /tmp/xenonjs_core_server.pid
fg # wait on the server
