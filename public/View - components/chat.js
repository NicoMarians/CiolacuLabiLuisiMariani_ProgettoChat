import { pubsub } from "../BL - components/pubsub.js";
import {middleware} from "../BL - components/middleware.js"


export const createChatComp = (parentElementIn) => {
    let parentElement = parentElementIn;
    let listMess = [];
    let cur_user; //USER CORRENTE
    let cur_chat;

    //-------CHAT TEMPLATE (CHAT PRIVATE)--------//
    const template_mandante = `
    <div>
        <p class="messaggio-mandante">%MESSMANDANTE</p>
        <div class="timestamp-mandante">%ORA</div>
    </div>
    `;
    const template_ricevente = `
    <div>
        <p class="messaggio-ricevente">%MESSRICEVENTE</p>
        <div class="timestamp-ricevente">%ORA</div>
    </div>
    `;
    //-------CHAT TEMPLATE (COMMUNITY)--------//
    const template_ricevente_community = `
    <div>
        <div class="messaggio-ricevente">
            <p class="username_ricevente" >%RICEVENTE</p>
            <p>%MESSRICEVENTE</p>
        </div>
        <div class="timestamp-ricevente">%ORA</div>
    </div>
    `;
    const template_ricevente_community_img = `
    <div>
        <div class="messaggio-ricevente">
            <img src="%IMG">
            <p>%MESSRICEVENTE</p>
        </div>
        <div class="timestamp-ricevente">%ORA</div>
    </div>
    `;
    //-------CHAT TEMPLATE (CON IMMAGINI)--------//
    const template_mandante_img = `
    <div>
        <div class="messaggio-mandante">
            <img src="%IMG">
        </div>
        <div class="timestamp-ricevente">%ORA</div>
    </div>
    `;
    const template_ricevente_img = `
    <div>
        <div class="messaggio-ricevente">
            <img src="%IMG">
        </div>
        <div class="timestamp-ricevente">%ORA</div>
    </div>
    `;

    //FUNZIONI
    const setUser = (user) => {cur_user = user;}
    const getChatList =  () => {return listMess;}
    const setMess = (ListIn) => {
        //PRENDE UNA LISTA DI DIZIONARI CON (CONTENT, TIME, IDUSER, IDCHAT)
        listMess = ListIn;
    }
    const addMess = (messObj) => {
        //FNZ CHE AGGIUNGE UN OGGETTO MESS ALLA LISTA INTERNA DEL COMPONENTE
        //PASSARE UN DIZIONARIO CON (CONTENT, TIME, IDUSER, IDCHAT)
        listMess.push(messObj);
    }
    const setCurChat = (newChat) => {
        cur_chat = newChat;
    }
    const render = () => {
        //console.log("LIST MESSAGGI: ", listMess);
        let html = `
        <div class="card-header fisso-sopra">
            <div class="img-avatar">${cur_chat.picture}</div> 
            <div class="text-chat">${cur_chat.name}</div>
        </div>`;
        
        html += `<div class="card-body">
                    <div class="messages-container">`;
        
        
        let lastDate = "";
        listMess.forEach(messaggio => {
            let newDate = messaggio.timestamp.split("T")[0];
            if (newDate != lastDate) {
                html += `<div class="data-mess">${newDate}</div>`;
                lastDate = newDate;
            }
            //console.log(messaggio);
            //console.log(cur_user)
            if (messaggio.userid == cur_user.id) {
                //MANDANTE
                if (messaggio.image) {
                    //SE è UN MESSAGGIO CON IMMAGINE
                    let temp = template_mandante_img.replace("%MESSMANDANTE", messaggio.text);
                    temp = temp.replace("%ORA", messaggio.timestamp.split("T")[1].slice(0,5));
                    temp = temp.replace("%IMG", messaggio.image)
                    html += temp;
                } else {
                    //TEXT MESS
                    let temp = template_mandante.replace("%MESSMANDANTE", messaggio.text);
                    temp = temp.replace("%ORA", messaggio.timestamp.split("T")[1].slice(0,5));
                    html += temp;
                }
            } else {
                //RICEVENTE
                if (messaggio.type_id == 1) {
                    if (messaggio.image) {
                        //SE è UN MESSAGGIO CON IMMAGINE
                        let temp = template_ricevente_img.replace("%MESSRICEVENTE", messaggio.text);
                        temp = temp.replace("%ORA", messaggio.timestamp.split("T")[1].slice(0,5));
                        temp = temp.replace("%IMG", messaggio.image)
                        html += temp;
                    }
                    let temp = template_ricevente.replace("%MESSRICEVENTE", messaggio.text);
                    temp = temp.replace("%ORA", messaggio.timestamp.split("T")[1].slice(0,5));
                    html += temp;

                } else if (messaggio.type_id == 2) {
                    //CHAT COMMUNITY
                    if (messaggio.image) {
                        //MESSAGGIO CON IMMAGINE DENTRO COMMUNITY
                        let temp = template_ricevente_community_img.replace("%MESSRICEVENTE", messaggio.text);
                        temp = temp.replace("%ORA", messaggio.timestamp.split("T")[1].slice(0,5));
                        temp = temp.replace("%IMG", messaggio.image)
                        html += temp;
                    }
                        let temp = template_ricevente_community.replace("%MESSRICEVENTE", messaggio.text);
                        temp = temp.replace("%RICEVENTE", messaggio.username);
                        temp = temp.replace("%ORA", messaggio.timestamp.split("T")[1].slice(0,5));
                        html += temp;
                }
            }
        });

        html += "</div> </div>"

        parentElement.innerHTML = html;

        document.getElementById("sendButtonMess").onclick = () => {
            const inputFile = document.getElementById("inputImgChat");
            const message = document.getElementById("input_messaggio").value;
            
            if (message.replaceAll(" ", "")) {
                const currentTime = new Date().toISOString().slice(0,19).split("T").join(" ");
                pubsub.publish("createMessage",{
                    "chat_id":cur_chat.id,
                    "user_id":cur_user.id,
                    "type_id": 2,
                    "text":message,
                    "image":null,
                    "timestamp":currentTime
                });
                pubsub.publish("render-chat");

                const newCurrentTime = new Date().toISOString().slice(0,19);
                pubsub.publish("sendMessage",{"text":message,"chat":cur_chat.id,"userId":cur_user.id,"timestamp":newCurrentTime});

                window.scrollTo(0, document.body.scrollHeight);
                document.getElementById("input_messaggio").value = "";
                pubsub.publish("render-chat");
                window.scrollTo(0, document.body.scrollHeight);
        
            } else { 
                console.log("MESSAGGIO VUOTO", inputFile.files[0])
                //SE L'INPUT è VUOTO CONTROLLO SE L'UTENTE HA AGGIUNTO UN'IMMAGINE, SE SI CREA UN NUOVO MESSAGGIO E LO MANDA CON LA SOCKET
                if (inputFile.files != "") {async () => {
                    console.log("SALVATAGGIO IMG");
                    const formData = new FormData();
                    formData.append("file", inputFile.files[0]);
                    const body = formData;
                    body.description = inputDescription.value;
                    const fetchOptions = {
                        method: 'post',
                        body: body
                    };
                    try {
                        const res = await pubsub.publish("upload-img", fetchOptions);
                        const data = await res.json();

                        const currentTime = new Date().toISOString().slice(0,19).split("T").join(" ");
                        pubsub.publish("createMessage",{
                            "chat_id":cur_chat.id,
                            "user_id":cur_user.id,
                            "type_id": 2,
                            "text":message,
                            "image":data.url,
                            "timestamp":currentTime
                        });
        
                        const newCurrentTime = new Date().toISOString().slice(0,19);
                        pubsub.publish("sendMessage",{"text":"","chat":cur_chat.id,"userId":cur_user.id,"timestamp":newCurrentTime, "image": data.url});
                        
                        window.scrollTo(0, document.body.scrollHeight);
                        document.getElementById("input_messaggio").value = "";
                        pubsub.publish("render-chat");
                        window.scrollTo(0, document.body.scrollHeight);

                    } catch (e) {
                        console.log(e);
                    }
                    }
                }
            }
        }
    }

    //-----------------------------------------PUBSUB SUBCRISEBES

    




    

    return {
        setUser: setUser,

        getChatList: getChatList,
        
        render: render,
                
        setMess: setMess,

        addMess: addMess,

        setCurChat: setCurChat
    }
}


