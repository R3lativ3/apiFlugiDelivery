const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const meals = require('./src/routes/meals')
const orders = require('./src/routes/orders')
const auth = require('./src/routes/auth')
const pedidos = require('./src/routes/pedidos')
const repartidor = require('./src/routes/repartidor')

const app = express();
const port = 3000;

app.use(cors())

mongoose.connect("mongodb+srv://jbarrundia:perromon@cluster0.fscuv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {useNewUrlParser:true, useUnifiedTopology: true})

app.use('/api/meals', meals)
app.use('/api/orders', orders)
app.use('/api/auth', auth)
app.use('/api/pedidos', pedidos)
app.use('/api/repartidores', repartidor)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});