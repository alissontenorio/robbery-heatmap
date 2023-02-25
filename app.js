const express = require('express')
const dotenv = require('dotenv')
const robberyData = require('./static/assaltos_maceio_roubo_transeunte')
const hoodData = require('./static/bairros_maceio')

dotenv.config()

const app = express()
const serverPort = (process.env.PORT && parseInt(process.env.PORT)) || 3000

app.use(express.json())
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.render('index', { GMAPS_API_KEY: process.env.GMAPS_API_KEY })
})

app.get('/robbery', function (req, res) {
  res.json(robberyData)
})

app.get('/hood', function (req, res) {
  res.json(hoodData)
})



// Is this safe? Only god knows (Alcino 🧙)
app.use(express.static(__dirname + '/public'));

app.listen(serverPort)
