#!/bin/bash
sudo docker run \
--user=root \
--mount type=bind,source=${PWD}/public,target=/runtime qutip-virtual-lab \
sh -c "cp -a /tmp/build/pyjs_runtime_browser.wasm /runtime && cp -a /tmp/build/empack/. /runtime/empack/" \
&&
sudo docker run \
--user=root \
--mount type=bind,source=${PWD}/src/pyjs,target=/runtime qutip-virtual-lab \
sh -c "cp -a /tmp/build/pyjs_runtime_browser.js /runtime"