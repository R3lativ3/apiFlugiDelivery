function toRad(x) {
    return x * Math.PI / 180;
}

const getKilometers = (latitud, longitud) => {
    var lat1 = latitud[0];
    var lon1 = longitud[0];
    var lat2 = latitud[1];
    var lon2 = longitud[1];

    var R = 6371; // km
    //has a problem with the .toRad() method below.
    var x1 = lat2-lat1;
    var dLat = toRad(x1)
    var x2 = lon2-lon1;
    var dLon = toRad(x2)
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                    Math.sin(dLon/2) * Math.sin(dLon/2);  
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    
    return d;
}

module.exports = {
    kilometros: getKilometers
}
