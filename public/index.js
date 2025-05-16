// -- Parsing -- 
const buttonLogin = document.getElementById("buttonLogin");
const buttonRegister = document.getElementById("buttonRegister");
const buttonCreateChat = document.getElementById("buttonCreateChat");
const searchBar = document.getElementById("seatchBar");
const divUsername = document.getElementById("divUsername");
const divProfilePicture = document.getElementById("divProfilePicture");
const divChatList = document.getElementById("chatSpace");
const divChatMess = document.getElementById("chatSpace-container");
const register_btn = document.getElementById("register_btn");
const email_btn = document.getElementById("invia_email_password");
const password_check_register_btn = document.getElementById("check_password");
const username_choice_btn = document.getElementById("add_username");
const password_input_register = document.getElementById("password_input_register");



function stringToHash(str) {
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

const createCookie = (username,time) => {
    let expire = new Date();
    expire.setDate(expire.getDate() + time);
    expire = expire.toUTCString();
    const line = `username = ${username}; expires = ${expire};`
    //const line = `username = ${username}; expires = ;`

    document.cookie = line;
}


// -- Business Logic -- 
import {pubsub} from './BL - components/pubsub.js';
import {createMiddleware} from './BL - components/middleware.js';
import {createChatList} from './View - components/list.js';
import { createNavigator } from './View - components/navigator.js';
import { createChatComp } from './View - components/chat.js';
import { createNewChat} from './View - components/newChat.js';

// -- View --
import { loginComp } from './View - components/login.js';

let user = {}

const socket = io();

fetch("./conf.json").then(r => r.json()).then(conf => {
    let user2 = {};
    const middleware = createMiddleware();
    const chatComp = createChatComp(divChatMess);
    const navigator = createNavigator(document.querySelector(".flock-space"));
    const chatListComp = createChatList(divChatList);
    const newChat = createNewChat(document.getElementById("utentiTrovati"))

    
    middleware.downloadCommunityAll(user.id).then(datiTemp => {
        chatListComp.setCommunities(datiTemp);
        chatListComp.render();

    }).catch(error => {
        console.error("Errore durante il download delle chat:", error);
    });
    
    window.location.href = "#starterPage";


    
    register_btn.onclick = async () => {    
        window.location.href = "#registerMailPage";
    }   


    //INSERIMENTO MAIL REGISTER
    email_btn.onclick = async () => {
        const email = document.getElementById("email_input").value;
        document.getElementById("email_input").value = "";
        await middleware.sendMail(email)

        loginComp.setRegisterState([false,true,false]);
        window.location.href = "#registerPasswordPage";
        loginComp.setEmail(email)
    }

    //CONTROLLO PASSWORD REGISTER
    password_check_register_btn.onclick = async () => {
        const password = password_input_register.value;
        
        password_input_register.value = "";
        if (password){
            const response = await middleware.checkPassword(password);
            if (response.result == "ok") {
                document.getElementById("username_homepage").innerHTML = user.username;
                window.location.href = "#registerUsernamePage";
                loginComp.setPassword(stringToHash(password));
            } else {
                document.getElementById("messErrorIfNotPsw").innerText = "Password errata";
                alert("Password errata!")
                console.log("Password errata");
            }
        } else {
            document.getElementById("messErrorIfNotPsw").innerText = "Errore!";
        }
        
        
    }

    //INSERIMENTO USERNAME REGISTRAZIONE
    username_choice_btn.onclick = async () => {
        const username = document.getElementById("username_input").value;
        loginComp.setUsername(username);
        await middleware.createUser(loginComp.getUserData());

        document.getElementById("username_input").value = "";
        user = await middleware.getUserByName(username).data;
        window.location.href = "#homePage";

    }

    

    //- -   -   -   -   -LOGIN- -   -   -   -   -   
    document.getElementById("login_btn").onclick = async () => {
        
        if(document.cookie != "" && document.cookie != null && document.cookie != undefined){
            console.log("ENTRATO IN AREA LOGIN")
            let cookies = document.cookie.split(";");
            console.log(cookies)
            let username = "";
            let found = false;
            
            cookies.forEach((cookie) => {
                if(cookie.split("=")[0].replaceAll(" ", "") == "username"){
                    username = cookie.split("=")[1];
                    found = true;
                }
            })
            if (found){
                const result = await middleware.getUserByName(username);
                user = result.data[0];
                document.getElementById("username_homepage").innerHTML = user.username;
                chatComp.setUser(user);

                window.location.href = "#homePage";
            } else window.location.href = "#loginPage";

            
        } else window.location.href = "#loginPage";
        
    }

    document.getElementById("login_btn_login_space").onclick = async () => {
        //PRENDE I DATI E FA UNA RICHIESTA AL SERVER PER LA LOGIN

        const username = document.getElementById("username_login_input").value;
        const password = document.getElementById("password_login_input").value;
        
        

        const result = await middleware.login(username, stringToHash(password));

        if (result.result == "ok") {
            user = result.user;
            user2 = result.user;

            createCookie(username,10)
            
            //loginComp.setUserData(user)
            document.getElementById("username_homepage").innerHTML = user.username;
            chatComp.setUser(user);
            window.location.href = "#homePage";

        }
    }

    // ----------------- LOGOUT -----------------//

    document.getElementById("buttonLogout").onclick = async () => {
        
        createCookie(user.username,-1000);

        user = {};
        window.location.href = "#starterPage";
    }

    
    buttonCreateChat.onclick = async () => {
        window.location.href = "#searchUserPage";

    }  

    // ----------------- BOTTONI BACK -----------------//

    document.querySelectorAll(".buttonToStarterPage").onclick = () => {
        document.getElementById("email_input").value = "";
        document.getElementById("password_input_register").value = "";
        document.getElementById("username_input").value = "";
        document.getElementById("password_login_input").value = "";
        document.getElementById("username_login_input").value = "";

        window.location.href = "#starterPage";
    }

    document.getElementById("buttonBackChat").onclick = () => {
        document.getElementById("input_messaggio").value = "";
        socket.emit("disconnectchat");
        window.location.href = "#homePage";

    }

    
    document.getElementById("buttonBackCerca").onclick = () => {
        document.getElementById("inputRicercaUtenti").value = "";

        window.location.href = "#homePage";
    }


    // - - - - FUNZIONI SOCKET -  - -
    socket.on("connect",() => {
        "Connesso alla chat!";
    });

    socket.on("arrivingmessage",(messageData) => {
        chatComp.addMess(messageData);
        chatComp.render();
        window.scrollTo(0, document.body.scrollHeight);
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

    pubsub.subscribe("createNewChat",async (chatData) => {
        middleware.createChat(chatData)
    });

    pubsub.subscribe("downloadMessages", async (idChat) => {
        const newData = await middleware.downloadMessages(idChat);
        console.log(newData);
        return newData;
    })

    pubsub.subscribe("setChatMessages",async (messages) => {
        console.log(messages)
        chatComp.setMess(messages)
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

    pubsub.subscribe("getListMess",chatComp.getChatList);


    pubsub.subscribe("upload-img", async (option) => {
        return await middleware.uploadImg(option);
    });
});
