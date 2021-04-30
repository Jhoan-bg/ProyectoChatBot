const express = require("express");

const { WebhookClient, Card, Suggestion } = require("dialogflow-fulfillment");

const { curso_ingles } = require("./intents/curso_ingles");

const { nov_notas } = require("./intents/nov_notas");

const { Cliente } = require("./connect-db/us_model.js");

const app = express();

app.get("/", (req, res) => {
  res.send("Servidor en linea");
});

app.post("/webhook", express.json(), (req, res) => {
  const agent = new WebhookClient({ request: req, response: res });

  // Pruebas de log de datos.

  console.log("Dialogflow Request headers: " + JSON.stringify(req.headers));
  console.log("Dialogflow Request body: " + JSON.stringify(req.body));

  //Envio de valoraciones.

  function ingr_valoraciones(agent) {
    const { user } = req.body.originalDetectIntentRequest.payload.data.event;
    console.log("Usuario: ", user);

    const { parameters } = req.body.queryResult;

    console.log("Valoracion: ", parameters.n_valoracion);

    // Parametros desde DialogFlow.
    const { email, displayName } = user;

    //parametros desde HanGouts.
    const cliente = new Cliente({
      us_correo: email,
      us_nombre: displayName,
      valoracion: parameters.n_valoracion,
      fecha: req.body.originalDetectIntentRequest.payload.data.event.eventTime,
    });

    // Enviar usuario a la base de datos.

    return new Promise((resolve, reject) => {
      // peticion a la base: resolve: manejador de respuesta, reject: manejador de fallo
      Cliente.create(cliente, (err, data) => {
        if (err) reject(err);
        // manejamos la respuesta y enviamos el resultado
        resolve(data);
      });
    })
      .then((results) => {
        // recibir los resultados && mensaje personalizado para cada res.

        if (parameters.n_valoracion == "Excelente") {
          return agent.add(
            "Genial !! gracias por valorar el servicio " + user.displayName
          );
        } else if (parameters.n_valoracion == "Bueno") {
          return agent.add(
            "Gracias por valorar el servicio " + user.displayName
          );
        } else if (parameters.n_valoracion == "Regular") {
          return agent.add(
            "Sentimos los inconvenientes, gracias por valorar el servicio " +
              user.displayName
          );
        } else if (parameters.n_valoracion == "Malo") {
          return agent.add(
            "De verdad sentimos los inconvenientes, gracias por valorar el servicio " +
              user.displayName
          );
        }
      })
      .catch((error) => {
        return agent.add("Ya tienes una valoracion registrada");
      });
  }

  //Borrado de valoraciones.

  function borrar_valoraciones(agent) {
    //Consulta de parametros desde DialogFlow.

    const { user } = req.body.originalDetectIntentRequest.payload.data.event;
    console.log("Usuario: ", user);

    //Consulta de parametros desde HanGouts.
    const { parameters } = req.body.queryResult;
    console.log("Confirmacion: ", parameters.confirmacion);

    //Inicializacion de variable email.

    const { email } = user;

    if (parameters.confirmacion == "true") {
      return new Promise((resolve, reject) => {
        // peticion a la base: resolve: manejador de respuesta, reject: manejador de fallo
        Cliente.remove(email, (err, data) => {
          if (err) reject(err);
          // manejamos la respuesta y enviamos el resultado
          resolve(data);
        });
      })
        .then((results) => {
          // Mensaje de respuesta.
          return agent.add(
            "Se elimino satisfactoriamente tu ultima valoracion"
          );
        })
        .catch((error) => {
          return agent.add("No encontro un usuario con los datos registrados");
        });
    } else {
      console.log("Datos preservados");
      return agent.add("Trateme serio ome !!");
    }
  }

  // Actualizacion de valoraciones recientes.

  function actualizar_valoraciones(agent) {
    //Consulta de parametros desde DialogFlow.

    const { user } = req.body.originalDetectIntentRequest.payload.data.event;
    console.log("Usuario: ", user);

    //Consulta de parametros desde HanGouts.
    const { parameters } = req.body.queryResult;
    console.log("Nueva valoracion: ", parameters.new_valoracion);

    // Parametros desde DialogFlow.
    const { email, displayName } = user;

    //parametros desde HanGouts.
    const cliente = new Cliente({
      us_correo: email,
      us_nombre: displayName,
      valoracion: parameters.new_valoracion,
      fecha: req.body.originalDetectIntentRequest.payload.data.event.eventTime,
    });

    // Enviar actualizacion a la base de datos.

    return new Promise((resolve, reject) => {
      // peticion a la base: resolve: manejador de respuesta, reject: manejador de fallo
      Cliente.update(email, cliente, (err, data) => {
        if (err) reject(err);
        // manejamos la respuesta y enviamos el resultado
        resolve(data);
      });
    })
      .then((results) => {
        return agent.add(
          "Tu valoracion fue actualizada correctamente " +
            user.displayName +
            " gracias por brindarnos tu opinion."
        );
      })
      .catch((error) => {
        return agent.add("No se encontro ninguna valoracion anterior...");
      });
  }

  // Desplegar datos guardados en la BD.

  function mostrar_registros(agent) {
    //Consulta de parametros desde DialogFlow.

    const { user } = req.body.originalDetectIntentRequest.payload.data.event;
    console.log("Usuario: ", user);

    // Parametros desde DialogFlow.
    const { email } = user;

    // Traer valoraciones de la base de datos.

    return new Promise((resolve, reject) => {
      // peticion a la base: resolve: manejador de respuesta, reject: manejador de fallo
      Cliente.getValues(email, (err, data) => {
        if (err) reject(err);
        // manejamos la respuesta y enviamos el resultado
        resolve(data);
      });
    })
      .then((results) => {
        return agent.add(
          //console.log((results))
          "Estos son los datos de tu ultima valoracion.\n" +
            "Correo: " +
            Object.values(results[0])[0] +
            "\nNombre: " +
            Object.values(results[0])[1] +
            "\nValoracion al servicio: " +
            Object.values(results[0])[2] +
            "\nFecha de valoracion: " +
            Object.values(results[0])[3]
        );
      })
      .catch((error) => {
        return agent.add("No se encontro ninguna valoracion anterior...");
      });
  }

  // Mapeado de intenciones asociadas a las funciones.

  let intentMap = new Map();

  intentMap.set("novedad_notas", nov_notas);

  intentMap.set("curso_ingles", curso_ingles);

  intentMap.set("borrar_valoraciones", borrar_valoraciones);

  intentMap.set("valoracion_servicio", ingr_valoraciones);

  intentMap.set("actual_valoracion", actualizar_valoraciones);

  intentMap.set("mostrar_registros", mostrar_registros);

  agent.handleRequest(intentMap);
});

app.listen(3000, () => {
  console.log("Servidor en linea en el puerto 3000");
});
