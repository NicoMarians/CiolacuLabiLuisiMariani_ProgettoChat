// -- Parsing -- 
const buttonLogin = document.getElementById("buttonLogin");
const buttonRegister = document.getElementById("buttonRegister");
const buttonCreateChat = document.getElementById("buttonCreateChat");
const searchBar = document.getElementById("seatchBar");
const divUsername = document.getElementById("divUsername");
const divProfilePicture = document.getElementById("divProfilePicture");

// -- Business Logic -- 
import {generatePubSub} from './BL - components/pubsub.js';
import {createMiddleware} from './BL - components/middleware.js';
import {createLogin} from './View - components/login.js';
import {createChatList} from './View - components/list.js';
import { createNavigator } from './View - components/navigator.js';

// -- View --






fetch("./conf.json").then(r => r.json()).then(conf => {
    const pubsub = generatePubSub();
    const middleware = createMiddleware();

})