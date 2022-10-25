import React from 'react';
import {Dimensions} from 'react-native';
import {
  VictoryChart,
  VictoryVoronoiContainer,
  VictoryLine,
  VictoryTooltip,
  VictoryTheme,
} from 'victory-native';

export default function Chart({data, symbol, lineColor}) {
  return (
    <VictoryChart
      height={250}
      width={Dimensions.get('window').width - 1}
      theme={VictoryTheme.material}
      /* containerComponent={
                  <VictoryCursorContainer
                    cursorLabel={({datum}) => `${datum.y.toFixed(2)}`}
                    cursorLabelComponent={
                      <VictoryLabel
                        style={[
                          {fill: 'white', fontSize: 25},
                          {fill: 'green', fontFamily: 'monospace'},
                        ]}
                      />
                    }
                    cursorLabelOffset={{x: 130, y: -10}}
                    cursorComponent={<Line style={{stroke: 'white'}} />}
                  />
                } */
      containerComponent={
        <VictoryVoronoiContainer
          labels={({datum}) => `${datum.y.toFixed(2)}${symbol}`}
          labelComponent={
            <VictoryTooltip
              centerOffset={{x: -25, y: -55}}
              dy={-7}
              constrainToVisibleArea
              style={[
                {fill: 'black', fontSize: 20, padding: 10},
                {fill: 'green', fontFamily: 'monospace'},
              ]}
            />
          }
        />
      }>
      <VictoryLine
        style={{
          data: {
            stroke: lineColor,
            strokeWidth: 2, //({data}) => data.length,
          },
          labels: {
            fontSize: 15,
            fill:
              /* ({datum}) =>
                        datum.x === 3 ? '#000000' : */ '#c43a31',
          },
        }}
        data={data}
        colorScale="red"
      />
    </VictoryChart>
  );
}
