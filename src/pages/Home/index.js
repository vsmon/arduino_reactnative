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
import axios from 'axios';

export default function Home({navigation}) {
  const [address, setAddress] = useState('http://192.168.0.40:3001');
  const [measures, setMeasures] = useState([]);
  const [newMeasures, setNewMeasures] = useState([]);
  const [temperature, setTemperature] = useState([
    /* 10,
    5,
    8,
    30,
    15,
    9,
    50,
    45,
    44,
    41, */
  ]);
  const [humidity, setHumidity] = useState([
    10,
    5,
    8,
    30,
    15,
    9,
    50,
    45,
    44,
    41,
  ]);
  const [pressure, setPressure] = useState([
    10,
    5,
    8,
    30,
    15,
    9,
    50,
    45,
    44,
    41,
  ]);
  const [altitude, setAltitude] = useState([
    10,
    5,
    8,
    30,
    15,
    9,
    50,
    45,
    44,
    41,
  ]);

  useEffect(() => {
    fetchData();
    getData();
  }, []);

  async function clear() {
    await AsyncStorage.removeItem('data');
  }
  async function fetchData() {
    try {
      storeData();
      const res = await AsyncStorage.getItem('address');

      const url = JSON.parse(res);

      const response = await api.get(`data`, {baseURL: url});

      setNewMeasures(response.data);

      let data = await AsyncStorage.getItem('data');
      data = JSON.parse(data);

      data.map(item => {
        setTemperature([...temperature, item.temperature]);
      });
    } catch (error) {
      alert(error);
    }
  }
  async function getData() {
    try {
      let data = await AsyncStorage.getItem('data');
      data = JSON.parse(data);
      data.map(item => {
        setTemperature([...temperature, item.temperature]);
      });
    } catch (error) {}
  }
  async function storeData() {
    try {
      let data = await AsyncStorage.getItem('data');
      if (!data) {
        await AsyncStorage.setItem('data', JSON.stringify(newMeasures));
        return;
      } else {
        data = JSON.parse(data);
        console.log(data);
        setMeasures([...measures, data]);
        await AsyncStorage.setItem('data', JSON.stringify(measures));
      }

      /* data.map(item => {
        setTemperature([...temperature, item.temperature]);
      }); */
    } catch (error) {
      alert(error);
    }
  }

  async function handleRefresh() {
    fetchData();
  }

  return (
    <Container>
      <Button title="Limpar Dados asyncstorage" onPress={clear} />
      <Button title="Salvar Dados asyncstorage" onPress={storeData} />
      <Button title="Atualizar" onPress={handleRefresh} />
      <Button
        title="Settings"
        onPress={() => navigation.navigate('Configuration')}
      />
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
