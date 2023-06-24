import './App.css';

import Details from './Details';
import Laboratory from './Laboratory';
import Results from './Results';
import Simulation from './Simulation';

function App() { 
  
  return (
    <Simulation>
      <div className="main">
        <div className="panel--lab">
          <Laboratory />
          <Details/>
        </div>
        <div className="panel--lab">
        <Results/>
        </div>
      </div>
      {/* <Footer isLoading={isLoading} qutipVersion={qutipVersion}/> */}
    </Simulation>
  );
}

export default App;
