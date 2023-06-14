# qutip-virtual-lab
A virtual laboratory interface to QuTiP for learning and exploring quantum mechanics on tablets, phones and in the browser.

## Quick Start

You will need to have installed:

- [Node.js](https://nodejs.org/en)
- [Yarn](https://yarnpkg.com/getting-started/install)
- [Docker](https://docs.docker.com/engine/install/)

Clone the repo:

```sh
git clone https://github.com/qutip/qutip-virtual-lab && \
cd qutip-virtual-lab
```

Run `yarn` to install the Node.js dependencies:

```sh
yarn
```

Build the docker container, pack the QuTiP environment, and start development with:

```sh
yarn start:with_docker
```

Access the development build in your browser at `localhost:8080`
