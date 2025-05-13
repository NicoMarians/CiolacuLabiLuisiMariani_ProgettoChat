//import { pubsub } from '../BL - components/pubsub.js';

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
            if (newData) {
                console.log("COMY CARICATE SU COMP -> ", listCommunities)
            } else {
                listCommunities = []
            }
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
            console.log("LIT COMMY DENTRO RENDER LIST ----->  ", listCommunities)
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
            console.log(line)

            listChats.forEach((chat) => {
                document.getElementById(`chat_${chat.id}`).onclick = async () => {
                    window.location.hash = "#chat";
                    await pubsub.publish("downloadMessages");
                    pubsub.publish("render-chat");
                }
            });
        }
    };
}

