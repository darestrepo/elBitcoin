const { default: Axios } = require('axios');
const axios = require('axios');
const express = require('express');
const {MongoClient} = require('mongodb');
const uri = "mongodb+srv://alejoDB:dlkflsksdkjlkKaAS@cluster0.9ulgl.mongodb.net/bitcoindb?retryWrites=true&w=majority";
const client = new MongoClient(uri);

var app = express();
app.use(express.json());
var port = process.env.PORT || 8082; // puerto asignado por heroku o local en 80802 para nodemon

app.post('/', async (req, res) => {

    await client.connect(); 
    const database = client.db('bitcoindb');
    const collection = database.collection("personas");
    const action = req.body.queryResult.action;
    const session = req.body.session;
    const telegramID = req.body.originalDetectIntentRequest.payload.data.from.id;
    const nombreTemporal = req.body.originalDetectIntentRequest.payload.data.from.first_name;
    const buscarTelID = await client.db("bitcoindb").collection("personas")
                            .findOne({ telegram_id: telegramID });
    const USD_ARS = await axios.get('https://free.currconv.com/api/v7/convert?q=USD_ARS&compact=ultra&apiKey=9071cf3e9a4f487aa835');
    const ars = USD_ARS.data.USD_ARS
    
    //validadores
    const reGexPlace = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ']+$/;
    const reGexName = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/;
    const reGexDNI = /[a-zA-Z0-9]/g;
    const reGexEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    //intenciones

    switch (action) {}
    switch (action) {

        case "saludo":
            
            if (buscarTelID && (buscarTelID["date"] || 0)){

                let nombre = buscarTelID["nombre"];
                //imprimir el menú principal
                res.json({
                    fulfillmentText: `Bienvenido ${nombre}! 
                    \nPodras consultar diferentes monedas virtuales, por favor escribe el número de la opción deseada:
                    \n1. Bitcoin\n2. Ethereum\n3. Monero`
                }); 
                break;
            }
           else {
                //iniciar registro
                let delete_result = await client.db("bitcoindb").collection("personas")
                .deleteMany({ telegram_id: telegramID }); 
                const persona = {
                    telegram_id: telegramID
                };
                const result = await collection.insertOne(persona);  
                res.json({
                    fulfillmentText: `Hola ${nombreTemporal}, te damos la bienvenida a elBitcoin, donde puedes consultar en tiempo real el valor de tus monedas favoritas. \n\nAgradecemos nos indiques si estás dispuesto a brindarnos tu información para tu perfil de cliente? \n\nAcepto/No acepto`
                }); 
                break;
            };
            
        case "si_registro":
            
            res.json({
                fulfillmentText: `Genial, Indícanos por favor tu nombre completo`
            }); 
            break;

        case "no_registro":
            res.json({
                fulfillmentText: `Desafortunadamente no podemos prestar este servicio sin realizar un registro de perfil de cliente. \n\nHasta pronto!`
            }); 
            break;  
        
        case "si_nombre":
            
            let nombre = req.body.queryResult.queryText;
            let val_name = reGexName.test(nombre);
            if (val_name) {
                const result1 = await collection.updateOne({telegram_id:telegramID}, {$set: {nombre:nombre}});             
                res.json({
                    fulfillmentText: `Indícanos por favor tu ciudad`
                }); 
            } else {
                res.json({
                    fulfillmentText: `Tu nombre no parece válido, ingresa por favor tu nombre completo`,
                    outputContexts: [
                        {
                          "name": `${session}/contexts/nombre-followup`,
                          "lifespanCount": 0,
                          "parameters": {
                            "param-name": "param-value"
                          }
                        },
                        {
                            "name": `${session}/contexts/Siregistro-followup`,
                            "lifespanCount": 1,
                            "parameters": {
                              "param-name": "param-value"
                            }
                          }
                      ]
                }); 
            };
            break;

        case "si_ciudad":
            
            let ciudad = req.body.queryResult.queryText;
            let val_ciudad = reGexPlace.test(ciudad);
            if (val_ciudad) {
               
                const result = await collection.updateOne({telegram_id:telegramID}, {$set: {ciudad:ciudad}}); 
                               
                res.json({
                    fulfillmentText: `Indícanos por favor tu país`
                }); 
            } else {
                res.json({
                    fulfillmentText: `Tu ciudad no parece válida, ingresa por favor tu ciudad`,
                    outputContexts: [
                        {
                          "name": `${session}/contexts/ciudad-followup`,
                          "lifespanCount": 0,
                          "parameters": {
                            "param-name": "param-value"
                          }
                        },
                          {
                              "name": `${session}/contexts/nombre-followup`,
                              "lifespanCount": 1,
                              "parameters": {
                                "param-name": "param-value"
                              }
                        }
                        
                      ]
                }); 
            };
            break;

        case "si_pais":
                
                let pais = req.body.queryResult.queryText;
                let val_pais = reGexPlace.test(pais);
                if (val_pais) {
                
                    const result = await collection.updateOne({telegram_id:telegramID}, {$set: {pais:pais}}); 
                                
                    res.json({
                        fulfillmentText: `Indícanos por favor tu DNI`
                    }); 
                } else {
                    res.json({
                        fulfillmentText: `Tu país no parece válido, ingresa por favor tu país`,
                        outputContexts: [
                            {
                              "name": `${session}/contexts/pais-followup`,
                              "lifespanCount": 0,
                              "parameters": {
                                "param-name": "param-value"
                              }
                            },
                            {
                                "name": `${session}/contexts/ciudad-followup`,
                                "lifespanCount": 1,
                                "parameters": {
                                  "param-name": "param-value"
                                }
                              }
                          ]
                    }); 
                };
                break;

        case "si_dni":
                
                let dni = req.body.queryResult.queryText;
                let val_dni = reGexDNI.test(dni);
                if (val_dni) {
                
                    const result = await collection.updateOne({telegram_id:telegramID}, {$set: {dni:dni}}); 
                                
                    res.json({
                        fulfillmentText: `Indícanos por favor tu correo electrónico`
                    }); 
                } else {
                    res.json({
                        fulfillmentText: `Tu DNI no parece válido, ingresa por favor tu DNI`,
                        outputContexts: [
                            {
                              "name": `${session}/contexts/DNI-followup`,
                              "lifespanCount": 0,
                              "parameters": {
                                "param-name": "param-value"
                              }
                            },
                            {
                                "name": `${session}/contexts/pais-followup`,
                                "lifespanCount": 1,
                                "parameters": {
                                  "param-name": "param-value"
                                }
                              }
                          ]
                    }); 
                };
                break;

        case "si_email":
               
                let email = req.body.queryResult.queryText;
                let val_email = reGexEmail.test(email);
                if (val_email) {
                
                    const result = await collection.updateOne({telegram_id:telegramID}, {$set: {email:email}}); 
                    let datosCompletos = await client.db("bitcoindb").collection("personas")
                        .findOne({ telegram_id: telegramID });
                             
                    res.json({
                        fulfillmentText: `Esto son los datos que suministraste:
                        \nNombre: ${datosCompletos["nombre"]}\nCiudad: ${datosCompletos["ciudad"]}\nPaís: ${datosCompletos["pais"]}\nDNI: ${datosCompletos["dni"]}\nEmail: ${datosCompletos["email"]}
                        \nEs correcto?  SI/NO`
                    }); 
                } else {
                    res.json({
                        fulfillmentText: `Tu email no parece válido, ingresa por favor tu email`,
                        outputContexts: [
                            {
                              "name": `${session}/contexts/email-followup-2`,
                              "lifespanCount": 0,
                              "parameters": {
                                "param-name": "param-value"
                              }
                            },
                            {
                                "name": `${session}/contexts/DNI-followup`,
                                "lifespanCount": 1,
                                "parameters": {
                                  "param-name": "param-value"
                                }
                              }
                          ]
                    }); 
                };
                break;

        case "no_confirma_datos":

            res.json({
                fulfillmentText: `Desea iniciar el proceso de inscripción nuevamente?  SI/NO`
            }); 
            break;  

        case "no_doble_registro":

            let resultado3 = await client.db("bitcoindb").collection("personas")
                        .deleteOne({ telegram_id: telegramID });
            res.json({
                fulfillmentText: `Sus datos han sido efectivamente borrados del sistema, Hasta pronto!`,
            }); 
            break; 

        case "menu":

            var currentdate = new Date();
            var datetime = currentdate.getDay() + "/" + currentdate.getMonth() + "/" + currentdate.getFullYear() + "@" + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
            const date = await collection.updateOne({telegram_id:telegramID}, {$set: {date:datetime}}); 
            res.json({
                followupEventInput: {
                    "name": "Welcome",
                    "languageCode": "Spanish — es",
                    "parameters": {
                      "param-name": "Hola de nuevo"
                    }
                }
            }
            ); 
            break;

        case "reinicio":
                
                let delete_result = await client.db("bitcoindb").collection("personas")
                .deleteMany({ telegram_id: telegramID }); 
                const persona = {
                    telegram_id: telegramID
                };
                const result = await collection.insertOne(persona);  
                res.json({
                    fulfillmentText: `Vamos de nuevo, indícanos por favor tu nombre completo`,
                    outputContexts: [
                        {
                          "name": `${session}/contexts/Siregistro-followup`,
                          "lifespanCount": 1,
                          "parameters": {
                            "param-name": "param-value"
                          }
                        }
                      ]
                }); 
                break;

        case "input.unknown":

            res.json({
                followupEventInput: {
                    "name": "Welcome",
                    "languageCode": "Spanish — es",
                    "parameters": {
                      "param-name": "Hola de nuevo"
                    }
                }
            }
            ); 
            break;

        case "bitcoin":
            if (buscarTelID && (buscarTelID["date"] || 0)){
            console.log("bitcoin");
            axios.get('http://api.coinlayer.com/live?access_key=4312a7d2e5d7ebfb22857f4b7945ce21').then(respuesta => {
            const bitcoin = respuesta.data.rates.BTC;
            res.json({
                fulfillmentText: `Bitcoin en tiempo real\n\nBTC= ARS${bitcoin * ars}`
                });
            });
            break;
            } else {
                res.json({
                    followupEventInput: {
                        "name": "Welcome",
                        "languageCode": "Spanish — es",
                        "parameters": {
                          "param-name": "Hola de nuevo"
                        }
                    }
                }
                ); 
            };
            break;

        case "ethereum":
            if (buscarTelID && (buscarTelID["date"] || 0)){
                console.log("ethereum");
                axios.get('http://api.coinlayer.com/live?access_key=4312a7d2e5d7ebfb22857f4b7945ce21').then(respuesta => {
                const ethereum = respuesta.data.rates.ETH;
                res.json({
                    fulfillmentText: `Ethereum en tiempo real\n\nETH ARS${ethereum * ars}`
                    });
                });
                break;
                } else {
                    res.json({
                        followupEventInput: {
                            "name": "Welcome",
                            "languageCode": "Spanish — es",
                            "parameters": {
                              "param-name": "Hola de nuevo"
                            }
                        }
                    }
                    ); 
                };
                break;

        case "monero":
            if (buscarTelID && (buscarTelID["date"] || 0)){
                console.log("monero");
                axios.get('http://api.coinlayer.com/live?access_key=4312a7d2e5d7ebfb22857f4b7945ce21').then(respuesta => {
                const monero = respuesta.data.rates.XMR;
                res.json({
                    fulfillmentText: `Monero en tiempo real\n\nXMR ARS${monero * ars}`
                    });
                });
                break;
                } else {
                    res.json({
                        followupEventInput: {
                            "name": "Welcome",
                            "languageCode": "Spanish — es",
                            "parameters": {
                              "param-name": "Hola de nuevo"
                            }
                        }
                    }
                    ); 
                };
                break;
            

    };
});

app.listen(port, () => {
    console.log("Listening on port: " + port)
});

