import './App.css';

import Demos from './Demos';
import Details from './Details';
import Laboratory from './Laboratory';
import Results from './Results';
import SubmitButton from './SubmitButton';

function App() {

  return (
    <>
      <Laboratory />
      <div className="main">
        <details id="details-toggle">
          <summary>DETAILS</summary>
          <Details />
        </details>
        <details id="results-toggle">
          <summary>
            RESULTS
          </summary>
          <Results />
        </details>
        <SubmitButton />
        <Demos/>
      </div>
    </>
  );
}

export default App;
