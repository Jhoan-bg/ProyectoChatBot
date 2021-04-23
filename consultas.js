import { mysql } from "./server.js";

// Prueba de req.

conexion.query('SELECT * FROM Usuario', function (error, results, fields) {
    if (error)
        throw error;
  
    results.forEach(result => {
        console.log(result);
    });
  });