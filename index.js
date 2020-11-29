const express = require('express');
const path = require('path');

// Server
var server = express();
var port = process.env.PORT || 80; // <== this is must

server.get('/', (req, res) => {

    res.send("Working")
})

server.listen(port, () => {
    console.log("Listening on port: " + port)
})