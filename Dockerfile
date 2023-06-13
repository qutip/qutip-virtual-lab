FROM mambaorg/micromamba:jammy

# Copy over env/config files
COPY --chown=$MAMBA_USER:$MAMBA_USER build-environment.yaml /tmp/build-environment.yaml
COPY --chown=$MAMBA_USER:$MAMBA_USER web-environment.yaml /tmp/web-environment.yaml
COPY --chown=$MAMBA_USER:$MAMBA_USER empack_config.yaml /tmp/empack_config.yaml

# create build and web conda envs
RUN micromamba create --yes --file /tmp/build-environment.yaml
RUN eval "$(micromamba shell hook --shell=bash)" && \
    micromamba activate build && \
    micromamba create --yes --platform=emscripten-32 --file /tmp/web-environment.yaml && \
    micromamba clean --all --yes

# pack pyjs dependencies
RUN mkdir -p /tmp/build
RUN eval "$(micromamba shell hook --shell=bash)" && \
    micromamba activate build && \
     empack pack env \
    --env-prefix=web \
    --relocate-prefix=/ \
    --no-use-cache \
    --outdir=/tmp/build \
    --config=empack_config.yaml && \
    cp -r $MAMBA_ROOT_PREFIX/envs/web/lib_js/pyjs/. /tmp/build

RUN mkdir runtime