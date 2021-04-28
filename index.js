const express = require('express');


const { WebhookClient, Card } = require('dialogflow-fulfillment');

const { curso_ingles } = require('./intents/curso_ingles');

const { nov_notas } = require('./intents/nov_notas');

const app = express()


app.get('/', (req, res) => {
    res.send('Servidor en linea')
})

app.post('/webhook', express.json(), (req, res) => {
    const agent = new WebhookClient({ request:req, response:res });
    
    // Pruebas de log de datos.

    console.log('Dialogflow Request headers: ' + JSON.stringify(req.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(req.body));


    //Log de valoraciones.

    function ingr_valoraciones(agent) {

        const { user } = req.body.originalDetectIntentRequest.payload.data.event;
        console.log("Usuario: ", user);
  
        const { parameters } = req.body.queryResult;
        console.log('Valoracion: ', parameters.n_valoracion);

        if (parameters.n_valoracion == 'Excelente') {
            agent.add("Genial !! gracias por valorar el servicio " + user.displayName);
        }
        else if (parameters.n_valoracion == 'Bueno') {
            agent.add("Gracias por valorar el servicio " + user.displayName);
        }
        else if (parameters.n_valoracion == 'Regular') {
            agent.add("Sentimos los inconvenientes, gracias por valorar el servicio " + user.displayName);
        }
        else if (parameters.n_valoracion == 'Malo') {
            agent.add("De verdad sentimos los inconvenientes, gracias por valorar el servicio " + user.displayName);
        }


    }


     //Log de borrado de valoraciones.

    function borrar_valoraciones(agent) {

        //Consulta de parametros desde DialogFlow.

        const { user } = req.body.originalDetectIntentRequest.payload.data.event;
        console.log("Usuario: ", user);
        
        //Consulta de parametros desde HanGouts.
        const { parameters } = req.body.queryResult;
        console.log('Confirmacion: ', parameters.confirmacion);

        //console.log('Confirmacion: ', (parameters.confirmacion == 'true'));

        if (parameters.confirmacion == 'true'){

            //Intruccion BD.

            console.log("Datos borrados");
            return agent.add("Su información ha sido eliminada correctamente " + user.displayName.normalize());
        } 
        else{
            console.log("Datos preservados");
            return agent.add("Trateme serio ome !!");
        }
        
    }

    
    // Mapeado de intenciones asociadas a las funciones.

    let intentMap = new Map();

    intentMap.set('novedad_notas', nov_notas);

    intentMap.set('curso_ingles', curso_ingles);

    intentMap.set('borrar_valoraciones', borrar_valoraciones);

    intentMap.set('valoracion_servicio', ingr_valoraciones);

    agent.handleRequest(intentMap);
})

app.listen(3000,()=> {
    console.log("Servidor en linea en el puerto 3000");
} )
