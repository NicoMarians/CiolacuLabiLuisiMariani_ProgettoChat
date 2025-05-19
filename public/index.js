
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
});
