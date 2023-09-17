#!/bin/sh
echo ':: npx esbuild'
npx esbuild ./src/xenon-atomic.js --bundle --target=esnext --format=esm --outfile=./xenon-atomic.js
npx esbuild ./src/xenon-atomic.js --bundle --minify --sourcemap --target=esnext --format=esm --outfile=./xenon-atomic.min.js
echo ':: done.'
