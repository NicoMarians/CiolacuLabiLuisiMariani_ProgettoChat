const database = require('./database.js');    // Importa il modulo del database
const mysql = require('mysql2');              // Importa mysql2 per la connessione al DB
const fs = require('fs');                     // Modulo per il file system per leggere il file di configurazione

import { pubSub } from '../BL - components/pubsub.js';

// Carica la configurazione di connessione al DB
let config = JSON.parse(fs.readFileSync('public/conf.json'));
config.ssl = {
    ca: fs.readFileSync(__dirname + '/ca.pem') // Aggiungi il certificato SSL
};

const confData = await fetch("./../conf.json").then( r => r.JSON());

// Crea la connessione al database
const connection = mysql.createConnection(config);

// Funzione per creare il componente della lista di chat
async function createChatList(bindingElement) {
    const parentElement = bindingElement;
    let listData = [];
    let filter = null;                   // Funzione di filtro 

    // Ritorna l'oggetto con i metodi per interagire con la lista
    return {
        // Imposta i dati della lista (ad esempio, aggiorna la lista delle chat)
        setListData: function (newData) {
            listData = newData;
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
            // Applica il filtro se è stato impostato

            let line = listData.map((chat) => {
                `
                <div class = "chatDiv" id=chat_${chat.id}>
                    <img src="./../images alt=${chat.nome[0].toUpperCase}>
                </div>
                `
            });

            parentElement.innerHTML = line;

            listData.forEach((chat) => {
                document.getElementById(`chat_${chat.id}`).onclick = () => {
                    window.location.hash = "#chat";
                    pubSub.publish("getCommunitiesAll");
                    pubSub.publish("getChatAll");
                    pubSub.publish("renderChat");
                }
            });

        }
    };
}

module.exports = { createChatList };
