import { pubsub } from "../BL - components/pubsub";


export const createFormComp = (parentElement) => {
    template_form = `
    <div class="input-group px-1 mt-1">
        <input class="inputImgChat" id="inputImgChat" type="file" single>
        <input type="text" id="input_messaggio" placeholder="Message..." class="form-control">
        <button type="button" id="sendButtonMess" class="btn btn-light"> ➤ </button>
    </div> 
    `
    let cur_user; //USER CORRENTE
    let cur_chat;


    const setUser = (user) => {cur_user = user;}
    const setCurChat = (newChat) => {cur_chat = newChat;}

    messaggio = {
        "userId": "",
        "chatId" : "",
        "text" : "",
        "urlImmagine": "",
        "timestamp" : ""
    }



    return {

    }
}