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
          return agent.add("Se elimino satisfactoriamente tu ultima valoracion");
        })
        .catch((error) => {
          return agent.add("No encontro un usuario con los datos registrados");
        });
    } else {
      console.log("Datos preservados");
      return agent.add("Trateme serio ome !!");
    }
  }



  // Mapeado de intenciones asociadas a las funciones.

  let intentMap = new Map();

  intentMap.set("novedad_notas", nov_notas);

  intentMap.set("curso_ingles", curso_ingles);

  intentMap.set("borrar_valoraciones", borrar_valoraciones);

  intentMap.set("valoracion_servicio", ingr_valoraciones);

  agent.handleRequest(intentMap);
});

app.listen(3000, () => {
  console.log("Servidor en linea en el puerto 3000");
});
