import React from 'react';
import {StatusBar} from 'react-native';

import Routes from './routes';
import './config/NotificationConfig';

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <Routes />
    </>
  );
}
