import { pubsub } from "../BL - components/pubsub.js";
import {middleware} from "../BL - components/middleware.js"


const createChatComp = () => {
    let parentElement;
    let listMess = [];
    

    //-------CHAT TEMPLATE (CHAT PRIVATE)--------//
    const template_mandante = `
    <div>
        <p class="messaggio-mandante">%MESSMANDANTE</p>
        <div class="timestamp-mandante">%ORA</div>
    </div>
    `;
    const template_ricevente = `
    <div>
        <p class="messaggio-ricevente">%MESSRICEVENTE</p>
        <div class="timestamp-ricevente">%ORA</div>
    </div>
    `;
    //-------CHAT TEMPLATE (COMMUNITY)--------//
    const template_ricevente_community = `
    <div>
        <div class="messaggio-ricevente">
            <p class="username_ricevente" >%RICEVENTE</p>
            <p>%MESSRICEVENTE</p>
        </div>
        <div class="timestamp-ricevente">%ORA</div>
    </div>
    `;
    const template_ricevente_community_img = `
    <div>
        <div class="messaggio-ricevente">
            <img src="%IMG">
            <p>%MESSRICEVENTE</p>
        </div>
        <div class="timestamp-ricevente">%ORA</div>
    </div>
    `;
    //-------CHAT TEMPLATE (CON IMMAGINI)--------//
    const template_mandante_img = `
    <div>
        <div class="messaggio-mandante">
            <img src="%IMG">
        </div>
        <div class="timestamp-ricevente">%ORA</div>
    </div>
    `;
    const template_ricevente_img = `
    <div>
        <div class="messaggio-ricevente">
            <img src="%IMG">
        </div>
        <div class="timestamp-ricevente">%ORA</div>
    </div>
    `;

    //FUNZIONI
    const setParenteElement = (pr) => {parentElement = pr}
    const setUser = (user) => {cur_user = user;}
    const getChatList =  () => {return listMess;}
    const setMess = (ListIn) => {
        //PRENDE UNA LISTA DI DIZIONARI CON (CONTENT, TIME, IDUSER, IDCHAT)
        listMess = ListIn;
    }
    const addMess = (messObj) => {
        //FNZ CHE AGGIUNGE UN OGGETTO MESS ALLA LISTA INTERNA DEL COMPONENTE
        //PASSARE UN DIZIONARIO CON (CONTENT, TIME, IDUSER, IDCHAT)
        listMess.push(messObj);
    }
    const setCurChat = (newChat) => {
        cur_chat = newChat;
    }
    const render = () => {
        //console.log("LIST MESSAGGI: ", listMess);
        let html = `
        <div class="card-header fisso-sopra">
            <div class="img-avatar">${cur_chat.picture}</div> 
            <div class="text-chat">${cur_chat.name}</div>
        </div>`;
        
        html += `<div class="card-body">
                    <div class="messages-container">`;
        
        
        let lastDate = "";
        listMess.forEach(messaggio => {
            let newDate = messaggio.timestamp.split("T")[0];
            if (newDate != lastDate) {
                html += `<div class="data-mess">${newDate}</div>`;
                lastDate = newDate;
            }
            //console.log(messaggio);
            //console.log(cur_user)
            if (messaggio.userid == cur_user.id) {
                //MANDANTE
                if (messaggio.image) {
                    //SE è UN MESSAGGIO CON IMMAGINE
                    let temp = template_mandante_img.replace("%MESSMANDANTE", messaggio.text);
                    temp = temp.replace("%ORA", messaggio.timestamp.split("T")[1].slice(0,5));
                    temp = temp.replace("%IMG", messaggio.image)
                    html += temp;
                } else {
                    //TEXT MESS
                    let temp = template_mandante.replace("%MESSMANDANTE", messaggio.text);
                    temp = temp.replace("%ORA", messaggio.timestamp.split("T")[1].slice(0,5));
                    html += temp;
                }
            } else {
                //RICEVENTE
                if (messaggio.type_id == 1) {
                    if (messaggio.image) {
                        //SE è UN MESSAGGIO CON IMMAGINE
                        let temp = template_ricevente_img.replace("%MESSRICEVENTE", messaggio.text);
                        temp = temp.replace("%ORA", messaggio.timestamp.split("T")[1].slice(0,5));
                        temp = temp.replace("%IMG", messaggio.image)
                        html += temp;
                    }
                    let temp = template_ricevente.replace("%MESSRICEVENTE", messaggio.text);
                    temp = temp.replace("%ORA", messaggio.timestamp.split("T")[1].slice(0,5));
                    html += temp;

                } else if (messaggio.type_id == 2) {
                    //CHAT COMMUNITY
                    if (messaggio.image) {
                        //MESSAGGIO CON IMMAGINE DENTRO COMMUNITY
                        let temp = template_ricevente_community_img.replace("%MESSRICEVENTE", messaggio.text);
                        temp = temp.replace("%ORA", messaggio.timestamp.split("T")[1].slice(0,5));
                        temp = temp.replace("%IMG", messaggio.image)
                        html += temp;
                    }
                        let temp = template_ricevente_community.replace("%MESSRICEVENTE", messaggio.text);
                        temp = temp.replace("%RICEVENTE", messaggio.username);
                        temp = temp.replace("%ORA", messaggio.timestamp.split("T")[1].slice(0,5));
                        html += temp;
                }
            }
        });

        html += "</div> </div>"

        parentElement.innerHTML = html;
        window.scrollTo(0, document.body.scrollHeight);        
    }

    //-----------------------------------------PUBSUB SUBCRISEBES
    
    
    




    

    return {
        setParenteElement : setParenteElement,

        setUser: setUser,

        getChatList: getChatList,
        
        render: render,
                
        setMess: setMess,

        addMess: addMess,

        setCurChat: setCurChat
    }
}


export const chatComp = createChatComp()