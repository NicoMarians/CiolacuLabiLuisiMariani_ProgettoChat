//import { pubsub } from "../BL - components/pubsub";

const createMessageFun = (content, time_stamp, idUser, idChat) => {
    // TIME stamp contiene data e ora
    return {
        content: "",
        time_stamp: "",
        idUser: int ,
        idChat: int
    }
}

export const createChatComp = (parentElementIn, userIn) => {
    let parentElement = parentElementIn;
    let listMess = [];
    let cur_user = userIn; //USER CORRENTE
    
    return {
        render: () => { 
            const template_mandante = `<div class="chat-message self-end bg-blue-500 text-white max-w-xs rounded-lg px-3 py-1.5 text-sm">%MESSMANDANTE</div>`
            const template_ricevente = `<div class="chat-message self-start bg-zinc-500 text-white max-w-xs rounded-lg px-3 py-1.5 text-sm">%MESSRICEVENTE</div>`

            listMess.forEach(messaggio => {
                if (messaggio.idUser == cur_user.id) {
                    html += template_mandante.replace("%MESSMANDANTE", messaggio.content);
                } else {
                    html += template_mandante.replace("%MESSRICEVENTE", messaggio.content);
                }
            });

            document.getElementById("sendButtonMess").onclick = () => {

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
        }
    }
}


