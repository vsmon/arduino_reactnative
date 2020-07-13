const axios = require('axios');

const response = axios
  .get('https://telemetry1.herokuapp.com/externalip')
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.log('erro');
  });
