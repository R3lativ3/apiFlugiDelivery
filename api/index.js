const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const meals = require('../src/models/Meals')
const orders = require('../src/routes/orders')
const auth = require('../src/routes/auth')
const pedidos = require('../src/routes/pedidos')
const repartidor = require('../src/routes/repartidor')

const app = express();
app.use(cors())

mongoose.connect("mongodb+srv://jbarrundia:perromon@cluster0.fscuv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {useNewUrlParser:true, useUnifiedTopology: true})

app.use('/api/meals', meals)
app.use('/api/orders', orders)
app.use('/api/auth', auth)
app.use('/api/pedidos', pedidos)
app.use('/api/repartidores', repartidor)

module.exports = app
