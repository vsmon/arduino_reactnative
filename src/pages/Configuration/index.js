import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import Realm from '../../schemas';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../../services/api';

export default function Configuration({navigation}) {
  const [internalAddress, setInternalAddress] = useState(
    'http://192.168.0.40:3001',
  );
  const [externalAddress, setExternalAddress] = useState('');
  const [token, setToken] = useState('');
  const [data, setData] = useState([]);
  useEffect(() => {
    loadConfig();
  }, []);
  async function loadConfig() {
    try {
      const config = await Realm.objects('Config');
      if (config) {
        setInternalAddress(
          config.filtered('name = "Server Internal Url"')[0].url,
        );
        setExternalAddress(
          config.filtered('name = "Server External Url"')[0].url,
        );
        setToken(config.filtered('name="Token"')[0].url);
      }
    } catch (error) {
      alert(error);
    }
  }
  async function handleAddInternalAddress() {
    try {
      const config = await Realm.objects('Config');
      await Realm.write(async () => {
        await Realm.delete(config.filtered('name = "Server Internal Url"'));
      });
      await Realm.write(async () => {
        await Realm.create('Config', {
          name: 'Server Internal Url',
          url: internalAddress,
        });
      });

      alert('Salvo com sucesso');
    } catch (error) {
      alert(error);
    }
  }
  async function handleAddExternalAddress() {
    try {
      const config = await Realm.objects('Config');

      await Realm.write(async () => {
        await Realm.delete(config.filtered('name = "Server External Url"'));
      });
      await Realm.write(async () => {
        await Realm.create('Config', {
          name: 'Server External Url',
          url: externalAddress,
        });
      });

      alert('Salvo com sucesso');
    } catch (error) {
      alert(error);
    }
  }
  async function handleAddToken() {
    try {
      const config = await Realm.objects('Config');

      await Realm.write(async () => {
        await Realm.delete(config.filtered('name = "Token"'));
      });

      await Realm.write(async () => {
        await Realm.create('Config', {
          name: 'Token',
          url: token,
        });
      });

      alert('Salvo com sucesso');
    } catch (error) {
      alert(error);
    }
  }
  async function getExternalAddress() {
    try {
      const config = await Realm.objects('Config');
      const token = config.filtered('name="Token"')[0].url;
      const {
        data: {externalIp: externalIpAddress},
      } = await api.get('externalip', {
        baseURL: 'https://telemetry1.herokuapp.com/',
        params: {
          token,
        },
      });
      setExternalAddress(`http://${externalIpAddress}:3001`);
      alert('Endereço Atualizado.');
    } catch (error) {
      console.log(error.response);
      alert(error);
    }
  }

  async function restartArduino() {
    try {
      const config = await Realm.objects('Config');
      const token = config.filtered('name="Token"')[0].url;
      await api.post('data', JSON.stringify({restart: true}), token);
      alert('Comando de restart enviado.');
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }

  return (
    <View style={{backgroundColor: '#000', flex: 1}}>
      <View style={{alignItems: 'center'}}>
        <Text style={{color: '#FFF'}}>Settings</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          padding: 10,
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            flex: 1,
          }}>
          <Text style={{color: '#FFF'}}>Internal Url: </Text>
          <TextInput
            style={{
              padding: 10,
              backgroundColor: '#CCC',
              height: 50,
              borderRadius: 5,
            }}
            onChangeText={text => setInternalAddress(text)}
            value={internalAddress}
          />
        </View>
        <TouchableOpacity
          style={{alignSelf: 'flex-end'}}
          onPress={handleAddInternalAddress}>
          <Icon name="save" size={50} color="blue" />
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          padding: 10,
          alignItems: 'center',
        }}>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            flex: 1,
          }}>
          <Text style={{color: '#FFF'}}>External Url: </Text>
          <TextInput
            style={{
              padding: 10,
              backgroundColor: '#CCC',
              height: 50,
              borderRadius: 5,
            }}
            onChangeText={text => setExternalAddress(text)}
            value={externalAddress}
          />
        </View>
        <TouchableOpacity
          style={{alignSelf: 'flex-end'}}
          onPress={getExternalAddress}>
          <Icon name="refresh" size={50} color="blue" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{alignSelf: 'flex-end'}}
          onPress={handleAddExternalAddress}>
          <Icon name="save" size={50} color="blue" />
        </TouchableOpacity>
      </View>
      <View style={{flexDirection: 'row', padding: 10, alignItems: 'center'}}>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            flex: 1,
          }}>
          <Text style={{color: '#FFF'}}>Token: </Text>
          <TextInput
            style={{
              padding: 10,
              backgroundColor: '#CCC',
              height: 50,
              borderRadius: 5,
            }}
            onChangeText={text => setToken(text)}
            value={token}
          />
        </View>
        <TouchableOpacity
          style={{alignSelf: 'flex-end'}}
          onPress={handleAddToken}>
          <Icon name="save" size={50} color="blue" />
        </TouchableOpacity>
      </View>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'blue',
            alignSelf: 'flex-end',
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center',
            margin: 10,
          }}
          onPress={restartArduino}>
          <Text style={{color: 'white'}}>Restart arduino</Text>
          <Icon name="refresh" size={50} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
