import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  LineChart,
  AreaChart,
  Grid,
  YAxis,
  XAxis,
} from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import {format} from 'date-fns';

import {Container, MeasureText} from './styles';

import api from '../../services/api';
import axios from 'axios';
import Realm from '../../schemas';

export default function Home({navigation}) {
  const [address, setAddress] = useState('http://192.168.0.40:3001');
  const [measures, setMeasures] = useState([]);
  const [newMeasures, setNewMeasures] = useState([]);
  const [temperature, setTemperature] = useState([]);
  const [humidity, setHumidity] = useState([]);
  const [pressure, setPressure] = useState([]);
  const [altitude, setAltitude] = useState([]);
  const [date, setDate] = useState([]);

  useEffect(() => {
    loadData();
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const config = await Realm.objects('Config');
      let url = '';
      config.map(item => {
        url = item.url;
      });

      const response = await api.get(`data`, {baseURL: url});

      setNewMeasures(response.data);
    } catch (error) {
      alert(error);
    }
  }
  async function saveData({temperature, humidity, pressure, altitude}) {
    try {
      await Realm.write(async () => {
        await Realm.create('Data', {
          id: Realm.objects('Data').length + 1,
          temperature,
          humidity,
          pressure,
          altitude,
          date: new Date(),
        });
      });
    } catch (error) {
      alert(error);
    }
  }
  async function loadData() {
    try {
      const data = await Realm.objects('Data');
      let listTemp = [];
      let listHum = [];
      let listPress = [];
      let listAlti = [];
      let listDate = [];
      if (!data) {
        listTemp.push(newMeasures.temperature);
        listHum.push(newMeasures.humidity);
        listPress.push(newMeasures.pressure);
        listAlti.push(newMeasures.altitude);
        listDate.push(new Date());
      } else {
        data.map(item => {
          listTemp.push(item.temperature);
          listHum.push(item.humidity);
          listPress.push(item.pressure);
          listAlti.push(item.altitude);
          listDate.push(format(item.date, 'dd/MM/yyyy'));
        });
      }
      setTemperature(listTemp);
      setHumidity(listHum);
      setPressure(listPress);
      setAltitude(listAlti);
      setDate(listDate);
    } catch (error) {
      alert(error);
    }
  }
  async function handleClear() {
    try {
      const data = await Realm.objects('Data');
      await Realm.write(async () => {
        await Realm.delete(data);
      });
    } catch (error) {
      alert(error);
    }
  }
  async function clear() {
    Alert.alert(
      'Excluir todos os registros',
      'Deseja excluir todos os registros?',
      [
        {
          text: 'OK',
          onPress: () => {
            handleClear();
            handleRefresh();
          },
          style: 'ok',
        },
        {
          text: 'CANCELAR',
          onPress: () => {},
          style: 'cancel',
        },
      ],
    );
  }

  async function handleRefresh() {
    fetchData();
    saveData(newMeasures);
    loadData();
  }

  return (
    <Container>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <TouchableOpacity onPress={clear}>
          <Icon name="delete-sweep" size={40} color="blue" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Configuration')}>
          <Icon name="settings" size={40} color="blue" />
        </TouchableOpacity>
      </View>

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
            {/*  <XAxis
              style={{marginHorizontal: -10}}
              data={date}
              formatLabel={(value, index) => value}
              contentInset={{left: 10, right: 20}}
              svg={{fontSize: 10, fill: 'black'}}
              numberOfTicks={10}
            /> */}

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
