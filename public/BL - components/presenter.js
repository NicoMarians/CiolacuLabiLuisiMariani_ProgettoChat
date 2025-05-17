import { pubsub } from "./pubsub.js";
import { middleware } from "./middleware.js";
import { chatComp } from "../View - components/chat.js";
import { chatListComp } from "../View - components/list.js";


//AGGIUNGERE GESTIONE SOCKET X IL DEMONE DI PASTOUR

const socket = io();

export const CreatePresenter = () => {
    let listMessaggi = []; //DIZIONARIO CON {"ChatId" : [messaggObj]}
    let listChat = []; //LISTA DI TUTTE LE CHAT DELL'UTENTE
    let listCommunity = [] //LISTA DI TUTTE LE COMMMUNITY



    // - - - - - - - - - - - - - - - - - - - - - - - FUNZIONI SOCKET -  - -
    //emits--------------->
    // Richiesta al server per ricevere tutte le chat dell'utente
    socket.emit("getAllChats");

    //listening <--------
    socket.on("connect",() => {
        console.log("Connesso alla chat!");
    });
    
    socket.on("allChats", (allChatMessages) => {
        //quando il server manda i messassi allora gli aggiunge dentro il comp ed effettua la render chiamando il publish
        chatListComp.setChats(allChatMessages);
        pubsub.publish("readyList");
    });   
    
    socket.on("arrivingmessage",(messageData) => {
        chatComp.addMess(messageData);
        chatComp.render();
    });
    // - - - - - - -- 




    //-----------------PUBSUB-----------------
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

    

    return {}



    
    
}