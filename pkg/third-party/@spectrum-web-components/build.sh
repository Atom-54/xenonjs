#!/bin/sh
#bun build --minify ./bundle.js --outfile bundle.min.js
#esbuild ./bundle.js --bundle --minify --outfile=bundle.min.js
esbuild ./bundle.js --bundle --outfile=bundle.min.js