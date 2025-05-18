const fs = require('fs');
const express = require("express");
const http = require('http');
const path = require('path');
const app = express();
const multer  = require('multer');
const crypto = require('crypto')
const { Server } = require('socket.io'); // importazione oggetto Server da socket.io
const result = require('./mailer.js');


const database = require('./database.js');
const mailer = require('./mailer.js');

const bodyParser = require("body-parser");

const middleware = require('./public/BL - components/middleware.js');

//app.use(cors());

function stringToHash(str) {
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

const generatePassword = (length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&';
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

app.post('/upload-img', (req, res) => {
    upload(req, res, (err) => {
        
    console.log(req.file.filename);    
    res.json({url: "./files/" + req.file.filename});    
  })
});




app.post("/getuser/:id", async (req, res) => {
    //RICHIESTA AL DB che restiuisce informazioni su uno SPECIFICO USER
    const idUser = req.params.id;
    try {
        await database.queries.downloadUser(idUser);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.json({result: "ko"});
    }
});

app.get("/getmessages/:id", async (req, res) => {
    //RICHIESTA AL DB che restiuisce tutti i messaggi di uno SPECIFICO CHAT
    const idChat = req.params.id;
    try {
        const data = await database.queries.downloadMessages(idChat);
        res.json({result: "ok", data: data});
    } catch (e) {
        console.log(e);
        res.json({result: "ko"});
    }
});

app.post("/login", async (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        const result = await database.queries.downloadUserByName(username);

        //Se l'utente non esiste
        if(result[0].password.length === 0) {
            return res.json({result: "ko"});
        }

        //Confronta la password
        if (parseInt(result[0].password) !== parseInt(password)){
            return res.json({result: "ko"});
        }
        // Se la password è corretta, invia la risposta con i dati dell'utente
        res.json({ result: true, user: result[0]});
    }catch(e){
        console.log(e);
        res.json({result: false, message: "C'è stato un errore"})
    }
});

app.get("/getchat/:id", async (req, res) => {
    // RICHIESTA AL DB che restituisce tutte le CHAT di uno specifico USER
    const idUser = req.params.id;
    try {
        data = await database.queries.downloadChatAll(idUser);
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
        res.json({result: "ok", "data": data});
    } catch (e) {
        console.log(e);
        res.json({result: "ko"});
    }
});

app.post("/createuser", async (req, res) => {
    //RICHIESTA AL DB che CREA L'UTENTE, PASSARGLI UN DIZIONARIO CON TUTTE LE INFORMAZIONI 
    const datiUser = req.body;
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
    const nomeChat = req.body.nome;
    const immagineChat = req.body.immagine;

    try {
        const chatId = await database.queries.createChat(nomeChat, immagineChat);

        res.json({ result: "ok",data:chatId});
    } catch (e) {
        console.log(e);
        res.json({ result: "ko" });
    }
});

app.post("/createmessage", async (req, res) => {
    // Funzione che crea un nuovo messaggio, passando tutte le informazioni come oggetto
    const dizDati = req.body;
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

    console.log("Email inviata a : " + email);
    mailer.send(email, subject, text);
    res.json({ result: true});
});

app.post('/checkpassword', async (req, res) => {
    const password = req.body.password;
    
    if (password == password_user_temp) {
        res.json({result: true});
    } else {
        res.json({result: false});
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

app.post('/getuserbyname', async (req,res) => {
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

let onlineUsers = [];
let allUsers;
const loadUser = async () => {
    allUsers = await database.queries.downloadAllUsers();
}
loadUser();
let allChatsAndMessages = {}; //{chatId : {chatData : {name,picture,type},messages : [{message},{message}] } }

const loadMessaggeOnStart = async () => {
    const allChats = await database.queries.downloadChatAllNoFilter(); //SCARICHIAMO TUTTE LE CHAT CON ANCHE I LORO DATI
    allChats.forEach( async (chat) => {
        const chatId = chat.id;
        const chatMessages = await database.queries.downloadMessages(chatId);
        
        allChatsAndMessages[chatId] = {"chatData":{"name":chat.name,"picture":chat.picture,"type":chat.id_tipo},"messages":chatMessages};
        //console.log("Messaggi per IDCHAT: ", idChat, " ->  ", message);
    });
};

loadMessaggeOnStart();


app.use("/", express.static(path.join(__dirname, "public")));
    const server = http.createServer(app);
    const io = new Server(server);


    //DOWNLOAD ALL COMMUNITY MESSAGGES
    //[id_chat] = [[messobj]]
    

        io.on('connect', (socket) => {

            socket.emit("returnAllUsers",allUsers)

            socket.on('connectchat',(chatId) => {
                onlineUsers.push({user:socket,chat: chatId});
            });


            socket.on("getAllChats", async (user) => {
                // RESTITUISCE LA LISTA DELLE CHAT
                try {
                    const community = await database.queries.downloadCommunityAll();
                    const chatPriv = await database.queries.downloadChatAll(user.id);
                    
                    console.log("INVIO LISTA COMMUNITY E CHAT PRIV")
                    socket.emit("allChats", { result: "ok", community: community, chatPriv: chatPriv});
                } catch (e) {
                    console.log(e);
                    socket.emit("allChats", { result: "ko" });
                }
            });


            socket.on("getAllUsers",async () => {
                socket.emit("returnAllUsers",allUsers);
            })


            socket.on('sendOne', async (information) =>  {
                //ancora da finire
                const userid = information.userid;
                const chat = information.chatId;
                const text = information.text;
                const image = information.image;
                const type = information.type_id
                const timestamp = information.timestamp;

                console.log("INFO  ", information);
                //console.log("allChatsAndMessages[information.chatId] ", allChatsAndMessages.information.chatId);
                console.log("Information : ", information);


                allChatsAndMessages[information.chatId].messages.push(information)
                
                onlineUsers.forEach((element) => {
                    if (element.chat == chat){
                        element.user.emit("arrivingmessage",response);
                    }
                });

                //Salvataggio su db 
                const dataDB = timestamp.split("T").join(" ");
                const values = {
                    chat_id: chat,
                    user_id: userid,
                    type_id: type,
                    text: text,
                    image: image,
                    timestamp: dataDB
                }
                const res = await database.queries.createMessage(values);
                allChatsAndMessages[chat].messages.push({message_id:res[0].id ,chat_id: chat,userid: userid,type_id: type,text: text,image: image,timestamp: timestamp});
                socket.emit('newMessage',chat);
                console.log("res db salvataggio messaggio: ", res);
            });

            socket.on('disconnectchat',() => {
                let index = 0;
                onlineUsers.forEach((user,i) => {
                    if(user.user.id == socket.id) index = i
                });
                onlineUsers.splice(index,1);
            });

            socket.on('getAllMessages',(chat) => {
                //console.log("Messaggi inviati, chat id: ", allChatsAndMessages[chatId.id])
                socket.emit('returnAllMessages', allChatsAndMessages[chat.id], chat);
            });
    });



server.listen(conf.conf.port, () => {
    console.log("server running on port: " + conf.conf.port);
});