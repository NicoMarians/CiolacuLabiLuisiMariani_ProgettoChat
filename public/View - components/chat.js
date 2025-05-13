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
            const template_mandante = `<div>%MESSMANDANTE</div>`
            const template_ricevente = `<div>%MESSRICEVENTE</div>`
            //console.log(cur_chat)
            let html = `<div>${cur_chat.picture} <h2>${cur_chat.name}</h2></div>`;
            console.log("LIST MESS CHAT.JS 29: ", listMess);

            listMess.forEach(messaggio => {
                if (messaggio.idUser == cur_user.id) {
                    html += template_mandante.replace("%MESSMANDANTE", messaggio.text);
                } else {
                    html += template_ricevente.replace("%MESSRICEVENTE", messaggio.text);
                }
            });

            html += `<div>
                    <input id="input_messaggio" placeholder="Message">
                    <button id="sendButtonMess" > Invia </button>
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

                pubsub.publish("sendMessage",{"text":message,"chat":cur_chat.id,"userId":cur_user.id});

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


