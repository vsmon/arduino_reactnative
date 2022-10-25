import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {LineChart, Grid, YAxis} from 'react-native-svg-charts';

import {Container, MeasureText, StyledActivityIndicator} from './styles';

import api from '../../services/api';
import Realm from '../../schemas';

import Chart from '../../components/chart';

export default function Home({navigation}) {
  const [address, setAddress] = useState('http://192.168.0.40:3001');
  const [measures, setMeasures] = useState([]);
  const [newMeasures, setNewMeasures] = useState([]);
  const [temperature, setTemperature] = useState([]);
  const [humidity, setHumidity] = useState([]);
  const [pressure, setPressure] = useState([]);
  const [altitude, setAltitude] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    fetchData();
    loadData();
  }, []);

  async function getDataInternalAddress() {
    try {
      const config = await Realm.objects('Config');

      const internalAddress = config.filtered('name = "Server Internal Url"')[0]
        .url;

      const response = await api.get('data', {baseURL: internalAddress});

      return response;
    } catch (error) {
      return {
        error: `Ocorreu um erro na conexao ${error}`,
      };
    }
  }
  async function getDataExternalAddress() {
    try {
      const config = await Realm.objects('Config');

      const externalAddress = config.filtered('name = "Server External Url"')[0]
        .url;

      const response = await api.get('data', {baseURL: externalAddress});

      return response;
    } catch (error) {
      return {
        error: `Ocorreu um erro na conexao ${error}`,
      };
    }
  }
  async function fetchData() {
    try {
      setRefresh(true);

      let response = new Object();

      response = await getDataInternalAddress();

      if (response.error) {
        response = await getDataExternalAddress();

        if (response.error) {
          throw new Error(
            `Ocorreu um erro na conexao com servidor. ${response.error}`,
          );
        }
      }

      setNewMeasures(response.data);

      saveData(response.data);
      setRefresh(false);
    } catch (error) {
      alert(error);
    }
  }
  async function saveData({temperature, humidity, pressure, altitude}) {
    try {
      Realm.write(async () => {
        Realm.create('Data', {
          id: Realm.objects('Data').length + 1,
          temperature,
          humidity,
          pressure,
          altitude,
          date: new Date(),
        });
      });
      loadData();
    } catch (error) {
      alert(error);
    }
  }
  async function loadData() {
    try {
      let temperature = [];
      let humidity = [];
      let pressure = [];
      let altitude = [];

      setRefresh(true);

      const data = Realm.objects('Data');

      data.map(item => {
        temperature.push({x: new Date(item.date), y: item.temperature});
        humidity.push({x: new Date(item.date), y: item.humidity});
        pressure.push({x: new Date(item.date), y: item.pressure});
        altitude.push({x: new Date(item.date), y: item.altitude});
      });

      setTemperature(temperature);
      setHumidity(humidity);
      setPressure(pressure);
      setAltitude(altitude);
      setRefresh(false);
    } catch (error) {
      alert(error);
    }
  }

  async function handleClear() {
    try {
      const data = Realm.objects('Data');
      Realm.write(async () => {
        Realm.delete(data);
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
    loadData();
  }

  return (
    <Container>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingTop: 30,
        }}>
        <TouchableOpacity onPress={clear}>
          <Icon name="delete-sweep" size={35} color="blue" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Configuration')}>
          <Icon name="settings" size={35} color="blue" />
        </TouchableOpacity>
      </View>

      {
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refresh} onRefresh={handleRefresh} />
          }>
          <View>
            <MeasureText color="rgb(255, 255, 0)">
              Temperature:{'\n'}
              {!newMeasures.temperature ? (
                <StyledActivityIndicator />
              ) : (
                newMeasures.temperature
              )}
              ºC
            </MeasureText>
            <View style={{height: 200, flexDirection: 'row'}}>
              <Chart
                data={temperature}
                symbol={'°C'}
                lineColor={'rgb(255, 255, 0)'}
              />
            </View>

            <MeasureText color="rgb(0, 255, 0)">
              Humidity:{'\n'}
              {!newMeasures.temperature ? (
                <StyledActivityIndicator />
              ) : (
                newMeasures.humidity.toFixed(2)
              )}
              %
            </MeasureText>
            <View style={{height: 200, flexDirection: 'row'}}>
              <Chart
                data={humidity}
                symbol={'%'}
                lineColor={'rgb(0, 255, 0)'}
              />
            </View>

            <MeasureText color="rgb(255, 0, 0)">
              Pressure:{'\n'}
              {!newMeasures.temperature ? (
                <StyledActivityIndicator />
              ) : (
                newMeasures.pressure.toFixed(2)
              )}
              hPa
            </MeasureText>
            <View style={{height: 200, flexDirection: 'row'}}>
              <Chart
                data={pressure}
                symbol={'hPa'}
                lineColor={'rgb(255, 0, 0)'}
              />
            </View>

            <MeasureText color="rgb(255, 153, 51)">
              Altitude:{'\n'}
              {!newMeasures.temperature ? (
                <StyledActivityIndicator />
              ) : (
                newMeasures.altitude.toFixed(2)
              )}
              Mts
            </MeasureText>

            <View style={{height: 200, flexDirection: 'row'}}>
              <Chart
                data={altitude}
                symbol={'Mts'}
                lineColor={'rgb(255, 153, 51)'}
              />
            </View>
          </View>
        </ScrollView>
      }
    </Container>
  );
}
