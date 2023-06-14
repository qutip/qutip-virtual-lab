FROM mambaorg/micromamba:jammy

# Copy over env/config files
COPY --chown=$MAMBA_USER:$MAMBA_USER build-environment.yaml /tmp/build-environment.yaml
COPY --chown=$MAMBA_USER:$MAMBA_USER web-environment.yaml /tmp/web-environment.yaml
COPY --chown=$MAMBA_USER:$MAMBA_USER empack_config.yaml /tmp/empack_config.yaml

# create base and web conda envs
RUN micromamba install -n base \
    --yes --file /tmp/build-environment.yaml \
    && \
    micromamba create \
    --yes \
    --platform=emscripten-32 \
    --file /tmp/web-environment.yaml && \
    micromamba clean --all --yes

# activate env
ARG ENV_NAME=base
ARG MAMBA_DOCKERFILE_ACTIVATE=1

# pack pyjs dependencies
RUN mkdir -p /tmp/build
RUN empack pack env \
    --env-prefix=$MAMBA_ROOT_PREFIX/envs/web \
    --relocate-prefix=/ \
    --no-use-cache \
    --outdir=/tmp/build \
    --config=empack_config.yaml && \
    cp -r $MAMBA_ROOT_PREFIX/envs/web/lib_js/pyjs/. /tmp/build

RUN mkdir runtime