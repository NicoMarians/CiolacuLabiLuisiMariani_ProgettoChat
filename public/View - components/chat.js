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
    let cur_user = pubsub.publish("getUser"); //USER CORRENTE
    let cur_chat;
    
    return {
        render: () => {
            const template_mandante = `<div>%MESSMANDANTE</div>`
            const template_ricevente = `<div>%MESSRICEVENTE</div>`
            console.log(cur_chat)
            let html = `<div>${cur_chat.picture} <h2>${cur_chat.name}</h2></div>`;

            listMess.forEach(messaggio => {
                if (messaggio.idUser == cur_user.id) {
                    html += template_mandante.replace("%MESSMANDANTE", messaggio.content);
                } else {
                    html += template_mandante.replace("%MESSRICEVENTE", messaggio.content);
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
                pubsub.publish("createMessage",{"chat_id":cur_chat.id,"user_id":cur_user.id,"type_id":1,"text":message,"image":null,"timestamp":currentTime});
            }

            console.log("CHAT RENDERIZZATA", listMess)
        },
        setMess: (ListIn) => {
            //PRENDE UNA LISTA DI DIZIONARI CON (CONTENT, TIME, IDUSER, IDCHAT)
            listMess = ListIn;
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


