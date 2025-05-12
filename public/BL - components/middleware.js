export const createMiddleware = () => {

    return {
            downloadUser: async (id) => {
            // Funzione che restituisce informazioni su uno specifico utente
            const response = await fetch(`/getuser/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                    }
                });
                const json = await response.json();
                return json;
            },

            downloadMessages: async (idChat) => {
            // Funzione che restituisce tutti i messaggi di una specifica chat
            const response = await fetch(`/getmessages/${idChat}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const json = await response.json();
            return json;
            },

            
            downloadChatAll: async (idUser) => {
                //Funz che restiuisce tutte le CHAT di uno specifico USER
                const response = await fetch(`/getchat/${idUser}`);
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
                // Funzione che crea un utente, passando un oggetto con tutte le informazioni
                const response = await fetch(`/createuser`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(datiUser)
                });
                const json = await response.json();
                return json;
            },

            createChat: async (idUser1, idUser2) => {
                //--- CREARE SIA Chat che Chat_user
                const response = await fetch(`/createchat`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ "user_1":idUser1, "user_1":idUser2 })
                });
                const json = await response.json();
                return json;
            },

            joinChat: async (userId,chatId) => {
                const response = await fetch(`/joinChat`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({"user":userId,"chat":chatId})
                });
                const json = await response.json();
                return json;
            },

            createMessage: async (dizDati) => {
                // Funzione che crea un nuovo messaggio, passando tutte le informazioni come oggetto
                const response = await fetch(`/createmessage`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(dizDati)
                });
                const json = await response.json();
                return json;
            },

            deleteChat: async (idUser, idChat) => {
                // Funzione che elimina una chat, passando i dati nel body
                const response = await fetch(`/deletechat/${idChat}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ idUser, idChat })
                });
                const json = await response.json();
                return json;
            },
            
            sendMail: async (mail) => {
                const response = await fetch(`/mailer`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ "mail":mail })
                });
                const password = await response.json();
                return password;
            }
    }
}




