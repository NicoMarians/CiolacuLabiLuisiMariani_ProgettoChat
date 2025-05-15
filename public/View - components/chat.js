import { pubsub } from "../BL - components/pubsub.js";

const createMessageFun = (content, time_stamp, idUser, idChat) => {
    // TIME stamp contiene data e ora
    return {
        content: "",
        time_stamp: "",
        idUser: int ,
        idChat: int
    }
}

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
    </div>`;

    const template_ricevente = `
    <div>
        <p class="messaggio-ricevente">%MESSRICEVENTE</p>
        <div class="timestamp-ricevente">%ORA</div>
    </div>`;


    //-------CHAT TEMPLATE (COMMUNITY)--------//
    const template_ricevente_community = `
    <div>
        <div class="messaggio-ricevente">
            <p class="username_ricevente" >%RICEVENTE</p>
            <p>%MESSRICEVENTE</p>
        </div>
        <div class="timestamp-ricevente">%ORA</div>
    </div>`;



    return {
        setUser: (user) => {
            cur_user = user;
        },
        
        render: () => {
            //console.log("LIST MESSAGGI: ", listMess);
            let html = `
            <div class="card-header fisso-sopra">
                <a href="#chatSpace-container"><-</a>
                <div class="img-avatar">${cur_chat.picture}</div> 
                <div class="text-chat">${cur_chat.name}</div>
            </div>`;
            
            html += `<div class="card-body">
                        <div class="messages-container">`;
            
            
            let lastDate = "";
            listMess.forEach(messaggio => {
                let newDate = messaggio.timestamp.split("T")[0];
                if (newDate != lastDate) {
                    html += `<div class="data-mess">
                        ${newDate}
                    </div>`;
                    lastDate = newDate;
                }
                //console.log(messaggio);
                //console.log(cur_user)
                if (messaggio.userid == cur_user.id) {
                    let temp = template_mandante.replace("%MESSMANDANTE", messaggio.text);
                    temp = temp.replace("%ORA", messaggio.timestamp.split("T")[1].slice(0,5));
                    html += temp;
                    
                } else {
                    if (messaggio.type_id == 1) {
                        let temp = template_ricevente.replace("%MESSRICEVENTE", messaggio.text);
                        temp = temp.replace("%ORA", messaggio.timestamp.split("T")[1].slice(0,5));
                        html += temp;

                    } else if (messaggio.type_id == 2) {
                        //CHAT COMMUNITY
                        let temp = template_ricevente_community.replace("%MESSRICEVENTE", messaggio.text);
                        temp = temp.replace("%RICEVENTE", messaggio.username);
                        temp = temp.replace("%ORA", messaggio.timestamp.split("T")[1].slice(0,5));
                        html += temp;
                    }
                }
            });
            html += "</div>";

            parentElement.innerHTML = html;

            document.getElementById("sendButtonMess").onclick = () => {
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
            }
            
                document.getElementById("buttonBackChat").onclick = () => {
                    pubsub.publish("disconnectChat");
                };
            }


            inputImgChat.onclick = async (event) => {
                const formData = new FormData();
                formData.append("file", inputFile.files[0]);
                const body = formData;
                body.description = inputDescription.value;
                const fetchOptions = {
                    method: 'post',
                    body: body
                };
                try {
                    const res = await fetch("/upload", fetchOptions);
                    const data = await res.json();
                    link.setAttribute("href", data.url);
                    link.innerText = data.url;
                } catch (e) {
                    console.log(e);
                }
              }
        },
        setMess: (ListIn) => {
            //PRENDE UNA LISTA DI DIZIONARI CON (CONTENT, TIME, IDUSER, IDCHAT)
            listMess = ListIn;
        },
        addMess: (messObj) => {
            //FNZ CHE AGGIUNGE UN OGGETTO MESS ALLA LISTA INTERNA DEL COMPONENTE
            //PASSARE UN DIZIONARIO CON (CONTENT, TIME, IDUSER, IDCHAT)
            console.log("MESSAGGIO AGGIUNTO")
            listMess.push(messObj);
        },

        setCurChat: (newChat) => {
            cur_chat = newChat;
        }
    }
}


