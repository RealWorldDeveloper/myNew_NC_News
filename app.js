const express = require('express')
const getApi  = require('./controller')
const endpointsJson = require("./endpoints.json");
const app = express()
// middleware
app.use(express.json())

// api Endpoint
app.get('/api', getApi)

// Connection

module.exports = app