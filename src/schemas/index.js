import Realm from 'realm';

const Config = {
  name: 'Config',
  properties: {
    name: 'string',
    url: 'string',
  },
};

const Data = {
  name: 'Data',
  primaryKey: 'id',
  properties: {
    id: 'int',
    temperature: 'double',
    humidity: 'double',
    pressure: 'double',
    altitude: 'double',
    date: {type: 'date', optional: false},
  },
};

const realm = new Realm({schema: [Config, Data]});

export default realm;
