const PORT = process.env.PORT || 5000;
const { default: Axios } = require('axios');
const express = require('express');
const app = express();
const axios = require('axios');
const { MongoClient } = require('mongodb');

app.use(express.json());

const mongoUrl = "mongodb://127.0.0.1:27017"

const client = new MongoClient(mongoUrl);

app.post('/', async (req, res) => {
    await client.connect();

    const database = client.db('prueba');
    const collection = database.collection("personas");

  const action = req.body.queryResult.action;
  console.log(req.body.queryResult.action);
  switch (action) {
      case "cifras":
          axios.get('https://api.covid19api.com/summary').then(respuesta => {
           const numero_casos = respuesta.data.Global.TotalConfirmed;
           res.json({
               fulfillmentText: `El número de casos total es ${numero_casos}`
           });      
          });
        break;

      case "pais":
          const {location} = req.body.queryResult.parameters
          const elPais = location.country;
          console.log(`El país es ${elPais}`);
          axios.get('https://api.covid19api.com/summary').then(respuesta => {
            
            const paises = respuesta.data.Countries;            
            const pais_resultado = paises.filter(elem => {
                return elem.Country == elPais
            });
            console.log(pais_resultado);
           res.json({
               fulfillmentText: `El número de casos total para ${elPais} es ${pais_resultado[0].TotalConfirmed}`
           });      
          });
        break;

      case "test":
          const persona = req.body.queryResult.parameters;
          const result = await collection.insertOne(persona);
          console.log(persona);
           res.json({
               fulfillmentText: `Guardado con éxito ${persona.nombre.name}`
           });      
        break;
  } 
  
});






app.get('/datos', async (req, res) => {
    await client.connect();

    const database = client.db('prueba');
    const collection = database.collection("personas");
    const personas = await collection.find({}).toArray();
    console.log(personas);
    res.json({ personas: personas });
    
});










/* app.listen(8081); */

