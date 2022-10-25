/* const axios = require('axios');

const response = axios
  .get('https://telemetry1.herokuapp.com/externalip')
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.log('erro');
  }); */

const date = new Date('2022-10-25T18:35:29.969Z').toLocaleString('en-US', {
  timeZone: 'America/Sao_Paulo',
});

console.log(date);
