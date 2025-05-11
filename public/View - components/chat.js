const createMessageFun = (content, time_stamp, idUser, idChat) => {
    // TIME stamp contiene data e ora
    return {
        content: "",
        time_stamp: "",
        idUser: int 
    }
}

export const createChatComp = (parentElementIn, pubsub) => {
    let parentElement = parentElementIn;
    let listMess = [];
    let currentUserId = 0;
    return {
        createMessage: (content, time_stamp, idUser, idChat) => {
            newMess = createMessageFun(content, time_stamp, idUser, idChat)
            listMess.push(newMess);
            //pubsub.publish("render-chat", listMess); //CREARE LA FUNZIONE PUBSUB ("render-chat") DENTRO INDEX.JS
        },

        render: () => { 
            const template = `<li>%CHAT</li>`
            listMess.forEach(messaggio => {
                html += template.replace("%CHAT", messaggio.content);
            });
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


