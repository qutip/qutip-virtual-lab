#!/bin/bash

micromamba deactivate 
micromamba remove -n pyjs-build-env --all 
micromamba create -n pyjs-build-env -f build-environment.yaml -y 
micromamba activate pyjs-build-env 
micromamba create -n pyjs-web-env --platform=emscripten-32 -f web-environment.yaml 
empack pack env \
--env-prefix=/home/trent/micromamba/envs/pyjs-web-env \
--relocate-prefix=/ \
--no-use-cache \
--outdir=./build \
--config=empack_config.yml 
cp -r /home/trent/micromamba/envs/pyjs-web-env/lib_js/pyjs ./build/ 
python -m http.server --directory build

