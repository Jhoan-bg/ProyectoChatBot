// Tarjeta de respuesta.
const { Card, } = require('dialogflow-fulfillment');

// Conector de la base de datos.
const { db, } = require("../config/db.js");

module.exports.curso_ingles = agent => {
    
      return agent.add(new Card({
        title: 'Inscripcion a cursos de ingles pregrado',
        text: 'Instructivo',
        imageUrl: 'https://i.ytimg.com/vi/3C0pHiVNMuQ/maxresdefault.jpg',
        buttonText: 'Consultar instructivo',
        buttonUrl: "https://www.umariana.edu.co/instructivos/14-Inscripcion-Matricula-Cursos-Ingles.pdf",
      }));    
}
