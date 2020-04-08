import React, {useState, useEffect} from 'react';
import {View, Text, Button, TextInput, TouchableOpacity} from 'react-native';
import Realm from '../../schemas';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Configuration({navigation}) {
  const [address, setAddress] = useState('');
  const [data, setData] = useState([]);
  useEffect(() => {
    loadConfig();
  }, []);
  async function loadConfig() {
    try {
      const config = await Realm.objects('Config');
      if (config) {
        setAddress(config[0].url);
      }
    } catch (error) {
      alert(error);
    }
  }
  async function handleAddAddress() {
    try {
      const config = await Realm.objects('Config');

      await Realm.write(async () => {
        await Realm.delete(config);
      });
      await Realm.write(async () => {
        await Realm.create('Config', {
          name: 'Server Url',
          url: address,
        });
      });

      alert('Salvo com sucesso');
    } catch (error) {
      alert(error);
    }
  }

  return (
    <View style={{backgroundColor: '#000', flex: 1}}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Icon name="arrow-back" size={40} color="blue" />
      </TouchableOpacity>
      <View style={{alignItems: 'center'}}>
        <Text style={{color: '#FFF'}}>Settings</Text>
      </View>
      <View style={{flexDirection: 'row', padding: 10, alignItems: 'center'}}>
        <Text style={{color: '#FFF'}}>Url: </Text>
        <TextInput
          style={{
            padding: 10,
            flex: 1,
            backgroundColor: '#CCC',
            height: 50,
            borderRadius: 5,
          }}
          onChangeText={(text) => setAddress(text)}
          value={address}
        />
        <TouchableOpacity onPress={handleAddAddress}>
          <Icon name="save" size={50} color="blue" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
