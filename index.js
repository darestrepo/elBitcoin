const express = require('express');
const path = require('path');

// Configurar db
const {MongoClient} = require('mongodb');
const uri = "mongodb+srv://alejoDB:dlkflsksdkjlkKaAS@cluster0.9ulgl.mongodb.net/bitcoindb?retryWrites=true&w=majority";
const client = new MongoClient(uri);

// Server
var server = express();
var port = process.env.PORT || 8082; // puerto asignado por heroku o local en 80802 para nodemon


console.log(`antes del post`);


server.post('/', async (req, res) => {

    await client.connect();
    console.log(`inicio del post`);
    const database = client.db('bitcoindb');
    const collection = database.collection("personas");
    const action = req.body.queryResult.action;
    console.log(action);
    switch (action) {
        case "default":
            console.log(`Se recibió la acción ${action}`);
            res.json({
                fulfillmentText: `Se recibió la acción ${action}`
            }); 
            break;   
        case "registro":
            console.log("aqui código");
            break; 
        default:
            console.log("default");
            res.json({
                fulfillmentText: `Default, se recibió la acción ${action}`
            });          


    }














    /* insertar info en db
    const persona = {
        nombre: "Alejandro",
        ciudad: "Medellín",
        pais: "Colombia",
        id: 98660650,
        email: "alejandro@xymilar.com"
    };
    const result = await collection.insertOne(persona);
    console.log(persona);
     
    res.send(`Guardado con éxito ${result}`)
    */


});




server.listen(port, () => {
    console.log("Listening on port: " + port)
})