import { pubsub } from "./pubsub.js";
import { middleware } from "./middleware.js";
import { chatComp } from "../View - components/chat.js";
import { chatListComp } from "../View - components/list.js";


//AGGIUNGERE GESTIONE SOCKET X IL DEMONE DI PASTOUR

const socket = io();

const createPresenter = () => {
    // - - - - - - - - - - - - - - - - - - - - - - - ATTRIBUTI - - - - - - - - - - - - - - - - - - - - - - - 
    /*
    DIZIONARIO CON CHIAVE "chatId" E VALORE UNA LISTA CON TUTTI I 
    MESSAGGI SOTTOFORMA DI OGGETTI
    */
    let listChat = {}; 

    //COME SOPRA MA CON COMMUNITY
    let listCommunity = {};

    //LISTA DI TUTTI GLI UTENTI
    let listUsers = [];

    let user = {};



    // - - - - - - - - - - - - - - - - - - - - - - - FUNZIONI SOCKET - - - - - - - - - - - - - - - - - - - - - - - 
    //emits--------------->
    // Richiesta al server per ricevere tutte le chat
    socket.emit("getAllChats");

    //listening <--------
    socket.on("connect",() => {
        console.log("Connesso alla chat!");
    });
    
    socket.on("allChats", (allChatMessages) => {
        //quando il server manda i messassi allora gli aggiunge dentro il comp ed effettua la render chiamando il publish
        if (allChatMessages.result == "ok"){
            console.log("Lista chat: ", allChatMessages)
            chatListComp.setData(allChatMessages.data);
            pubsub.publish("readyList");
        }
    });   
    
    socket.on("arrivingmessage",(messageData) => {
        chatComp.addMess(messageData);
        chatComp.render();
    });
    // - - - - - - -- 




    // - - - - - - - - - - - - - - - - - - - - - - - PUBSUB - - - - - - - - - - - - - - - - - - - - - - - 
    pubsub.subscribe("getChatList", () => {
        //richiamato da list.js, carica le chat sul componente
        chatListComp.setChats(listChat);
        chatListComp.setCommunities(listCommunity);
        console.log("List chat caricate su list.js");     
    });

    pubsub.subscribe("getMessages", (id_chat) => {
        //richiamato ogni volta che si preme su una chat, carica i messaggi dentro a chat.js
        chatComp.setMess(listMessaggi[id_chat]);
    });

    pubsub.subscribe("sendOne", (message) => {
        //richiamato da form.js, prende il contenuto del messaggio e:  lo invia alle altre socket | lo salva sul database
        //- passare dizionario già creato correttamente -> objMess

        socket.emit("sendOne", message);  //<- lo manda al server

        middleware.createMessage(message)
    });


    // - - - - - - - - - - - - - - - - - - - - - - - METODI - - - - - - - - - - - - - - - - - - - - - - - 

    const getAllUsers = () => listUsers;

    const getAllChats = () => listChat;

    const getAllCommunities = () => listCommunity;

    const getUser = () => user;

    const setUser = (newUser) => user = newUser;

    const resetUser = () => user = {};

    const hashPassword = (str) => {
        let hash = 0;
        for (let i = 0, len = str.length; i < len; i++) {
            let chr = str.charCodeAt(i);
            hash = (hash << 5) - hash + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }
    

    // - - - - - - - - - - - - - - - - - - - - - - - RETURN - - - - - - - - - - - - - - - - - - - - - - - 
    return {
        getAllUsers: getAllUsers,
        getAllChats: getAllChats,
        getAllCommunities: getAllCommunities,
        getUser: getUser,
        setUser: setUser,
        resetUser: resetUser
    }
}

export const presenter = createPresenter();