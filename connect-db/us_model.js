const sql = require("../config/db.js");

// constructor

const Cliente = function (cliente) {
  this.us_correo = cliente.us_correo;
  this.us_nombre = cliente.us_nombre;
  this.valoracion = cliente.valoracion;
  this.fecha = cliente.fecha;
};

// Envio de datos a la base.

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

// Borrado de datos.

Cliente.remove = (email, result) => {
  sql.query("DELETE FROM user_valuations WHERE us_correo = ?", email, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      // No se encontro el usuario con ese correo.
      result({ kind: "not_found" }, null);
      return;
    }
    console.log("Se elimino el usuario con email: ", email);
    result(null, res);
  });
};


//Exportamos las funciones.

module.exports = {
  Cliente,
};
