import './App.css';

import React, {
  useEffect,
  useState,
} from 'react';

import Details from './Details';
import Footer from './Footer';
import Laboratory from './Laboratory';
import loadWasm from './loadWasm';
import Results from './Results';

function App() {
  const [qutipVersion, setQutipVersion] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const pyjs = await loadWasm(setQutipVersion)
      const main_scope = pyjs.main_scope()
      const version = await pyjs.exec("import qutip;  print(qutip.__version__);", main_scope)
      console.log(version)
      setIsLoading(false);
    };
    // init();
  }, []);
  return (
    <>
      <div className="main">
        <div className="panel--lab">
          <Laboratory />
          <Details />
        </div>
        <div className="panel--lab">
        <Results />
        </div>
      </div>
      <Footer isLoading={isLoading} qutipVersion={qutipVersion}/>
    </>
  );
}

export default App;
