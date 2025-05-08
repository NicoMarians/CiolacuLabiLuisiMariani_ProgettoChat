const express = require("express");
const http = require('http');
const path = require('path');
const app = express();
//const multer  = require('multer');
const database = require('./database.js');
const mailer = require('./mailer.js');
app.use(express.json());

app.use("/", express.static(path.join(__dirname, "public")));

app.use("/files", express.static(path.join(__dirname, "files")));

app.post("/getuser/:id", async (req, res) => {
    //RICHIESTA AL DB che restiuisce informazioni su uno SPECIFICO USER
    const idUser = req.params.id;
    console.log("FETCH getuser - -   ", idUser);
    try {
        await database.queries.downloadUser(idUser);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.json({result: "ko"});
    }
});

app.post("/getmessages/:id", async (req, res) => {
    //RICHIESTA AL DB che restiuisce tutti i messaggi di uno SPECIFICO CHAT
    const idChat = req.req.params.id;
    console.log("FETCH getmessages - -   ", idChat);
    try {
        await database.queries.downloadMessages(idChat);
        res.json({result: "ok"});
    } catch (e) {
        console.log(e);
        res.json({result: "ko"});
    }
});

app.post("/getchat/:id", async (req, res) => {
    //RICHIESTA AL DB che restiuisce tutte le CHAT  di uno specifico USER
    const idUser = req.body.idUser;
    console.log("FETCH getchat - -   ", idUser);
    try {
        await database.queries.downloadChatAll(idUser);
        res.json({result: "ok"});
    } catch (e) {
        console.log(e);
        res.json({result: "ko"});
    }
});

app.post("/getcommunity", async (req, res) => {
    //RICHIESTA AL DB che restiuisce tutte le community in cui sei dentro 
    const community = req.body;
    console.log("FETCH getuser - -   ", community);
    try {
        await database.queries.downloadCommunityAll(community);
        res.json({result: "ok"});
    } catch (e) {
        console.log(e);
        res.json({result: "ko"});
    }
});


app.post("/createuser", async (req, res) => {
    //RICHIESTA AL DB che CREA L'UTENTE, PASSARGLI UN DIZIONARIO CON TUTTE LE INFORMAZIONI 
    const datiUser = req.body;
    console.log("FETCH createuser - -   ", datiUser);
    try {
        await database.queries.createUser(datiUser);
        res.json({result: "ok"});
    } catch (e) {
        console.log(e);
        res.json({result: "ko"});
    }
});

app.post("/createchat", async (req, res) => {
    // RICHIESTA AL DB PER CREARE SIA Chat che Chat_user
    const { idUser1, idUser2 } = req.body;
    console.log("FETCH createchat - -   ", { idUser1, idUser2 });
    try {
        await database.queries.createChat(idUser1, idUser2);
        res.json({ result: "ok" });
    } catch (e) {
        console.log(e);
        res.json({ result: "ko" });
    }
});

app.post("/createmessage", async (req, res) => {
    // Funzione che crea un nuovo messaggio, passando tutte le informazioni come oggetto
    const dizDati = req.body;
    console.log("FETCH createmessage - -   ", dizDati);
    try {
        await database.queries.createMessage(dizDati);
        res.json({ result: "ok" });
    } catch (e) {
        console.log(e);
        res.json({ result: "ko" });
    }
});

app.delete("/deletechat", async (req, res) => {
    const { idUser, idChat } = req.body;
    console.log("FETCH deletechat - -   ", { idUser, idChat });
    try {
        await database.queries.deleteChat(idUser, idChat);
        res.json({ result: "ok" });
    } catch (e) {
        console.log(e);
        res.json({ result: "ko" });
    }
});

app.post('/mailer', async (req,res) => {
  let email = req.body.email;
  let subject = req.body.subject;
  let text = req.body.subject;
});

const server = http.createServer(app);
server.listen(5050, () => {
  console.log("- server running");
});
