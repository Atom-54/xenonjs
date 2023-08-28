#!/bin/sh
echo ':: npx esbuild'
npx esbuild ./atomic-src.js --bundle --format=esm --outfile=../atomic.js
npx esbuild ./atomic-src.js --bundle --minify --sourcemap --analyze --format=esm --outfile=../atomic.min.js
echo ':: done.'
