#!/bin/bash
if [ ! -d "./src/pyjs" ]
then
    mkdir -p ./src/pyjs
fi
if [ ! -d "./public" ]
then
    mkdir -p ./public
fi

# copy wasm runtime to ./public/
sudo docker run \
--user=root \
--mount type=bind,source=${PWD}/public,target=/runtime qutip-virtual-lab \
sh -c "cp -a /tmp/build/pyjs_runtime_browser.wasm /runtime && cp -a /tmp/build/empack/. /runtime/empack/" \
&&
# copy js runtime to ./src/pyjs/
sudo docker run \
--user=root \
--mount type=bind,source=${PWD}/src/pyjs,target=/runtime qutip-virtual-lab \
sh -c "cp -a /tmp/build/pyjs_runtime_browser.js /runtime" \