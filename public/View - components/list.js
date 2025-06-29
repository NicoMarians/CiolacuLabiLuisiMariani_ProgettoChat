import { pubsub } from '../BL - components/pubsub.js';
import { presenter } from '../BL - components/presenter.js';

const confData = await fetch("../conf.json")//.then(r => r.json());


// -------------------------------------DA MODIFICARE------------------------------------------

const createHomeHeader = (newElement) => {
    const bindingElement = newElement;

    const render = () => {
        line = `
            <input type="text" id="filterChat" class="form-control" placeholder="&#x1F50E;&#xFE0E; Cerca">
        `;
    }
}

const createChatList = (newElement) => {
    const bindingElement = newElement;
    let filter = "";                   // Funzione di filtro
    let listCommunities = [];
    let listChats = [];
    let cur_user;

    const setData = (dataIn) => {
        listCommunities = [];
        listChats = [];
        dataIn.forEach((chat) => {
            if (chat.id_tipo == 2) {
                //è una commy
                listCommunities.push(chat);

            } else if (chat.id_tipo == 1) {
                //è una chat privata
                listChats.push(chat);
            }
        })
    }
    const setFilter = (newFilter) => {
        filter = newFilter;
    }
    const removeFilter = () => {filter = null}

    const getChats = () => listChats;
    
    const getCommunities = () => listCommunities;

    const render = () => {
        //RENDER COMMUNITIES
        let line = `<div class="list-separated-chat" ><h4>Community</h4>`;
        line += listCommunities.map((chat) => {
            const picture = chat.picture == null ? "" : `../../${chat.picture}`;
                return `
                <div class = "chatlistSingle  d-flex align-items-center" id="chat_${chat.id}">                        
                        <img src="${picture}" alt="${chat.name[0].toUpperCase()}" class="img-avatar">
                        <p> ${chat.name} </p>    
                </div>
            `
        }).join("");
        line += `</div>`;

        //RENDER CHATS (CON GRUPPI)
        line += `<div class="list-separated-chat" ><h4>Private chat</h4>`;
        line += listChats.map((chat) => {
            if (chat.name.includes(filter)) {
                const picture = chat.picture == null ? "" : `../../${chat.picture}`;
                console.log(picture)
                return`
                <div class = "chatlistSingle  d-flex align-items-center" id="chat_${chat.id}">                        
                    <img src="${picture}" alt="${chat.name[0].toUpperCase()}" class="img-avatar">
                    <p> ${chat.name} </p>    
                </div>
            `}
        }).join("");
        line += `</div>`;
        bindingElement.innerHTML = line;

        listChats.forEach((chat) => {
            document.getElementById(`chat_${chat.id}`).onclick = async () => {
                //chiedo al presenter di ricevere le chat
                pubsub.publish("getMessages",chat);
                
                window.location.href = `#chatPage`;
                window.scrollTo(0, document.body.scrollHeight);
            }
        });

        listCommunities.forEach((chat) => {
            document.getElementById(`chat_${chat.id}`).onclick = async () => {
                pubsub.publish("getMessages",chat);

                window.location.href = `#chatPage`;
                window.scrollTo(0, document.body.scrollHeight);
            }
        });
    }

    //-------------------------------------PUBSUB-------------------------------------
    pubsub.subscribe("readyList", () => {
        render();
    });




    // Ritorna l'oggetto con i metodi per interagire con la lista
    return {
        getChats: getChats,

        getCommunities: getCommunities,

        setData: setData,
        // Imposta una funzione di filtro per applicarla alla lista delle chat
        setFilter: setFilter,

        // Rimuove il filtro attivo
        removeFilter: removeFilter,

        // Mostra la lista delle chat (filtrata o completa)
        render: render,
    };
}

export const chatListComp = createChatList(document.getElementById("chatSpace"));

