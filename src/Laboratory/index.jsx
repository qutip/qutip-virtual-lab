import React from 'react';

import {
  Layer,
  Stage,
} from 'react-konva';

import Grid from './Grid';
import Panel from './Panel';

const width = window.innerWidth-40;
const height = window.innerHeight-40;

export default function Laboratory() {
  return (
    <Stage
      width={width}
      height={height}
      style={{ background: "#252525", position: "absolute" }}
    >
      <Layer>
        <Grid width={width} height={height}/>
        <Panel x={0} />
      </Layer>
    </Stage>
  );
}

const dragProps = {
    onDragStart: null,
    onDragEnd: null,
    draggable: true,

}