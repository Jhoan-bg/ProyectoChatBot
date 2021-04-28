// Tarjeta de respuesta.
const { Card, } = require('dialogflow-fulfillment');

// Conector de la base de datos.
const { db, } = require("../config/db.js");


module.exports.nov_notas = agent => {
    
      // crear respuesta Card
      return agent.add(new Card({
        title: 'Novedad de notas',
        text: 'Instructivo',
        imageUrl: 'https://www.umariana.edu.co/img-programas/sistemas/Ingenieria-Sistemas-UM-Movil.png',
        buttonText: 'Consultar instructivo',
        buttonUrl: "https://www.umariana.edu.co/instructivos/2-correccion-notas-faltas.pdf",
      }));    
}
