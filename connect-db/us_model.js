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

// Actualizacion de valoracion.


Cliente.update= (email, cliente, result) => {
  sql.query(
    "UPDATE user_valuations SET us_correo = ?, us_nombre = ?, valoracion = ?, fecha = ? WHERE us_correo = ?",
    [cliente.us_correo, cliente.us_nombre, cliente.valoracion, cliente.fecha, email],
    (err, res) => {
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
      console.log("Se actualizo la valoracion de:", email);
      result(null, res);
    }
  );
};


// Traer valoracion de la base.

Cliente.getValues = (email, result) => {
  sql.query('SELECT * FROM user_valuations WHERE us_correo = ?', email, (err, res) => {
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
    console.log("Se importaron los datos correctamente para: ", email);
    result(null, res);
  });
};





//Exportamos las funciones.

module.exports = {
  Cliente,
};
