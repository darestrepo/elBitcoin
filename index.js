const PORT = process.env.PORT || 5000;
const { default: Axios } = require('axios');
const express = require('express');
const app = express();
const axios = require('axios');


app.use(express.json());

console.log("prueba");

app.get('/datos', async (req, res) => {
    await client.connect();

    const database = client.db('prueba');
    const collection = database.collection("personas");
    const personas = await collection.find({}).toArray();
    console.log(personas);
    res.json({ personas: personas });
    
});










/* app.listen(8081); */

