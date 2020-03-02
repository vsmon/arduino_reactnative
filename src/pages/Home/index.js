import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  ScrollView,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {LineChart, AreaChart, Grid, YAxis} from 'react-native-svg-charts';
import AsyncStorage from '@react-native-community/async-storage';
import * as shape from 'd3-shape';

import {Container, MeasureText} from './styles';

import api from '../../services/api';

export default function Home({navigation}) {
  const [measures, setMeasures] = useState([]);
  const [newMeasures, setNewMeasures] = useState([]);
  const [temperature, setTemperature] = useState([]);
  const [humidity, setHumidity] = useState([]);
  const [pressure, setPressure] = useState([]);
  const [altitude, setAltitude] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const response = await api.get('data');
    setNewMeasures(response.data);
  }
  async function handleRefresh() {
    fetchData();
  }

  return (
    <Container>
      {/* <Button title="Atualizar" onPress={handleRefresh} /> 
      <Button
        title="Settings"
        onPress={() => navigation.navigate('Configuration')}
      />*/}
      {
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={handleRefresh} />
          }>
          <View>
            <MeasureText>{newMeasures.temperature}ºC</MeasureText>
            <View style={{height: 200, flexDirection: 'row'}}>
              <YAxis
                data={temperature}
                contentInset={{top: 20, bottom: 20}}
                svg={{
                  fill: 'grey',
                  fontSize: 10,
                }}
                numberOfTicks={10}
                formatLabel={value => `${value}ºC`}
              />
              <LineChart
                style={{flex: 1, marginLeft: 16}}
                data={temperature}
                svg={{stroke: 'rgb(134, 65, 244)'}}
                contentInset={{top: 20, bottom: 20}}>
                <Grid />
              </LineChart>
            </View>

            <MeasureText>Humidity: {newMeasures.humidity}%</MeasureText>
            <View style={{height: 200, flexDirection: 'row'}}>
              <YAxis
                data={humidity}
                contentInset={{top: 20, bottom: 20}}
                svg={{
                  fill: 'grey',
                  fontSize: 10,
                }}
                numberOfTicks={10}
                formatLabel={value => `${value}%`}
              />
              <LineChart
                style={{flex: 1, marginLeft: 16}}
                data={humidity}
                svg={{stroke: 'rgb(134, 65, 244)'}}
                contentInset={{top: 20, bottom: 20}}>
                <Grid />
              </LineChart>
            </View>

            <MeasureText>Pressure: {newMeasures.pressure}hPa</MeasureText>
            <View style={{height: 200, flexDirection: 'row'}}>
              <YAxis
                data={pressure}
                contentInset={{top: 20, bottom: 20}}
                svg={{
                  fill: 'grey',
                  fontSize: 10,
                }}
                numberOfTicks={10}
                formatLabel={value => `${value}hPa`}
              />
              <LineChart
                style={{flex: 1, marginLeft: 16}}
                data={pressure}
                svg={{stroke: 'rgb(134, 65, 244)'}}
                contentInset={{top: 20, bottom: 20}}>
                <Grid />
              </LineChart>
            </View>

            <MeasureText>Altitude: {newMeasures.altitude}Mts</MeasureText>
            <View style={{height: 200, flexDirection: 'row'}}>
              <YAxis
                data={altitude}
                contentInset={{top: 20, bottom: 20}}
                svg={{
                  fill: 'grey',
                  fontSize: 10,
                }}
                numberOfTicks={10}
                formatLabel={value => `${value}Mts`}
              />
              <LineChart
                style={{flex: 1, marginLeft: 16}}
                data={altitude}
                svg={{stroke: 'rgb(134, 65, 244)'}}
                contentInset={{top: 20, bottom: 20}}>
                <Grid />
              </LineChart>
            </View>
          </View>
        </ScrollView>
      }
    </Container>
  );
}
