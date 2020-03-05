import React, {useState} from 'react';
import {View, Text, Button, TextInput} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export default function Configuration({navigation}) {
  const [address, setAddress] = useState('');
  async function handleAddAddress() {
    try {
      await AsyncStorage.setItem('address', JSON.stringify(address));
      alert('Salvo com sucesso');
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
    </View>
  );
}
