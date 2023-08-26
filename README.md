# qutip-virtual-lab
![example workflow](https://github.com/qutip/qutip-virtual-lab/actions/workflows/deploy.yml/badge.svg)

A virtual laboratory interface to QuTiP for learning and exploring quantum mechanics on tablets, phones and in the browser.

<a href="https://qutip.org/qutip-virtual-lab"><b>⚛ Go to QuTiP Virtual Lab ⚛</b></a>

## Building for Development

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

## Implementation

### Runtime

The application uses `Emscripten` compile QuTiP's Python code to WebAssembly, which can be run in the browser. 
The application uses the `empack` utility to build the runtime
It converts a list of Python packages into two files:

- pyjs_runtime_browser.js
- pyjs_runtime_browser.wasm

The list of Python packages to be included in the runtime are specified in the `web_environment.yml` file.

### Interface

As the user interacts with the Laboratory, the application translates the state of the Laboratory into valid Python source code and executes it.
The logic for this translation is implemented `Simulation.tsx` and `simulationUtils.ts`.
The generated Python source code ends with a series of `print` statements, which are used to pass the results back to Javascript.
When the WebAssembly runtime has completed, the `print` statements pass the data back to the Javascript code as a stream of strings.
This response is buffered and parsed as a JSON object, which then allows for the Javascript code to handle it.

### UI

The UI is implemented in React and Typescript.
For drawing the qubits, lasers, baths, and interactions, the application uses the `react-konva` library.
The Bloch spheres in the Results tab are implemented use the `react-three-fiber` library.

## Future Ideas

Plots of results:
- Hinton plots of results
- Wigner function of results

Testing:
- E2E testing

Performance:
- Load QuTiP in background using Web Workers


Styling:
- Responsiveness

-----

Credits: 

- Made by [Trent Fridey](https://github.com/trentfridey) with help from [Alex Pitchford](https://github.com/ajgpitch) and [Simon Cross](https://github.com/hodgestar)