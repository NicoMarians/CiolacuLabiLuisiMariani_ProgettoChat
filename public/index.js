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

let user = {}

const socket = io();

fetch("./conf.json").then(r => r.json()).then(conf => {
    let user2 = {};
    const middleware = createMiddleware();
    const chatComp = createChatComp(divChatMess);
    const navigator = createNavigator(document.querySelector(".flock-space"));
    const chatListComp = createChatList(divChatList);

    
    middleware.downloadCommunityAll(userProva.id).then(datiTemp => {
        chatListComp.setCommunities(datiTemp);
        chatListComp.render();

    }).catch(error => {
        console.error("Errore durante il download delle chat:", error);
    });
    window.location.href = "#home";


    
    register_btn.onclick = async () => {    
        window.location.href = "#registrati-container";
    }   


    //INSERIMENTO MAIL REGISTER
    email_btn.onclick = async () => {
        const email = document.getElementById("email_input").value;
        document.getElementById("email_input").value = "";
        await middleware.sendMail(email)

        loginComp.setRegisterState([false,true,false]);
        window.location.href = "#register-password-container";
        loginComp.setEmail(email)
    }

    //CONTROLLO PASSWORD REGISTER
    password_check_register_btn.onclick = async () => {
        const password = password_input_register.value;
        
        password_input_register.value = "";
        const response = await middleware.checkPassword(password);
        
        if (response.result == "ok") {
            window.location.href = "#username-container";
            loginComp.setPassword(stringToHash(password));
        } else {
            document.getElementById("messErrorIfNotPsw").innerText = "Password errata";
        }
    }

    //INSERIMENTO USERNAME REGISTRAZIONE
    username_choice_btn.onclick = async () => {
        const username = document.getElementById("username_input").value;
        loginComp.setUsername(username);
        await middleware.createUser(loginComp.getUserData());

        document.getElementById("username_input").value = "";
        window.location.href = "#chatSpace-container";
        user = await middleware.getUserByName(username).data;
        /*Fa joinare l'utente a tutte le community
        const communities = await middleware.downloadCommunityAll();
        communities.forEach((community) => {
            const result = middleware.joinChat()
            
        });
        */
    }

    //- -   -   -   -   -LOGIN- -   -   -   -   -   
    document.getElementById("login_btn").onclick = () => {
        console.log("ENTRATO IN AREA LOGIN")
        window.location.href = "#login-container";
    }

    document.getElementById("login_btn_login_space").onclick = async () => {
        //PRENDE I DATI E FA UNA RICHIESTA AL SERVER PER LA LOGIN
        
        const username = document.getElementById("username_login_input").value;
        const password = document.getElementById("password_login_input").value;


        const result = await middleware.login(username, stringToHash(password));

        if (result.result == "ok") {
            user = result.user;
            user2 = result.user;
            
            //loginComp.setUserData(user)
            window.location.href = "#chatSpace-container";
            document.getElementById("username_homepage").innerHTML = user.username;
            chatComp.setUser(user);
        }

    }

        /*
    buttonCreateChat.onclick = async () => {
        //MOSTRARE INPUT CHE CHIEDE NOME DI UTENTE CON CUI FARE CHAT

    }

    document.getElementById("buttonInviteChat").onclick = async () => {
        const utentiDaAggiungere 
    }
    */

    // - - - - FUNZIONI SOCKET -  - -
    socket.on("connect",() => {
        "Connesso alla chat!";
    });

    socket.on("arrivingmessage",(messageData) => {
        chatComp.addMess(messageData);
        chatComp.render();
        
    });
    // - - - - - - -- 

    //PUBSUB SUBSCRIBES
    pubsub.subscribe("render-chat", () => {
        chatComp.render();
    }); 

    pubsub.subscribe("set-chat-list", (list) => {
        
    })

    pubsub.subscribe("set-data-mess", (list) =>{
        //PASSARE UNA LISTA DI DIZIONARIO CON SEGUENTE FORMATO -> content, time_stamp, idUser, idChat
        chatComp.addMess(list);
        middleware.createMessage()
    });

    pubsub.subscribe("downloadMessages", async (idChat) => {
        const newMessages = await middleware.downloadMessages(idChat);
        chatComp.setMess(newMessages.data);
        return;
    })

    pubsub.subscribe("getUser", () => {
        return user;
    })

    pubsub.subscribe("createMessage", async (dizMess) => {
        await middleware.createMessage(dizMess);
        chatComp.render();
    });

    pubsub.subscribe("setChat", (chat_id) => {
        chatComp.setCurChat(chat_id)
    });

    pubsub.subscribe("sendMessage",(messageInformation) => {
        socket.emit('newmessage', messageInformation);
    });

    pubsub.subscribe("connectChat",(chatId) => {
        socket.emit("connectchat",chatId);
    });

    pubsub.subscribe("disconnectChat",() => {
        socket.emit("disconnect");
    })
});
