var express = require('express');
const { isAuthenticated } = require('../auth');
var router = express.Router();
const mysqlConnection = require('../../database');
const { kilometros } = require('../util/getKilometers')

router.get('/historial', isAuthenticated, function(req, res, next) {
    const { idEn } = req.user
    idEn = parseInt(idEn)
    mysqlConnection.query('select * from ordenes where idRepartidor = ?', idEn, (err, rows, fields) =>{
        if(err) throw err;
        res.json(rows);
    });
});


router.get('/cambiarEstado', isAuthenticated, function(req, res, next){
    //let { idEn } = req.user
    let idEn = req.body.id
    let estado = req.body.estado
    let lat = req.body.lat
    let lon = req.body.lon
    let idOrden = parseInt(req.body.idOrden) 
    let fechaHora = new Date();

    if(estado === "Aceptado"){
        mysqlConnection.query('select * from ordenes where idOrden = ? and idRepartidor = 1', (err, rows, fields) => {
            if(err) throw err
            if(rows.length == 0) res.json("ocupado")
            mysqlConnection.query('update ordenes set idRepartidor = ?, idEstado = 3 where idOrden = ?', [parseInt(idEn), idOrden], (err, rows, fields) => {
                if(err) throw err
                let query2 = 'insert into ubicacionRepartidoresPedidos (latitud, longitud, estado, fechaHora, idRepartidor, idOrden) values (?, ?, ?, ?, ?, ?)'
                mysqlConnection.query(query2,[lat, lon, estado, fechaHora, parseInt(idEn), idOrden], (err, rows, fields) => {
                    if(err) throw err
                    res.json(rows)
                })
            })
        
    
        })
    }

    if(estado === "Recogido" || estado === "Finalizado"){

        mysqlConnection.query('update ordenes set idEstado = 4 where idOrden = ?', idOrden, (err, rows, fields)=> {
            if(err) throw err
            let query2 = 'insert into ubicacionRepartidoresPedidos (latitud, longitud, estado, fechaHora, idRepartidor, idOrden) values (?, ?, ?, ?, ?, ?)'
            mysqlConnection.query(query2,[lat, lon, estado, fechaHora, parseInt(idEn), idOrden], (err, rows, fields) => {
                if(err) throw err
                res.json(rows)
            })
        })
    }

    if(estado === "Finalizado"){
        mysqlConnection.query('update ordenes set idEstado = 6 where idOrden = ?', idOrden, (err, rows, fields)=> {
            if(err) throw err
            let query2 = 'insert into ubicacionRepartidoresPedidos (latitud, longitud, estado, fechaHora, idRepartidor, idOrden) values (?, ?, ?, ?, ?, ?)'
            mysqlConnection.query(query2,[lat, lon, estado, fechaHora, parseInt(idEn), idOrden], (err, rows, fields) => {
                if(err) throw err
                res.json(rows)
            })
        })
    }

})

router.get('/finalizarPedido', isAuthenticated, function(req, res, next){
    let idEn = req.body.id
    let estado = req.body.estado
    let lat = req.body.lat
    let lon = req.body.lon
    let idOrden = parseInt(req.body.idOrden) 
    let fechaHora = new Date();

    let query2 = 'insert into ubicacionRepartidoresPedidos (latitud, longitud, estado, fechaHora, idRepartidor, idOrden) values (?, ?, ?, ?, ?, ?)'
    mysqlConnection.query(query2, [lat, lon, estado, fechaHora, parseInt(idEn), idOrden], (err, rows, fields)=> {
        if(err) throw err
        res.json(rows.insertId)
    })
})

router.get('/ordenKilometros/:id', isAuthenticated, function(req, res, next){
    let id = req.params.id
    let query = 'select * from ubicacionRepartidoresPedidos where estado = "Recogido" or estado = "Finalizado" and idOrden = ?'
    mysqlConnection.query(query, id, (err, rows, fields) => {
        if(err) throw err
        let lat = []
        let lon = []
        for(var i = 0; i < rows.length; i++){
            lat[i] = rows[i]['latitud']
            lon[i] = rows[i]['longitud']
            console.log(lat[i], " ", lon[i])
        }
        const kms = kilometros(lat, lon)
        ob = {
            kilometros: kms
        }
        res.json(ob)
    })
})

router.get('/pedidoActual', isAuthenticated, function(req, res, next){
    const { idEn } = req.user
    mysqlConnection.query("select * from ordenes where idEstado = 3 and idRepartidor = ?", idEn, (err, rows, next) => {
        if(err) throw err
        res.json(rows)
    })
})

router.get('/pedidosDisponibles', function(req, res, next){
    let query = "select a.idOrden, a.direccionEntrega, a.fechaOrden, d.latitudxx, d.longitudxx, d.zonaLocalidad, d.direccionLocalidadRestaurante, e.nombreCliente, e.telefonoCliente "
    +"from ordenes a, restaurantesLocalidades d, cliente e "
    +"where  d.idRestauranteLocalidad = a.idLocalidadRestaurante and e.idCliente = a.idCliente and a.idEstado = 2"
    
    mysqlConnection.query(query, (err, rows, next) => {
        if(err) throw err
        res.json(rows)
    })
})

router.get('/pedidosDisponibles/:id', isAuthenticated, function(req, res, next){
    let id = parseInt(req.params.id) 
    let query = "select a.idOrden, a.direccionEntrega, a.fechaOrden, b.cantidad, c.nombreProducto, c.precio, d.latitudxx, d.longitudxx, d.zonaLocalidad, d.direccionLocalidadRestaurante, e.nombreCliente, e.telefonoCliente "
    +"from ordenes a, detalleOrdenes b, productosx c, restaurantesLocalidades d, cliente e "
    +"where a.idOrden = b.idOrden and c.idProducto = b.idProducto and d.idRestauranteLocalidad = a.idLocalidadRestaurante "
    +"and e.idCliente = a.idCliente and a.idEstado = 2 and a.idOrden = ?"
    
    mysqlConnection.query(query, id, (err, rows, next) => {
        if(err) throw err
        res.json(rows)
    })
})

router.get('/detallePedido/:id', isAuthenticated, function(req, res, next){
    let id = parseInt(req.params.id) 
    let query = "select b.cantidad, c.nombreProducto, c.precio "
    +"from detalleOrdenes b, productosx c " 
    +"where c.idProducto = b.idProducto and b.idOrden = ?"
    
    mysqlConnection.query(query, id, (err, rows, next) => {
        if(err) throw err
        res.json(rows)
    })
})

module.exports = router;
