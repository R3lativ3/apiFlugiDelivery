var express = require('express');
var router = express.Router();
const mysqlConnection = require('../../database');
const { isAuthenticated, hasRoles } = require('../auth/index')

router.get('/', isAuthenticated, function(req, res) {
    const { _id } = req.user
    let id = String(_id)
    mysqlConnection.query('select * from RepartidorUser, users where users.id = RepartidorUser.idUser and RepartidorUser.idx = ?',id, (err, rows, fields) =>{
        if(err) throw err;
        res.json(rows);
    });
});

router.get('/logued', isAuthenticated, function(req, res) {
    const { _id } = req.user
    let id = String(_id)
    mysqlConnection.query('select name from RepartidorUser, users where users.id = RepartidorUser.idUser and RepartidorUser.idx = ?',id, (err, rows, fields) =>{
        if(err) throw err;
        res.json(rows);
    });
});

router.post('/ubicacion', function(req, res) {
    let latitud = req.body.latitud
    let longitud = req.body.longitud
    let estado = req.body.estado
    latitud = String(latitud)
    longitud = String(longitud)
    estado = String(estado)

    mysqlConnection.query('INSERT INTO ubicacionesRepartidores ( latitud, longitud, estado) VALUES (?, ?, ?)',[latitud, longitud, estado], (err, rows, fields) =>{
        if(err) throw err;
        res.json(rows);
    });
});

router.post('/actualizarUbicacion', isAuthenticated, function(req, res) {
    let { idEn } = req.user
    let latitud = req.body.latitud
    let longitud = req.body.longitud
    latitud = String(latitud)
    longitud = String(longitud)

    mysqlConnection.query('update ubicacionesRepartidores set latitud = ?, longitud = ? where repartidor = ?',[latitud, longitud, idEn], (err, rows, fields) =>{
        if(err) throw err;
        res.json(rows);
    });
});

module.exports = router;
