const express = require('express')
const dotenv = require('dotenv')
const hoodHistoryData = require('./static/hoodHistoryData')
const hoodGeoData = require('./static/bairros_maceio')

dotenv.config()

const app = express()
const serverPort = (process.env.PORT && parseInt(process.env.PORT)) || 3000

app.use(express.json())
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.render('index', { GMAPS_API_KEY: process.env.GMAPS_API_KEY })
})

app.get('/hood/history', function (req, res) {
  res.json(hoodHistoryData)
})

app.get('/hood/geo', function (req, res) {
  res.json(hoodGeoData)
})



// Is this safe? Only god knows (Alcino 🧙)
app.use(express.static(__dirname + '/public'));

app.listen(serverPort)
