const express = require('express');
const { WebhookClient, Card } = require('dialogflow-fulfillment');

const { welcomeIntent } = require('./intents/welcomeintent');
const app = express()


app.get('/', (req, res) => {
    res.send('Servidor en linea')
})

app.post('/webhook', express.json(), (req, res) => {
    const agent = new WebhookClient({ request:req, response:res });
    //console.log('Dialogflow Request headers: ' + JSON.stringify(req.headers));
    //console.log('Dialogflow Request body: ' + JSON.stringify(req.body));

    /*
    function welcomeIntent(agent) {
      const { user } = req.body.originalDetectIntentRequest.payload.data.event;
      console.log(user);
    }
    */

    function deletePersonaldata(agent) {

      const { user } = req.body.originalDetectIntentRequest.payload.data.event;
      console.log("Usuario: ", user);

      const { parameters } = req.body.queryResult;
      console.log('Confirmacion: ', parameters);
      //console.log(user);

      return agent.add("Su información ha sido eliminada correctamente");

    }



    // Vincular la intension.
    let intentMap = new Map();

    intentMap.set('welcome_intent', welcomeIntent);
    intentMap.set('delete_personaldata', deletePersonaldata);

    /*
    // van todas las intenciones del endpoint
    intentMap.set('conv_estadoAnimo', welcomeIntent);

    intentMap.set('despedida_fin', welcomeIntent);
    intentMap.set('novedad_notas', welcomeIntent);
    */

    agent.handleRequest(intentMap);
})

app.listen(3001,()=> {
    console.log("Servidor en linea en el puerto 3001");
} )
