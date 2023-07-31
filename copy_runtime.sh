#!/bin/bash
if [ ! -d "./src/pyjs" ]
then
    mkdir -p ./src/pyjs
fi
if [ ! -d "./public" ]
then
    mkdir -p ./public
fi
sudo docker run \
--user=root \
--mount type=bind,source=./public,target=/runtime qutip-virtual-lab \
sh -c "cp -a /tmp/build/pyjs_runtime_browser.wasm /runtime && cp -a /tmp/build/empack/. /runtime/empack/" \
&&
sudo docker run \
--user=root \
--mount type=bind,source=./src/pyjs,target=/runtime qutip-virtual-lab \
sh -c "cp -a /tmp/build/pyjs_runtime_browser.js /runtime"