// -- Parsing -- 
const buttonLogin = document.getElementById("buttonLogin");
const buttonRegister = document.getElementById("buttonRegister");
const buttonCreateChat = document.getElementById("buttonCreateChat");
const searchBar = document.getElementById("seatchBar");
const divUsername = document.getElementById("divUsername");
const divProfilePicture = document.getElementById("divProfilePicture");
const divChatList = document.getElementById("chatSpace");
const divChatMess = document.getElementById("MesschatSpace");

// -- Business Logic -- 
import {pubsub} from './BL - components/pubsub.js';
import {createMiddleware} from './BL - components/middleware.js';
import {createLogin} from './View - components/login.js';
import {createChatList} from './View - components/list.js';
import { createNavigator } from './View - components/navigator.js';
import { createChatComp } from './View - components/chat.js'

// -- View --

const userProva = {
    id: 3,
    username: "matmeg",
    password: "fabiocontessotto",
    email: "matmeg@skibidi.com",
    public_key: "yuh",
    private_key: "yoh",
    picture: null    
}




fetch("./conf.json").then(r => r.json()).then(conf => {
    const middleware = createMiddleware();
    const chatComp = createChatComp(divChatMess,pubsub)
    const navigator = createNavigator(document.querySelector(".flock-space"));
    const chatListComp = createChatList(divChatList);

    console.log("PROVA QUERY: ", middleware.downloadChatAll(userProva.id))
    
    middleware.downloadCommunityAll(userProva.id).then(datiTemp => {
        console.log("CHAT SCARICATE ------------>   ", datiTemp.data);
        chatListComp.setCommunities(datiTemp);
        chatListComp.render();
    }).catch(error => {
        console.error("Errore durante il download delle chat:", error);
    });
    window.location.href = "#home";
    navigator.hide("#chatSpace")


    // - - - - CONNESSIONE AL SERVER -  - -
    socket.on("connect", () => {
        console.log("Connesso al server");
    });
    // - - - - - - -- 

    //PUBSUB SUBSCRIBES
    pubsub.subscribe("render-chat", () => {
        chatComp.render();
    }); 

    pubsub.subscribe("set-data", (list) =>{
        //PASSARE UNA LISTA DI DIZIONARIO CON SEGUENTE FORMATO -> content, time_stamp, idUser, idChat
        chatComp.addMess(list);
        middleware.createMessage()
    });

    pubsub.subscribe("downloadMessages",async () => {
        const newMessages = await middleware.downloadMessages();
        list.chatComp.setMess(newMessages);
    })




})

buttonCreateChat.onclick = async () => {
    //MOSTRARE INPUT CHE CHIEDE NOME DI UTENTE CON CUI FARE CHAT
    // ID LO RICAVIAMO CON UNA QUERY

    const userId = 2;

    await middleware.createChat(userId.id,userId);


}