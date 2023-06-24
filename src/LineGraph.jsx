import './LineGraph.css';

import React from 'react';

import PropTypes from 'prop-types';
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

const demoData = Array.from({ length: 20 }, (x, i) => ({
  time: i,
  sx: Math.sin(i / 2),
  sy: Math.cos(i / 2),
  sz: 1,
}));

export default function LineGraph({ data = demoData }) {
  const getSy = (d) => d.sy;
  const getSx = (d) => d.sx;
  const getSz = (d) => d.sz;

  const getTime = (d) => d.time;

  const xScale = scaleLinear({
    domain: [0, data.length],
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
    range: ["#333", "#888", "#aaa"],
  });

  return (
    <div>
      <svg width={400} height={100}>
        <LinePath
          curve={curveMonotoneX}
          data={data}
          x={(d) => xScale(getTime(d))}
          y={(d) => yScale(getSx(d))}
          stroke={"#888"}
          strokeWidth={2}
        />
        <LinePath
          curve={curveMonotoneX}
          data={data}
          x={(d) => xScale(getTime(d))}
          y={(d) => yScale(getSy(d))}
          stroke={"#333"}
          strokeWidth={2}
        />
        <LinePath
          curve={curveMonotoneX}
          data={data}
          x={(d) => xScale(getTime(d))}
          y={(d) => yScale(getSz(d))}
          stroke={"#aaa"}
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

LineGraph.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      time: PropTypes.number,
      sx: PropTypes.number,
      sy: PropTypes.number,
      sz: PropTypes.number,
    })
  ),
};
