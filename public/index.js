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


fetch("./conf.json").then(r => r.json()).then(conf => {
    const navigator = createNavigator(document.querySelector(".flock-space"));
    
    window.location.href = "#starterPage";
    
    register_btn.onclick = async () => {    
        mailRegister.render();
        window.location.href = "#registerMailPage";
    }   

    document.getElementById("buttonBackChat").onclick = () => {
        document.getElementById("input_messaggio").value = "";
        socket.emit("disconnectchat");
        window.location.href = "#homePage";

    }

});
