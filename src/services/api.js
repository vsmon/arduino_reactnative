import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

let address = 'http://192.168.0.40:3001';

async function getAddress() {
  const res = await AsyncStorage.getItem('address');
  address = JSON.parse(res);
  return address;
}

const api = axios.create({
  baseURL: 'http://192.168.0.40:3001',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: 'application/json',
  },
});

export default api;
