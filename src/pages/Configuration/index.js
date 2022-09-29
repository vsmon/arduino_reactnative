import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  TouchableOpacity,
  Modal,
  TouchableHighlight,
  KeyboardAvoidingView,
  Dimensions,
  StyleSheet,
  Alert,
  ToastAndroid,
} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import Realm from '../../schemas';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../../services/api';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function Configuration({navigation}) {
  const [internalAddress, setInternalAddress] = useState(
    'http://192.168.0.40:3001',
  );
  const [externalAddress, setExternalAddress] = useState('');
  const [token, setToken] = useState('');
  const [data, setData] = useState([]);
  const [isVisibleLoginModal, setIsVisibleLoginModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  useEffect(() => {
    loadConfig();
  }, []);

  async function loadConfig() {
    try {
      const config = await Realm.objects('Config');
      if (config !== undefined) {
        setInternalAddress(
          config.filtered('name = "Server Internal Url"')[0].url,
        );
        setExternalAddress(
          config.filtered('name = "Server External Url"')[0].url,
        );
        setToken(config.filtered('name="Token"')[0].url);
      }
    } catch (error) {
      console.log(error);
      alert('Não há dados salvos');
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
      const externalIp = await firestore()
        .collection('ips')
        .doc('external')
        .get();

      setExternalAddress(`http://${externalIp.data().ip}:3001`);
    } catch (error) {
      switch (error) {
        case error.toString().includes('unavailable'):
          alert('Serviço indisponível');
          break;
        case error.toString().includes('permission-denied'):
          alert('Permissao Negada, verifique o token!');
        default:
          alert('Ocorreu um erro inesperado');
      }
    }
  }

  async function getInternalAddress() {
    try {
      const internalIp = await firestore()
        .collection('ips')
        .doc('internal')
        .get();
      setInternalAddress(`http://${internalIp.data().ip}:3001`);
    } catch (error) {
      console.log('meu error====>', error);
      switch (error) {
        case error.toString().includes('unavailable'):
          alert('Serviço indisponível');
          break;
        case error.toString().includes('permission-denied'):
          alert('Permissao Negada, verifique o token!');
        default:
          alert('Ocorreu um erro inesperado');
      }
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

  function handleRestartArduino() {
    Alert.alert('Reiniciar Arduino', 'Deseja reiniciar o arduino?', [
      {
        text: 'OK',
        onPress: () => {
          restartArduino();
        },
        style: 'ok',
      },
      {
        text: 'CANCELAR',
        onPress: () => {},
        style: 'cancel',
      },
    ]);
  }

  async function getAuth() {
    try {
      if (email !== '' && password !== '') {
        const isAuth = await auth().signInWithEmailAndPassword(email, password);
        console.log('dados auth', isAuth);
        return true;
      } else {
        alert('Preencha os campos!');
      }
      return false;
    } catch (error) {
      alert(error);
      return false;
    }
  }
  async function handleRefreshIP() {
    const isAuth = await getAuth();
    console.log(isAuth);
    if (isAuth) {
      setIsVisibleLoginModal(false);
      getInternalAddress();
      getExternalAddress();
      alert('Endereço Atualizado.');
    }
  }

  function handleCopyToClipboardInternalAddress() {
    Clipboard.setString(internalAddress);
    showTost('Texto copiado para Área de transferência!');
  }

  function handleCopyToClipboardExternalAddress() {
    Clipboard.setString(externalAddress);
    showTost('Texto copiado para Área de transferência!');
  }

  function showTost(message) {
    ToastAndroid.showWithGravity(message, ToastAndroid.SHORT, ToastAndroid.TOP);
  }

  return (
    <View style={{backgroundColor: '#000', flex: 1}}>
      <Modal
        visible={isVisibleLoginModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsVisibleLoginModal(!isVisibleLoginModal)}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View style={styles.modal}>
            <Text>Autenticação</Text>
            <TextInput
              style={{
                padding: 10,
                backgroundColor: '#CCC',
                height: 50,
                width: Dimensions.get('window').width - 50,
                borderRadius: 5,
                margin: 10,
              }}
              onChangeText={text => setEmail(text)}
              value={email}
              placeholder="Digite o email..."
              keyboardType="email-address"
              textContentType="username"
              autoComplete="username"
              autoCapitalize="none"
              autoFocus={true}
            />
            <TextInput
              style={{
                padding: 10,
                backgroundColor: '#CCC',
                height: 50,
                width: Dimensions.get('window').width - 50,
                borderRadius: 5,
                margin: 5,
              }}
              placeholder="Digite a senha..."
              onChangeText={text => setPassword(text)}
              secureTextEntry={true}
              textContentType="password"
              autoComplete="password"
              autoCapitalize="none"
              value={password}
            />
            <View
              style={{
                flexDirection: 'row',
              }}>
              <TouchableHighlight style={{margin: 20}}>
                <Button title="OK" onPress={handleRefreshIP} />
              </TouchableHighlight>
              <TouchableHighlight style={{margin: 20}}>
                <Button
                  title="Cancelar"
                  onPress={() => {
                    setIsVisibleLoginModal(false);
                  }}
                />
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>
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
          <View
            style={{
              flexDirection: 'row',
              height: 50,
              borderRadius: 5,
              backgroundColor: '#CCC',
            }}>
            <TextInput
              style={{
                padding: 10,
                backgroundColor: '#CCC',
                height: 50,

                borderRadius: 5,
                flex: 1,
              }}
              onChangeText={text => setInternalAddress(text)}
              value={internalAddress}
            />
            <TouchableOpacity
              style={{alignSelf: 'center'}}
              onPress={handleCopyToClipboardInternalAddress}>
              <Icon name="content-copy" size={40} color="blue" />
            </TouchableOpacity>
          </View>
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
          <View
            style={{
              flexDirection: 'row',
              height: 50,
              borderRadius: 5,
              backgroundColor: '#CCC',
            }}>
            <TextInput
              style={{
                padding: 10,
                backgroundColor: '#CCC',
                height: 50,
                borderRadius: 5,
                flex: 1,
              }}
              onChangeText={text => setExternalAddress(text)}
              value={externalAddress}
            />
            <TouchableOpacity
              style={{alignSelf: 'center'}}
              onPress={handleCopyToClipboardExternalAddress}>
              <Icon name="content-copy" size={40} color="blue" />
            </TouchableOpacity>
          </View>
        </View>

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
          onPress={() => setIsVisibleLoginModal(true)}>
          <Text style={{color: 'white'}}>Atualiza IPs</Text>
          <Icon name="refresh" size={50} color="white" />
        </TouchableOpacity>
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
          onPress={handleRestartArduino}>
          <Text style={{color: 'white'}}>Restart arduino</Text>
          <Icon name="power" size={50} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 5,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
