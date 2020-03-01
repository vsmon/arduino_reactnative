import React from 'react';
import {View, Text, Button} from 'react-native';

export default function Configuration({navigation}) {
  return (
    <View>
      <Text>Settings</Text>
      <Button title="Voltar" onPress={() => navigation.navigate('Home')} />
    </View>
  );
}
