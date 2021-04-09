const express = require('express')
const app = express()
const {WebhookClient} = require('dialogflow-fulfillment');
 
app.get('/', function (req, res) {
  res.send('Hello World')
})

app.post('/webhook', express.json(),function (req, res) {
    const agent = new WebhookClient({ request:req, response:res });
  console.log('Dialogflow Request headers: ' + JSON.stringify(req.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(req.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  // Intencion para cancelar la materia.

  function Cancelar_Materia(agent) {
    agent.add(`Aquí te ofrecemos un tutorial que te puede ayudar:`);
    agent.add(`Enlace al tutorial`);
  }

  // Vincualar el intento.

  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Cancelar_Materia', Cancelar_Materia);

  agent.handleRequest(intentMap);
  })
 
app.listen(3000,()=> {
    console.log("Servidor en linea")
} )