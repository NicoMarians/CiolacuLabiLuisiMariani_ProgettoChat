// -- Parsing -- 
const a = '';


document.body.focus();


// -- Business Logic -- 
import {generatePubSub} from './BL - components/pubsub.js';
import {createMiddleware} from './BL - components/middleware.js';
import {createChatComp} from './View - components/chat.js'
import {createNavigator} from "./View - components/navigator.js";

// -- View --






fetch("./conf.json").then(r => r.json()).then(conf => {
    const pubsub = generatePubSub();
    const middleware = createMiddleware();
    const chatComp = createChatComp(a,pubsub)
    const navigator = createNavigator(document.querySelector("#container"),detailComp);



    pubsub.subscribe("render-chat", () => {
        chatComp.render();
    }); 
    pubsub.subscribe("set-data", (list) =>{
        //PASSARE UNA LISTA DI DIZIONARIO CON SEGUENTE FORMATO -> content, time_stamp, idUser, idChat
        chatComp.addMess(list);
        middleware.createMessage()
    });




})