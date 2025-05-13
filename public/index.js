// -- Parsing -- 
const buttonLogin = document.getElementById("buttonLogin");
const buttonRegister = document.getElementById("buttonRegister");
const buttonCreateChat = document.getElementById("buttonCreateChat");
const searchBar = document.getElementById("seatchBar");
const divUsername = document.getElementById("divUsername");
const divProfilePicture = document.getElementById("divProfilePicture");
const divChatList = document.getElementById("chatSpace");
const divChatMess = document.getElementById("MesschatSpace");
const register_btn = document.getElementById("register_btn");
const email_btn = document.getElementById("invia_email_password");
const password_check_register_btn = document.getElementById("check_password");
const username_choice_btn = document.getElementById("add_username");

const password_input_register = document.getElementById("password_input");


function stringToHash(str) {
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}


// -- Business Logic -- 
import {pubsub} from './BL - components/pubsub.js';
import {createMiddleware} from './BL - components/middleware.js';
import {createChatList} from './View - components/list.js';
import { createNavigator } from './View - components/navigator.js';
import { createChatComp } from './View - components/chat.js'

// -- View --
import { loginComp } from './View - components/login.js';

const userProva = {
    id: 3,
    username: "matmeg",
    password: "fabiocontessotto",
    email: "matmeg@skibidi.com",
    public_key: "yuh",
    private_key: "yoh",
    picture: null    
}

const user = {

}

fetch("./conf.json").then(r => r.json()).then(conf => {
    const middleware = createMiddleware();
    const chatComp = createChatComp(divChatMess,pubsub)
    const navigator = createNavigator(document.querySelector(".flock-space"));
    const chatListComp = createChatList(divChatList);

    console.log("PROVA QUERY: ", middleware.downloadChatAll(userProva.id))
    
    middleware.downloadCommunityAll(userProva.id).then(datiTemp => {
        console.log("CHAT SCARICATE ------------>   ", datiTemp.data);
        //chatListComp.setCommunities(datiTemp);
        //chatListComp.render();
    }).catch(error => {
        console.error("Errore durante il download delle chat:", error);
    });
    window.location.href = "#home";


    
    register_btn.onclick = async () => {    
        window.location.href = "#registrati-container";
    }   

    email_btn.onclick = async () => {
        const email = document.getElementById("email_input").value;
        document.getElementById("email_input").value = "";
        await middleware.sendMail(email)
        window.location.href = "#register-password-container";
        loginComp.setEmail(email)
    }

    password_check_register_btn.onclick = async () => {
        const password = password_input_register.value;
        
        console.log(" - - - - - - - - -PASSWORD IN INPUT : ", password)
        const response = await middleware.checkPassword(password);
        
        if (response.result == "ok") {
            window.location.href = "#username-container";
            loginComp.setPassword(stringToHash(password));
        } else {
            document.getElementById("messErrorIfNotPsw").innerText = "Password errata";
        }
    }

    username_choice_btn.onclick = async () => {
        const username = document.getElementById("username_input").value;
        loginComp.setUsername(username);
        console.log("USER TEMP DATA: ", loginComp.getUserData());
        await middleware.createUser(loginComp.getUserData());

        document.getElementById("username_input").value = "";
        window.location.href = "#chatSpace";
        console.log("UTENTE CREATO")
        user = await middleware.getUserByName(username).data;
        /*Fa joinare l'utente a tutte le community
        const communities = await middleware.downloadCommunityAll();
        communities.forEach((community) => {
            const result = middleware.joinChat()
            
        });
        */
    }

    

    const socket = io();
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

/*
buttonCreateChat.onclick = async () => {
    //MOSTRARE INPUT CHE CHIEDE NOME DI UTENTE CON CUI FARE CHAT
    // ID LO RICAVIAMO CON UNA QUERY

    const userId = 2;

    await middleware.createChat(userId.id,userId);


}
    */