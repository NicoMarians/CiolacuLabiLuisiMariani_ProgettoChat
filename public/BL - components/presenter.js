import { pubsub } from "./pubsub.js";
//import { middleware } from "./middleware.js";
import { chatComp } from "../View - components/chat.js";
import { chatListComp } from "../View - components/list.js";
import { newChat } from "../View - components/newChat.js";
import { formComp } from "../View - components/form.js";

function scrollToBottom() {
    const messagesDiv = document.getElementById("chatSpace-container");
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
  

//AGGIUNGERE GESTIONE SOCKET X IL DEMONE DI PASTOUR

const socket = io();

const createPresenter = () => {
    // - - - - - - - - - - - - - - - - - - - - - - - ATTRIBUTI - - - - - - - - - - - - - - - - - - - - - - - 
    /*
    DIZIONARIO CON CHIAVE "chatId" E VALORE UNA LISTA CON TUTTI I 
    MESSAGGI SOTTOFORMA DI OGGETTI
    */
    let listChat;

    //COME SOPRA MA CON COMMUNITY
    let listCommunity;

    //LISTA DI TUTTI GLI UTENTI
    let listUsers = [];

    let cur_user;

    let listMessaggi;

    //FUNZIONI

    // - - - - - - - - - - - - - - - - - - - - - - - FUNZIONI SOCKET - - - - - - - - - - - - - - - - - - - - - - - 
    //emits getAllChats--------------->        è Messo dentro pubsub section
    // Richiesta al server per ricevere tutte le chat
    

    //listening <--------
    socket.on("connect", () => {
        console.log("Connesso alla chat!");
    });

    socket.on("newChatCreated",(data) => {
        data[0].forEach((user) => {
            if(user.id == cur_user.id){
                pubsub.publish("ready-user-presenter");
                if (window.location.href == `#createChatPage`){
                    window.location.href = `#homePage`;
                }
            }
        })
    })

    socket.on("renderNewChat",(chat) => {
        socket.emit("getAllMessages",chat);
    })
    
    socket.on("allChats", (allChatList) => {
        //quando il server manda i messassi allora gli aggiunge dentro il comp ed effettua la render chiamando il publish
        //viengono salvate le chat dentro list.js e generato in locale 
        if (allChatList.result == "ok"){
            console.log("Lista chat: ", allChatList)

            chatListComp.setData(allChatList.chatPriv.concat(allChatList.community));
            listChat = allChatList.chatPriv;
            listCommunity = allChatList.community;

            pubsub.publish("readyList");
            console.log("Liste chat salvate")
        
            //SALVATAGGIO MESSAGGI  
        }
    });
    
    socket.on("newMessage",(chatId) => {
        let found = false;
        let foundChat;
        listChat.forEach((chat) => {
            if(chat.id == chatId){
                foundChat = chat;
                found = true;
            }
        });
        listCommunity.forEach((chat) => {
            if(chat.id == chatId){
                foundChat = chat;
                found = true;
            }
        });
        if (found){
            socket.emit("getAllMessages",foundChat);
        }
    })

    socket.on("returnAllUsers",(allUsers) => {
        listUsers = allUsers;
        console.log(listUsers);
    });
    
    socket.on("arrivingmessage",(messageData) => {
        try {
            chatComp.addMess(messageData);
            chatComp.render();
            //formComp.setUser(cur_user);
            //formComp.setCurChat(allMessages.chatData);
            //formComp.render();
            console.log("CHAT RENDERIZZATA");
        } catch (e){
            console.log("errore: ", e);
        }
        });

    socket.on("allUsers",(userList) => {
        listUsers = userList;
    });

    socket.on("returnAllMessages", (allMessages, chat) => {
        listMessaggi = allMessages;
        console.log(allMessages)
        chatComp.setMess(allMessages);
        console.log("MESSAGGI CARICATI SU CHAT.JS ->", allMessages);
        chatComp.setUser(cur_user);
        chatComp.render();

        //-form
        formComp.setCurChat(allMessages.chatData);
        formComp.setUser(cur_user);
        formComp.setCurChat(chat);
        formComp.render();
        
        window.location.href = `#chatPage`;
        scrollToBottom();
    })
    // - - - - - - - - - - - - - - - - - - 





    // - - - - - - - - - - - - - - - - - - - - - - - PUBSUB - - - - - - - - - - - - - - - - - - - - - - - 
    pubsub.subscribe("ready-user-presenter", () =>{
        socket.emit("getAllChats", (cur_user));
        //console.log("USER INSERITO IN PRESENTER: ", cur_user);
    });
    pubsub.subscribe("getChatList", () => {
        //richiamato da list.js, carica le chat sul componente
        chatListComp.setChats(listChat);
        chatListComp.setCommunities(listCommunity);
        console.log("List chat caricate su list.js");     
    });

    pubsub.subscribe("getMessages", (chat) => {
        //richiamato ogni volta che si preme su una chat, carica i messaggi dentro a chat.js
        socket.emit("getAllMessages", chat);
    });

    pubsub.subscribe("sendOne", (message) => {
        //richiamato da form.js, prende il contenuto del messaggio e:  lo invia alle altre socket | lo salva sul database
        //- passare dizionario già creato correttamente -> objMess

        socket.emit("sendOne", message);  //<- lo manda al server
    });


    // - - - - - - - - - - - - - - - - - - - - - - - METODI - - - - - - - - - - - - - - - - - - - - - - - 

    const getAllUsers = () => listUsers;

    const getAllChats = () => listChat;

    const getAllCommunities = () => listCommunity;

    const getUser = () => cur_user;

    const setUser = (newUser) => cur_user = newUser;

    const resetUser = () => {cur_user = {}};

    const hashPassword = (str) => {
        let hash = 0;
        for (let i = 0, len = str.length; i < len; i++) {
            let chr = str.charCodeAt(i);
            hash = (hash << 5) - hash + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }

    const createNewChat = (users,chatName,chatImage) => {
        socket.emit("createNewChat",{"users":users,"chatName":chatName,"chatImage":chatImage});
    }
    

    // - - - - - - - - - - - - - - - - - - - - - - - RETURN - - - - - - - - - - - - - - - - - - - - - - - 
    return {
        getAllUsers: getAllUsers,
        getAllChats: getAllChats,
        getAllCommunities: getAllCommunities,
        getUser: getUser,
        setUser: setUser,
        resetUser: resetUser,
        hashPassword: hashPassword,
        createNewChat: createNewChat
    }
}

export const presenter = createPresenter();