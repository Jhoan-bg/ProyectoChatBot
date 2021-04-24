const { Card, } = require('dialogflow-fulfillment');
const { db, } = require("../config/db.js");

module.exports.welcomeIntent = agent => {

    return new Promise((resolve, reject) => {
      // peticion a la base: resolve: manejador de respuesta, reject: manejador de fallo
      db.query('SELECT * FROM Usuario ', (error, results, fields) => {
        // si hay un error lo maneja
        if (error) reject(error);
        // manejamos la respuesta y enviamos el resultado
        resolve(results);
      });
    }).then(results => { // recibir los resultados
      //console.log("Es resultado de la consulta es: ", results);

      // crear respuesta Card
      return agent.add(new Card({
        title: 'Notas',
        text: 'Soporte consulta instructivo',
        imageUrl: 'https://www.umariana.edu.co/img-programas/sistemas/Ingenieria-Sistemas-UM-Movil.png',
        buttonText: 'Consultar instructivo',
        buttonUrl: "http://www.umariana.edu.co/instructivos/1-datos-personales.pdf",
      }));
    })

    .catch(error => { // Arrow Function
      return agent.add("Ocurrió un error con su solicitud");
    });
}
