const us_model = require("./us_model.js");

exports.create = (req, res) => {

  // Validar peticion.

  if (!req.body) {
    res.status(400).send({
      message: "No hay contenido dentro de la peticion!"
    });
  }

  // Crear usuario.
  // Debemos hacer la coincidencia de los nombres de los datos.
  
  const cliente = new Cliente({
    us_correo: req.body.email,
    us_nombre: req.body.name,
    valoracion: req.body.active,
    fecha: req.body.originalDetectIntentRequest.payload.data.event.eventTime
  });

  // Enviar usuario a la base de datos.

  Cliente.create(cliente, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "No se pudo crear el cliente dentro de la base de datos."
      });
    else res.send(data);
  });

};
