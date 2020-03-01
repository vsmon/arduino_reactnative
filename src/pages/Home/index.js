import React, {useState, useEffect} from 'react';
import {View, Text, Button, FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {LineChart, Grid, YAxis} from 'react-native-svg-charts';
import AsyncStorage from '@react-native-community/async-storage';

import {Container, TempText} from './styles';

import api from '../../services/api';

export default function Home({navigation, icon}) {
  const [measures, setMeasures] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    const res = await api.get('data');

    const {temperature, humidity, pressure, altitude} = res.data;

    await AsyncStorage.setItem('data', JSON.stringify(res.data), error => {
      alert('Ocorreu um erro ao salvar dados!', error);
    });

    const data = await AsyncStorage.getItem('data', error => {
      alert('Ocorreu um erro ao obter dados!', error);
    });
    setMeasures(data);
  }

  function handleRefresh() {
    getData();
  }

  const temperatureList = [
    50,
    10,
    40,
    95,
    -4,
    -24,
    85,
    91,
    35,
    53,
    -53,
    24,
    50,
    -20,
    -80,
  ];
  const humidityList = [
    50,
    10,
    40,
    95,
    -4,
    -24,
    85,
    91,
    35,
    53,
    -53,
    24,
    50,
    -20,
    -80,
  ];
  const pressureList = [
    50,
    10,
    40,
    95,
    -4,
    -24,
    85,
    91,
    35,
    53,
    -53,
    24,
    50,
    -20,
    -80,
  ];
  const altitudeList = [
    50,
    10,
    40,
    95,
    -4,
    -24,
    85,
    91,
    35,
    53,
    -53,
    24,
    50,
    -20,
    -80,
  ];

  return (
    <Container>
      <Text>{measures.temperature}</Text>
      <FlatList
        data={temperatureList}
        renderItem={({item}) => <Text>{item}</Text>}
        keyExtractor={item => item.length}
      />
      <TempText>{measures.temperature}ºC</TempText>

      <View style={{height: 200, flexDirection: 'row'}}>
        <YAxis
          data={temperatureList}
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
          data={temperatureList}
          svg={{stroke: 'rgb(134, 65, 244)'}}
          contentInset={{top: 20, bottom: 20}}>
          <Grid />
        </LineChart>
      </View>
      <Text>Humidity: {measures.humidity}</Text>

      <Text>Pressure: {measures.pressure}</Text>
      <Text>Altitude: {measures.altitude}</Text>

      <Button title="Atualizar" onPress={handleRefresh} />
      <Button
        title="Settings"
        onPress={() => navigation.navigate('Configuration')}
      />
    </Container>
  );
}
