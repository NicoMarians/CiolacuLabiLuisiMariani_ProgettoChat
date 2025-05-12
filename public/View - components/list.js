import { pubsub } from '../BL - components/pubsub.js';

const confData = await fetch("./../conf.json").then(r => r.json());

export function createChatList(bindingElement) {
    const parentElement = bindingElement;
    let listChats = [];
    let listCommunities = [];
    let filter = null;                   // Funzione di filtro 

    // Ritorna l'oggetto con i metodi per interagire con la lista
    return {
        // Imposta i dati della lista (ad esempio, aggiorna la lista delle chat)
        setChats: function (newData) {
            listData = newData;
        },

        setCommunities: (newData) => {
            listCommunities = newData;
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
            let line = `<h2>Communities</h2>`;
            line = listCommunities.map((chat) => {
                if (chat.nome.contains(filter)){
                    `
                    <div class = "chatDiv" id=chat_${chat.id}>
                        <img src="./../images/${chat.immagine}" alt=${chat.nome[0].toUpperCase}>
                    </div>
                `}
            }).join("");
            //RENDER CHATS (CON GRUPPI)
            line += `Chats`;
            line += listChats.map((chat) => {
                if (chat.nome.contains(filter)){
                    `
                    <div class = "chatDiv" id=chat_${chat.id}>
                        <img src="./../images/${chat.immagine}" alt=${chat.nome[0].toUpperCase}>
                    </div>
                `}
            }).join("");

            parentElement.innerHTML = line;

            listData.forEach((chat) => {
                document.getElementById(`chat_${chat.id}`).onclick = async () => {
                    window.location.hash = "#chat";
                    await pubsub.publish("downloadMessages");
                    pubsub.publish("render-chat");
                }
            });
        }
    };
}

