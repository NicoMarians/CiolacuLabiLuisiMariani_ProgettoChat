const express = require("express");
const http = require('http');
const path = require('path');
const app = express();
//const multer  = require('multer');
const database = require('./database.js');
app.use(express.json());

app.use("/", express.static(path.join(__dirname, "public")));

app.use("/files", express.static(path.join(__dirname, "files")));

app.post("/upload", async (req, res) => {
    
});

app.get('/get', async (req, res) => {

})

app.get('/gettips', async (req, res) => {

})


app.delete('/delete/:id', async (req, res) => {

})

const server = http.createServer(app);
server.listen(5050, () => {
  console.log("- server running");
});
