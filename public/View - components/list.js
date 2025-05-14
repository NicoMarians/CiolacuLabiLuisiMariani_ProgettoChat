import { pubsub } from '../BL - components/pubsub.js';

const confData = await fetch("../conf.json")//.then(r => r.json());

export function createChatList(bindingElement) {
    const parentElement = bindingElement;
    let listChats = [];
    let listCommunities = [];
    let filter = null;                   // Funzione di filtro

    // Ritorna l'oggetto con i metodi per interagire con la lista
    return {
        // Imposta i dati della lista (ad esempio, aggiorna la lista delle chat)
        setChats: function (newData) {
            listChats = newData;
        },

        setCommunities: (newData) => {
            listCommunities = newData.data;
        },

        // Imposta una funzione di filtro per applicarla alla lista delle chat
        setFilter: function (newFilter) {
            filter = newFilter;
        },

        // Rimuove il filtro attivo
        removeFilter: function () {
            filter = null;
        },

        // Mostra la lista delle chat (filtrata o completa)
        render: () => {
            //RENDER COMMUNITIES
            let line = `<h4>Community</h4>`;
            line += listCommunities.map((chat) => {
                const picture = chat.picture == null ? "" : `../../images/${chat.picture}`;
                    return `
                    <div class = "chatDiv" id="chat_${chat.id}">
                        <img src="${picture}" alt="${chat.name[0].toUpperCase()}">
                        <p> ${chat.name} </p>
                    </div>
                `
            }).join("");
            //RENDER CHATS (CON GRUPPI)
            line += `<h4>Private chat</h4>`;
            line += listChats.map((chat) => {
                if (chat.name && filter && chat.name.includes(filter)) {
                    const picture = chat.picture == null ? "" : `../../images/${chat.picture}`;
                    return`
                    <div class = "chatDiv" id=chat_${chat.id}>
                        <img src="${picture}" alt=${chat.name[0].toUpperCase}>
                    </div>
                `}
            }).join("");

            parentElement.innerHTML = line;

            listChats.forEach((chat) => {
                document.getElementById(`chat_${chat.id}`).onclick = async () => {
                    window.location.href = `#chat_${chat.id}`;
                    pubsub.publish("setChat",chat);

                    await pubsub.publish("downloadMessages", chat.id);
                    pubsub.publish("render-chat");
                    pubsub.publish("connectChat",chat.id);

                }
            });

            listCommunities.forEach((chat) => {
                document.getElementById(`chat_${chat.id}`).onclick = async () => {
                    window.location.href = `#MesschatSpace`;
                    pubsub.publish("setChat", chat);

                    await pubsub.publish("downloadMessages", chat.id);

                    // Utilizzo di un evento o una promise per assicurarmi che i dati siano caricati prima di renderizzare
                    await new Promise(resolve => setTimeout(resolve, 250));
                    pubsub.publish("render-chat");
                    
                    pubsub.publish("connectChat",chat.id);
                }
            });
        }
    };
}

