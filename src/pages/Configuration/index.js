import React, {useState, useEffect} from 'react';
import {View, Text, Button, TextInput, FlatList} from 'react-native';
import Realm from '../../schemas';

export default function Configuration({navigation}) {
  const [address, setAddress] = useState('');
  const [data, setData] = useState([]);
  useEffect(() => {
    loadConfig();
  }, []);
  async function loadConfig() {
    try {
      const config = await Realm.objects('Config');
      setAddress(config[0].url);
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
  async function loadData() {
    try {
      const data = await Realm.objects('Data');
      data.map(item => {
        console.log(item);
        setData([...data, item.temperature]);
      });
    } catch (error) {
      alert(error);
    }
  }

  return (
    <View>
      <Text>Settings</Text>
      <Text>Server Address</Text>
      <TextInput
        style={{backgroundColor: '#FFF8', height: 50}}
        onChangeText={text => setAddress(text)}
        value={address}
      />
      <Button title="Salvar" onPress={handleAddAddress} />
      <Button title="Voltar" onPress={() => navigation.navigate('Home')} />
      <FlatList
        data={data}
        renderItem={({item}) => (
          <Text>
            {item.id} - {item.temperature}
          </Text>
        )}
        keyExtractor={item => toString(item.id)}
      />
    </View>
  );
}
