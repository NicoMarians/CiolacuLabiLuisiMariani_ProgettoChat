const createMiddleware = () => {
    return {
            downloadUser: async (id) => {
                //Funz che restiuisce informazioni su uno SPECIFICO USER
                const response = await fetch(`/getuser/:${id}`);
                const json = await response.json();
                return json;
            },

            downloadMessages: async (idChat) => {
                //Funz che restiuisce tutti i messaggi di uno SPECIFICO CHAT
                const response = await fetch(`/getmessages/:${idChat}`);
                const json = await response.json();
                return json;
            },
            
            downloadChatAll: async (idUser) => {
                //Funz che restiuisce tutte le CHAT  di uno specifico USER
                const response = await fetch(`/getchat/:${idUser}`);
                const json = await response.json();
                return json;
            },
            
            downloadCommunityAll: async () => {
                //Funz che restituisce tutte le community in cui sei dentro 
                const response = await fetch("/getcommunity");
                const json = await response.json();
                return json;
            },

            createUser: async (datiUser) => {
                //Funz che CREA L'UTENTE, PASSARGLI UN DIZIONARIO CON TUTTE LE INFORMAZIONI 
                const response = await fetch(`/createuser/:${datiUser}`);
                const json = await response.json();
                return json;
            },

            createChat: async (idUser1, idUser2) => {
                //--- CREARE SIA Chat che Chat_user
                const response = await fetch(`/createchat/:${datiUser}`);
                const json = await response.json();
                return json;
            },

            createMessage: async (dizDati) => {
                //--- Crea un nuovo messaggiO, bisogna passarli tutte le informazioni come dizionario (ID mandante, id chat...)
                const response = await fetch(`/createmessage/:${dizDati}`);
                const json = await response.json();
                return json;
            },

            deleteChat: async (idUser, idChat) => {
                //--- Elimina una chat /DA MODIFICARE NON FUNZIONANTW
                const dizDati = {"idUser": idUser, "idChat": idChat}
                const response = await fetch(`/deletechat/:${dizDati}`);
                const json = await response.json();
                return json;
            }

    }
}

    
