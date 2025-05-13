import { pubsub } from "../BL - components/pubsub.js";

const createMessageFun = (content, time_stamp, idUser, idChat) => {
    // TIME stamp contiene data e ora
    return {
        content: "",
        time_stamp: "",
        idUser: int ,
        idChat: int
    }
}

export const createChatComp = (parentElementIn) => {
    let parentElement = parentElementIn;
    let listMess = [];
    let cur_user; //USER CORRENTE
    let cur_chat;
    
    return {
        setUser: (user) => {
            cur_user = user;
        },
        
        render: () => {
            const template_mandante = `<div class="message-box left"><p>%MESSMANDANTE</p></div>`
            const template_ricevente = `<div class="message-box right"><p>%MESSRICEVENTE</p></div>`
            //console.log(cur_chat)
            let html = `
            <div class="card-header">
                <a href="#chatSpace-container"><-</a>
                <div class="img-avatar">${cur_chat.picture}</div> 
                <div class="text-chat">${cur_chat.name}</div>
            </div>`;
            
            html += `<div class="card-body">
                        <div class="messages-container">`;
            
            
            console.log("LIST MESS CHAT.JS 29: ", listMess);

            listMess.forEach(messaggio => {
                if (messaggio.username == cur_user.username) {
                    html += template_mandante.replace("%MESSMANDANTE", messaggio.text);
                } else {
                    html += template_ricevente.replace("%MESSRICEVENTE", messaggio.text);
                }
            });
            html += "</div>";
            html += `<div class="inputGroup">
                    <input id="input_messaggio" placeholder="Message" class="message-send">
                    <button id="sendButtonMess" class="btn-primary"> Invia </button>
                </div> 
            `;

            parentElement.innerHTML = html;

            document.getElementById("sendButtonMess").onclick = () => {
                const message = document.getElementById("input_messaggio").value;

                const currentTime = new Date().toISOString().slice(0,19).split("T").join(" ");
                console.log("CUR USER CHAT.JS 48 ", cur_user)
                pubsub.publish("createMessage",{
                    "chat_id":cur_chat.id,
                    "user_id":cur_user.id,
                    "type_id": 2,
                    "text":message,
                    "image":null,
                    "timestamp":currentTime
                });
                pubsub.publish("render-chat");
            }   

            console.log("CHAT RENDERIZZATA", listMess)
        },
        setMess: (ListIn) => {
            //PRENDE UNA LISTA DI DIZIONARI CON (CONTENT, TIME, IDUSER, IDCHAT)
            listMess = ListIn;
            console.log("CHAT.JS 68: ", ListIn)
        },
        addMess: (messObj) => {
            //FNZ CHE AGGIUNGE UN OGGETTO MESS ALLA LISTA INTERNA DEL COMPONENTE
            //PASSARE UN DIZIONARIO CON (CONTENT, TIME, IDUSER, IDCHAT)
            listMess.push(messObj);
        },

        setCurChat: (newChat) => {
            cur_chat = newChat;
        }
    }
}


