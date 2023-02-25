"use strict";
import express from 'express'
import { config } from 'dotenv'
import hoodHistoryData from './static/hoodHistoryData.js'
import hoodGeoData from './static/bairros_maceio.js'

config()

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
app.use(express.static('public'));

app.listen(serverPort)
