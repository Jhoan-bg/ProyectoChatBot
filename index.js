const express = require('express')
const app = express()
const {WebhookClient} = require('dialogflow-fulfillment');
 
app.get('/', function (req, res) {
  res.send('Servidor en linea')
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

  // Intencion para cancelar una materia.

  function ValoracionServicio(agent) {

    agent.add(`Estaría encantada de recibir una calificación!! 😄😊`);
  }

  // Vincular el intento.

  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  
  intentMap.set('ValoracionServicio', ValoracionServicio);

  agent.handleRequest(intentMap);
  })
 
app.listen(3000,()=> {
    console.log("Servidor en linea en el puerto 3000")
} )