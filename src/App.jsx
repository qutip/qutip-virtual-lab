import './App.css';

import React, {
  useEffect,
  useState,
} from 'react';

import { hot } from 'react-hot-loader/root';

import reactLogo from './assets/react.svg';
import loadWasm from './loadWasm';

function App() {
  const [qutipVersion, setQutipVersion] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    const init = async () => {
      setIsLoading(true)
      const pyjs = await loadWasm(setQutipVersion)
      const main_scope = pyjs.main_scope()
      await pyjs.exec("import qutip;  print(qutip.__version__);", main_scope)
      setIsLoading(false)
    }
    init()
  }, [])
  return (
    <>
      <div>
        <div>QuTip Virtual Lab</div>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <div className="card">
        <p>
          {isLoading ? 'Loading...' : `Running QuTiP version ${qutipVersion}`}
        </p>
      </div>

    </>
  )
}

export default hot(App)
