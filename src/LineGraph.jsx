import './LineGraph.css';

import React from 'react';

import { InlineMath } from 'react-katex';

import {
  AxisBottom,
  AxisLeft,
} from '@visx/axis';
import { curveMonotoneX } from '@visx/curve';
import {
  LegendItem,
  LegendLabel,
  LegendOrdinal,
} from '@visx/legend';
import {
  scaleLinear,
  scaleOrdinal,
} from '@visx/scale';
import { LinePath } from '@visx/shape';

function zip (...arrays) {
  return arrays?.[0].map((_,i) => {
    return arrays.map((array) => array[i])
  }) 
}

export default function LineGraph({ data = [] }) {
  let dataSeq = data.length ? zip(...data, Array.from({length: data[0].length}, (x,i) => i)) : []
  
  const getSx = d => d[0]
  const getSy = d => d[1]
  const getSz = d => d[2]
  const getTime = d => d[3]

  const xScale = scaleLinear({
    domain: [0, Math.max(...dataSeq.map(getTime))],
    range: [20, 380],
    nice: true,
  });
  const yScale = scaleLinear({
    domain: [1, -1],
    range: [10, 90],
    nice: true,
  });
  const colorScale = scaleOrdinal({
    domain: ["S_x", "S_y", "S_z"],
    range: ["hotpink", "darkviolet", "mediumblue"],
  });

  return (
    <div>
      <svg width={400} height={100}>
        <LinePath
          curve={curveMonotoneX}
          data={dataSeq}
          x={(d) => xScale(getTime(d))}
          y={(d) => yScale(getSx(d))}
          stroke={"darkviolet"}
          strokeWidth={2}
        />
        <LinePath
          curve={curveMonotoneX}
          data={dataSeq}
          x={(d) => xScale(getTime(d))}
          y={(d) => yScale(getSy(d))}
          stroke={"hotpink"}
          strokeWidth={2}
        />
        <LinePath
          curve={curveMonotoneX}
          data={dataSeq}
          x={(d) => xScale(getTime(d))}
          y={(d) => yScale(getSz(d))}
          stroke={"mediumblue"}
          strokeWidth={2}
        />

        <AxisBottom scale={xScale} top={100 / 2} left={15} />
        <AxisLeft scale={yScale} left={35} numTicks={2} />
      </svg>
      <div className='label-container'>
        <LegendOrdinal scale={colorScale}>
          {(labels) => (
            <div>
              {labels.map((label) => (
                <LegendItem key={label.value}>
                  <svg width={10} height={10} key={label.value}>
                    <rect fill={label.value} width={10} height={10} />
                  </svg>
                  <LegendLabel style={{ marginLeft: 5 }}>
                    <InlineMath>{label.text}</InlineMath>
                  </LegendLabel>
                </LegendItem>
              ))}
            </div>
          )}
        </LegendOrdinal>
      </div>
    </div>
  );
}


