// -- Parsing -- 
const buttonLogin = document.getElementById("buttonLogin");
const buttonRegister = document.getElementById("buttonRegister");
const buttonCreateChat = document.getElementById("buttonCreateChat");
const searchBar = document.getElementById("seatchBar");
const divUsername = document.getElementById("divUsername");
const divProfilePicture = document.getElementById("divProfilePicture");
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
import {middleware} from './BL - components/middleware.js';
import {presenter} from './BL - components/presenter.js';



// -- View --
import { chatListComp } from './View - components/list.js';
import { createNavigator } from './View - components/navigator.js';
import { chatComp } from './View - components/chat.js';
import { newChat} from './View - components/newChat.js';
import { loginComp } from './View - components/login.js';
import { mailRegister } from './View - components/register.js';


let user = {}


fetch("./conf.json").then(r => r.json()).then(conf => {
    const navigator = createNavigator(document.querySelector(".flock-space"));
    
    window.location.href = "#starterPage";
    
    register_btn.onclick = async () => {    
        mailRegister.render();
        window.location.href = "#registerMailPage";
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
                presenter.setUser(user); //<- + importante da avere
                pubsub.publish("ready-user-presenter")

                window.location.href = "#homePage";
            } else {
                loginComp.render();
                window.location.href = "#loginPage"
            };
            
        } else {
            loginComp.render();
            window.location.href = "#loginPage"
        };
        
    }

    document.getElementById("buttonBackChat").onclick = () => {
        document.getElementById("input_messaggio").value = "";
        socket.emit("disconnectchat");
        window.location.href = "#homePage";

    }

});
