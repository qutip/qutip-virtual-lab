import './Footer.css';

import React from 'react';

import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Footer({isLoading, qutipVersion}) {
  return (
    <div className='footer'>
      {isLoading ? "Loading..." : `QuTiP version ${qutipVersion}`}
      {isLoading && <FontAwesomeIcon icon={faSpinner} spinPulse />}
    </div>
  );
}
