import React from 'react';
import {Dimensions, View} from 'react-native';
import {
  VictoryChart,
  VictoryVoronoiContainer,
  VictoryLine,
  VictoryTooltip,
  VictoryTheme,
  VictoryAxis,
} from 'victory-native';

export default function Chart({data, symbol, lineColor}) {
  VictoryTheme.material.axis.style.grid.stroke = '#CCC3';
  return (
    <View>
      <VictoryChart
        height={250}
        width={Dimensions.get('window').width}
        theme={VictoryTheme.material}
        containerComponent={
          <VictoryVoronoiContainer
            labels={({datum}) =>
              `${datum.y.toFixed(2)}${symbol}\n${datum.x.toLocaleString(
                'pt-BR',
                {
                  timeZone: 'America/Sao_Paulo',
                },
              )}`
            }
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
        {/* <VictoryAxis
        dependentAxis
        //offsetY={100}
        tickFormat={tick => `${tick}`}
        style={{
          grid: {stroke: '#F4F5F7', strokeWidth: 0.2},
        }}
      /> */}
      </VictoryChart>
    </View>
  );
}

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
