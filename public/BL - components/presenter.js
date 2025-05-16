import { pubsub } from "pubsub.js";
import { middleware } from "/middleware.js";
import { chatComp } from "../index.js";
import { chatListComp } from "../index.js";

//AGGIUNGERE GESTIONE SOCKET X IL DEMONE DI PASTOUR


const CreatePresenter = () => {
    let listMessaggi = []; //DIZIONARIO CON {"ChatId" : [messaggObj]}
    let listChat = []; //LISTA DI TUTTE LE CHAT DELL'UTENTE
    let listCommunity = [] //LISTA DI TUTTE LE COMMMUNITY

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

    pubsub.subscribe("sendOne", (dizDati) => {
        //richiamato da form.js, prende il contenuto del messaggio e:  lo invia alle altre socket | lo salva sul database
        //- passare dizionario già creato correttamente -> objMess

        middleware.createMessage(dizDati)
    });

    return {}



    
    
}