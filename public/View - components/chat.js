const createMessageFun = (content, time_stamp, idUser) => {
    // TIME stamp contiene data e ora
    return {
        content: "",
        time_stamp: "",
        idUser: int 
    }
}

const createChatComp = (parentElementIn, pubsub) => {
    listMess = [];
    parentElement = parentElementIn;
    return {
        createMessage: (content, time_stamp, idUser) => {
            newMess = createMessageFun(content, time_stamp, idUser)
            listMess.push(newMess);
            pubsub.publish("render-chat", listMess); //CREARE LA FUNZIONE PUBSUB ("render-chat") DENTRO INDEX.JS
        },

        render: () => { 
            
        }
    }
}


