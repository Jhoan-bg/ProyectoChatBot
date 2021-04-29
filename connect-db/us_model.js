const sql = require("../config/db.js");

// constructor

const Cliente = function (cliente) {
  this.us_correo = cliente.us_correo;
  this.us_nombre = cliente.us_nombre;
  this.valoracion = cliente.valoracion;
  this.fecha = cliente.fecha;
};

//Crear cliente.

Cliente.create = (newCliente, result) => {
  sql.query("INSERT INTO user_valuations SET ?", newCliente, (err, res) => {
    if (err) {
      console.log("Error: ", err);
      result(err, null);
      return;
    }
    console.log("Cliente creado: ", { id: res.insertId, ...newCliente });
    result(null, { id: res.insertId, ...newCliente });
  });
};

module.exports = {
  Cliente,
};
