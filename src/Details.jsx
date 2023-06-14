import './Details.css';
import 'katex/dist/katex.min.css';

import React, { useState } from 'react';

import { BlockMath } from 'react-katex';

import loadWasm from './loadWasm';

export default function Details () {
    const [result, setResult] = useState('')
    const handleSimulate = async () => {
        const pyjs = await loadWasm(setResult)
      const main_scope = pyjs.main_scope()
        await pyjs.exec(`from qutip import *; import numpy as np; psi = (2.0 * basis(2, 0) + basis(2, 1)).unit(); H = sigmaz(); times = np.linspace(0, 10, 100); result = sesolve(H, psi, times, [sigmay()]); print(result.expect[0])`);
    }
    return <div>
        <h2>Details</h2>
        <div>
            <BlockMath>
                {'\\mathcal{H} = \\lambda_1 \\sigma_x^{(1)}'}
            </BlockMath>
        </div>
        <button onClick={handleSimulate}>Simulate</button>
        <div>{JSON.stringify(result)}</div>
        </div>
}