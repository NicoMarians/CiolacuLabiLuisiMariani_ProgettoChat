const fs = require('fs');
const express = require("express");
const http = require('http');
const path = require('path');
const app = express();
const multer  = require('multer');
const crypto = require('crypto')


const database = require('./database.js');
const mailer = require('./mailer.js');

const bodyParser = require("body-parser");

//app.use(cors());


function stringToHash(string) {
    return string.split('').reduce((hash, char) => {
        return char.charCodeAt(0) + (hash << 6) + (hash << 16) - hash;
    }, 0);
}

const generatePassword = (length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
    let password = '';
    for (let i = 0; i < length; i++) {
        const indxRandom = Math.floor(Math.random() * chars.length);
        password += chars[indxRandom];
    }
    return password;
};


const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, "files"));
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

const upload = multer({ storage: storage}).single('file');

const { Server } = require('socket.io'); // importazione oggetto Server da socket.io
const result = require('./mailer.js');
let conf = JSON.parse(fs.readFileSync('public/conf.json'));


app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

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
    const idChat = req.params.id;
    console.log("FETCH getmessages - -   ", idChat);
    try {
        await database.queries.downloadMessages(idChat);
        res.json({result: "ok"});
    } catch (e) {
        console.log(e);
        res.json({result: "ko"});
    }
});

app.post("/login", async (req,res) => {
    const {username, password} = req.body; // Ottiene username e password dalla richiesta

    try {
        //Chiamata alla funzone downloadUser per recuperare l'utente dal DB usando lo username
        const result = await database.downloadUser(username);

        console.log("FETCH login - -   ", { username, password });

        //Se l'utente non esiste
        if(result.length === 0) {
            return res.json({result: "ko", message: "Utente non trovato"});
        }

        //Confronta la password 
        if (user.password !== password){
            return res.json({result: "ko", message: "Password errata!"});
        }
        // Se la password è corretta, invia la risposta con i dati dell'utente
        res.json({ result: "ok", user });
    }catch(e){
        console.log(e);
        res.json({result: "ko", message: "C'è stato un errore"})
    }
});

app.get("/getchat/:id", async (req, res) => {
    // RICHIESTA AL DB che restituisce tutte le CHAT di uno specifico USER
    const idUser = req.params.id;
    console.log("FETCH getchat - -   ", idUser);
    try {
        data = await database.queries.downloadChatAll(idUser);
        console.log("ENTRATO IN SERVER")
        res.json({result: "ok", "data": data});
    } catch (e) {
        console.log(e);
        res.json({result: "ko"});
    }
});

app.get("/getcommunity", async (req, res) => {
    //RICHIESTA AL DB che restiuisce tutte le community in cui sei dentro 
    try {
        data = await database.queries.downloadCommunityAll();
        console.log("DATA COMMUNIY ---> ", data)
        res.json({result: "ok", "data": data});
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
        data = await database.queries.createUser(datiUser);
        res.json({result: "ok", "data": data});
    } catch (e) {
        console.log(e);
        res.json({result: "ko"});
    }
});

app.post("/createchat", async (req, res) => {
    // RICHIESTA AL DB PER CREARE SIA Chat che Chat_user
    const userId_1 = req.body.user_1;
    const userId_2 = req.body.user_2;
    const nomeChat = req.body.nomeChat;
    const immagineChat = req.body.immagineChat;

    console.log("FETCH createchat - -   ", { userId_1, userId_2 });
    try {
        const chatId = await database.queries.createChat(nomeChat, immagineChat);
        let result = await database.queries.createUserChat(userId_1,chatId);
        result = await database.queries.createUserChat(userId_2,chatId);

        res.json({ result: "ok"});
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
        data = await database.queries.createMessage(dizDati);
        res.json({ result: "ok" , "data": data});
    } catch (e) {
        console.log(e);
        res.json({ result: "ko" });
    }
});

app.delete("/deletechat", async (req, res) => {
    const { idUser, idChat } = req.body;
    console.log("FETCH deletechat - -   ", { idUser, idChat });
    try {
        data = await database.queries.deleteChat(idUser, idChat);
        res.json({ result: "ok" , "data": data});
    } catch (e) {
        console.log(e);
        res.json({ result: "ko" });
    }
});
let password_user_temp

app.post('/mailer', async (req,res) => {
    //Prende in input una email e gli manda una mail con la pw sicura da usare, poi salva sul db la pw ashata
    const password = generatePassword(12);
    password_user_temp = stringToHash(password);

    const email = req.body.email;
    const subject = "Benvenuto su Flock! Visualizza la tua password";
    const text = ("Questa è la tua password:  " + password);

    
    mailer.send(email, subject, text);
    res.json({ result: "ok"});
});

app.post('/checkpassword', async (req, res) => {
    const password = req.body.password;
    if (password === password_user_temp) {
        res.json({result: "ok"});
    } else {
        res.json({result: "ko"});
    }
})

app.post('/joinchat', async (req,res) => {
    const userId = req.body.userId;
    const chatId = req.body.chatId;
    try {
        const result = await database.queries.createUserChat(userId,chatId);
        res.json({ result: "ok"});
    } catch (e) {
        console.log(e);
        res.json({ result: "ko" });
    }

})


app.post('getUserByName', async (req,res) => {
    const username = req.body.username;
    try {
        const userData = await database.queries.downloadUserByName(username);
        res.json({ result: "ok",data: userData});
    } catch (e) {
        console.log(e);
        res.json({ result: "ko" });
    }

})

//----------------------------------------------SERVER IO----------------------------------------------
//LETTURA
const server = http.createServer(app);
const io = new Server(server);
io.on('connect', (socket) => {
   console.log("socket connected: " + socket.id);
   io.emit("chat", "new client: " + socket.id);
   
   socket.on('message', (message) => {
      const response = socket.id + ': ' + message;
      console.log(response);
      io.emit("chat", response);
   });
});



server.listen(conf.conf.port, () => {
console.log("server running on port: " + conf.conf.port);
  
  });