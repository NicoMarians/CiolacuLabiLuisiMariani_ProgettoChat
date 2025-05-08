const database = require('./database.js');    // Importa il modulo del database
const mysql = require('mysql2');              // Importa mysql2 per la connessione al DB
const fs = require('fs');                     // Modulo per il file system per leggere il file di configurazione

// Carica la configurazione di connessione al DB
let config = JSON.parse(fs.readFileSync('public/conf.json'));
config.ssl = {
    ca: fs.readFileSync(__dirname + '/ca.pem') // Aggiungi il certificato SSL
};

// Crea la connessione al database
const connection = mysql.createConnection(config);

// Funzione per eseguire una query SQL
function executeQuery(sql) {
    return new Promise(function (resolve, reject) {
        connection.query(sql, function (err, result) {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

// Funzione per creare il componente della lista di chat
async function createChatList() {
    const sql = 'SELECT * FROM public."Chat"';    // Query SQL per ottenere tutte le chat
    let chatList = await executeQuery(sql);       // Carica le chat dal DB 
    let filter = null;                            // Funzione di filtro 

    // Ritorna l'oggetto con i metodi per interagire con la lista
    return {
        // Imposta i dati della lista (ad esempio, aggiorna la lista delle chat)
        setListData: function (newData) {
            chatList = newData;
        },

        // Imposta una funzione di filtro per applicarla alla lista delle chat
        setFilter: function (filterFn) {
            filter = filterFn;
        },

        // Rimuove il filtro attivo
        removeFilter: function () {
            filter = null;
        },

        // Mostra la lista delle chat (filtrata o completa)
        render: function () {
            let result = [];

            // Applica il filtro se è stato impostato
            if (filter === null) {
                result = chatList;
            } else {
                result = [];
                for (let i = 0; i < chatList.length; i++) {
                    if (filter(chatList[i])) {
                        result.push(chatList[i]);
                    }
                }
            }

            // Stampa la lista delle chat filtrata o completa
            for (let i = 0; i < result.length; i++) {
                const chat = result[i];
                console.log(' Chat:', chat.name);
            }

            return result;
        }
    };
}

module.exports = { createChatList };
