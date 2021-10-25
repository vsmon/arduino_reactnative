import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Home from './pages/Home/';
import Configuration from './pages/Configuration';

const Stack = createNativeStackNavigator();
export default function Route() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          options={{headerShown: false}}
          name="Home"
          component={Home}
        />
        <Stack.Screen
          options={{
            title: '',
            headerTintColor: 'blue',
            headerStyle: {backgroundColor: '#000'},
          }}
          name="Configuration"
          component={Configuration}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
