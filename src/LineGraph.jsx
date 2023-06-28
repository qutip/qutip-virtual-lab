import './LineGraph.css';

import React from 'react';

import { InlineMath } from 'react-katex';

import {
  AxisBottom,
  AxisLeft,
} from '@visx/axis';
import { curveMonotoneX } from '@visx/curve';
import { localPoint } from '@visx/event';
import {
  LegendItem,
  LegendLabel,
  LegendOrdinal,
} from '@visx/legend';
import {
  scaleLinear,
  scaleOrdinal,
} from '@visx/scale';
import {
  Bar,
  Line,
  LinePath,
} from '@visx/shape';

function zip(...arrays) {
  return arrays?.[0].map((_, i) => {
    return arrays.map((array) => array[i]);
  });
}

const width = 360;
const height = 80;
const margin = {
  top: 10,
  right: 30,
  bottom: 10,
  left: 20,
};

const axisLeft = 15

export default function LineGraph({ data = [], time, onHover, onBlur }) {
  let dataSeq = data.length
    ? zip(
        ...data,
        Array.from({ length: data[0].length }, (x, i) => i)
      )
    : [];

  const getSx = (d) => d[0];
  const getSy = (d) => d[1];
  const getSz = (d) => d[2];
  const getTime = (d) => d[3];

  const xScale = scaleLinear({
    domain: [0, Math.max(...dataSeq.map(getTime))],
    range: [margin.left+axisLeft, axisLeft + margin.left + width],
    nice: true,
  });
  const yScale = scaleLinear({
    domain: [1, -1],
    range: [margin.top, margin.top + height],
    nice: true,
  });
  const colorScale = scaleOrdinal({
    domain: [
      "\\langle S_x \\rangle",
      "\\langle S_y \\rangle",
      "\\langle S_z \\rangle",
    ],
    range: ["hotpink", "darkviolet", "mediumblue"],
  });

  const lineX = xScale(time)

  const handleHover = (e) => {
    const { x } = localPoint(e);
    const time = xScale.invert(x);
    onHover(Number.isFinite(time) ? time : 0);
  };

  return (
    <div>
      <svg width={400} height={100}>
        <LinePath
          curve={curveMonotoneX}
          data={dataSeq}
          x={(d) => xScale(getTime(d))}
          y={(d) => yScale(getSx(d))}
          stroke={"hotpink"}
          strokeWidth={2}
        />
        <LinePath
          curve={curveMonotoneX}
          data={dataSeq}
          x={(d) => xScale(getTime(d))}
          y={(d) => yScale(getSy(d))}
          stroke={"darkviolet"}
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
        <AxisBottom scale={xScale} top={100 / 2} />
        <AxisLeft
          scale={yScale}
          left={35}
          numTicks={2}
          tickFormat={(v) => v.toFixed(0)}
        />
        {data.length && (
          <>
              {(time !== null) && <Line
                from={{ x: lineX, y: margin.top }}
                to={{ x: lineX, y: height + margin.top }}
                stroke="black"
                strokeWidth={2}
              />}
            <Bar
              x={margin.left+axisLeft}
              y={margin.right}
              width={width}
              height={height}
              fill="transparent"
              onMouseEnter={handleHover}
              onMouseMove={handleHover}
              onMouseLeave={onBlur}
            />
          </>
        )}
      </svg>
      <div className="label-container">
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
