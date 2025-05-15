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
            let line = `<div class="list-separated-chat" ><h4>Community</h4>`;
            line += listCommunities.map((chat) => {
                const picture = chat.picture == null ? "" : `../../images/${chat.picture}`;
                    return `
                    <div class = "card h-100" id="chat_${chat.id}">
                        <div class="row gx-5">
                            <div class="col-auto">
                            <img src="${picture}" alt="${chat.name[0].toUpperCase()}">
                            
                            <div class="col">
                                <div class="card-body">
                                    <p> ${chat.name} </p>
                                </div>
                            </div>
                            
                            </div>
                        </div>
                    </div>
                `
            }).join("");
            line += `</div>`;

            //RENDER CHATS (CON GRUPPI)
            line += `<div class="list-separated-chat" ><h4>Private chat</h4>`;
            line += listChats.map((chat) => {
                if (chat.name && filter && chat.name.includes(filter)) {
                    const picture = chat.picture == null ? "" : `../../images/${chat.picture}`;
                    return`
                    <div class = "chatDiv" id=chat_${chat.id}>
                        <img src="${picture}" alt=${chat.name[0].toUpperCase}>
                    </div>
                `}
            }).join("");
            line += `</div>`;
            parentElement.innerHTML = line;

            listChats.forEach((chat) => {
                document.getElementById(`chat_${chat.id}`).onclick = async () => {
                    pubsub.publish("setChat",chat);

                    await pubsub.publish("downloadMessages", chat.id);
                    
                    await pubsub.publish("connectChat",chat.id);
                    await pubsub.publish("render-chat");
                    window.scrollTo(0, document.body.scrollHeight);
                    
                    window.location.href = `#chatPage`;
                }
            });

            listCommunities.forEach((chat) => {
                document.getElementById(`chat_${chat.id}`).onclick = async () => {
                    await pubsub.publish("setChat", chat);

                    const newMessages = await pubsub.publish("downloadMessages", chat.id);
                    //await new Promise(resolve => setTimeout(resolve, 500));

                    console.log(newMessages)
                    await pubsub.publish("setChatMessages", newMessages);


                    // Utilizzo di un evento o una promise per assicurarmi che i dati siano caricati prima di renderizzare
                    //await new Promise(resolve => setTimeout(resolve, 300));
                    
                    await pubsub.publish("connectChat",chat.id);
                    const messages = pubsub.publish("getListMess");
                    console.log(messages)

                    await pubsub.publish("render-chat");
                    window.scrollTo(0, document.body.scrollHeight);
                    window.location.href = `#chatPage`;

                }
            });
        }
    };
}

