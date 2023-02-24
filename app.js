const http = require('http');
const csv = require('csvtojson')

const hostname = '127.0.0.1';
const port = 3000;

const MIN_YEAR=2012;
const LAST_YEAR=2022; // get from current year datetime?

const dealWithData = (data) => {
    console.log(data['BAIRRO']);
    for (let year = MIN_YEAR; year < LAST_YEAR; year++) {
        console.log(`${year} ${data[year]}`);
     }
};

const robberyCsvFilePath = './static/assaltos_maceio_roubo_transeunte.csv'

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');

  csv()
    .fromFile(robberyCsvFilePath)
    .then((jsonObj)=>{
        // console log
        // jsonObj.forEach(dealWithData); 

        // json response
        res.end(JSON.stringify(jsonObj));
    })
  
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});