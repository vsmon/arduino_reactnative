import Realm from 'realm';

const Config = {
  name: 'Config',
  properties: {
    name: 'string',
    url: 'string',
  },
};

const ExternalUrl = {
  name: 'ExternalUrl',
  properties: {
    url: 'string',
  },
};

const InternallUrl = {
  name: 'InternallUrl',
  properties: {
    url: 'string',
  },
};

const Token = {
  name: 'Token',
  properties: {
    token: 'string',
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

const realm = new Realm({
  schema: [Config, ExternalUrl, InternallUrl, Token, Data],
});

export default realm;
