const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Orders = mongoose.model('Order', new Schema({
    id: Number,
    fecha: Date,
    detalle: [{ restaurante: String, direccion: String, latitud: String, Longitud: String, comida: String }],
    cliente: String,
    dieccion: String,
    estado: String,
    desc: String,
    meal_id: { type: Schema.Types.ObjectId, ref: 'Meal'},
    user_id : String
}))

module.exports = Orders