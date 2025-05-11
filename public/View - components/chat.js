const createMessageFun = (content, time_stamp, idUser, idChat) => {
    // TIME stamp contiene data e ora
    return {
        content: "",
        time_stamp: "",
        idUser: int 
    }
}

const createChatComp = (parentElementIn, pubsub) => {
    parentElement = parentElementIn;
    listMess = [];
    currentUserId = 0;
    return {
        createMessage: (content, time_stamp, idUser, idChat) => {
            newMess = createMessageFun(content, time_stamp, idUser, idChat)
            listMess.push(newMess);
            //pubsub.publish("render-chat", listMess); //CREARE LA FUNZIONE PUBSUB ("render-chat") DENTRO INDEX.JS
        },

        render: (idChat_in) => { 
            const template = `<a><li>%CHAT</li></a`
            let html = "";
            listMess.forEach(messaggio => {
                if (messaggio.idUser == currentUserId && messaggio.idChat == idChat_in)
                html += template.replace("%CHAT", messaggio);
            });
        },
        setMess: (ListIn) => {
            //PRENDE UNA LISTA DI DIZIONARI CON (CONTENT, TIME, IDUSER, IDCHAT)
            listMess = ListIn;
            ListIn.forEach((mess) => {
                listMess.push(createMessageFun(mess.content, mess.time_stamp, mess.idUser, mess.idChat))
            })
        },
        addMess: (messObj) => {
            //FNZ CHE AGGIUNGE UN OGGETTO MESS ALLA LISTA INTERNA DEL COMPONENTE
            //PASSARE UN DIZIONARIO CON (CONTENT, TIME, IDUSER, IDCHAT)
            listMess.push(createMessageFun(messObj.content, messObj.time_stamp, messObj.idUser, messObj.idChat))
        }
    }
}


module.exports = createChatComp;