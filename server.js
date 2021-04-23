//Conexion a base de datos.

var mysql = require('mysql');
const conexion= mysql.createConnection({
    host : 'chatbot.cjpkhldaiedt.us-east-1.rds.amazonaws.com',
    database : 'ChatBot_DB',
    user : 'Admin',
    password : 'chatbot123',
});

conexion.connect(function(err) {
    if (err) {
        console.error('Error de conexion: ' + err.stack);
        return;
    }
    console.log('Conectado a la base de datos.');
});
