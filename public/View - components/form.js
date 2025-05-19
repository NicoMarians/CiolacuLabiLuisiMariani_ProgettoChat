import { pubsub } from "../BL - components/pubsub.js";
import {middleware} from "../BL - components/middleware.js"

const createMessObj = (userIdIn, chatIdIn, textIn, imageIn, timestampIn, typeIn, usernameIn) => {
    let image = imageIn === "" ? null : imageIn;
    let text = textIn === "" ? null : textIn;
    return {
        image: image,
        text: text,
        timestamp: timestampIn,
        type_id: typeIn,
        userid: userIdIn,
        chatId: chatIdIn,
        username: usernameIn
    };
};

const template_form = `
    <div class="input-group px-1 mt-1">
    <input class="inputImgChat" id="inputImgChat" type="file" single>
    <input type="text" id="input_messaggio" placeholder="Message..." class="form-control">
    <button type="button" id="sendButtonMess" class="btn btn-light"> ➤ </button>
    </div> 
`;
    
export const createFormComp = (parentElementIn) => {
    const parentElement = parentElementIn
    let cur_user; //USER CORRENTE
    let cur_chat;



    const setUser = (user) => {cur_user = user;}
    const setCurChat = (newChat) => {cur_chat = newChat;}
    const render = () => {
        parentElement.innerHTML = template_form;
    
        //-------------------------------Biding
        document.getElementById("sendButtonMess").onclick = async () => {
            const inputFile = document.getElementById("inputImgChat");
            const message = document.getElementById("input_messaggio").value;
            const currentTime = new Date().toISOString().slice(0,19).split("T").join(" ");
            const newCurrentTime = new Date().toISOString().slice(0,19);
        
            if (message.replaceAll(" ", "")) {
                document.getElementById("input_messaggio").value = "";
                let messObj = createMessObj(cur_user.id, cur_chat.id, message, "", newCurrentTime, cur_chat.id_tipo, cur_user.usernameIn);
                pubsub.publish("sendOne", messObj)
                console.log("Messaggio inviato  ", messObj)
                
            } else if (inputFile.files && inputFile.files.length > 0) {
                // Carica l'immagine usando il middleware
                console.log("SALVATAGGIO IMG");
                const formData = new FormData();
                console.log("INPUTFILE: ", inputFile.files[0]);
                formData.append("file", inputFile.files[0]);
                const body = formData;
                //body.description = inputDescription.value;
                const fetchOptions = {
                    method: 'post',
                    body: body
                };

                try {
                    const data = await middleware.uploadImg(fetchOptions);
                    console.log("FORMDATa: ", fetchOptions)
                    const imgpath = data.url;
                    console.log("data: ", data);
                    let messObj = createMessObj(cur_user.id, cur_chat.id, "", imgpath, newCurrentTime, cur_chat.id_tipo, cur_user.usernameIn);
                    
                    pubsub.publish("sendOne", messObj)
                    console.log("Messaggio inviato con immagine ", messObj)
                    document.getElementById("input_messaggio").value = "";
                
                } catch (e) {
                    console.log(e);
                }
            }
        }
    };
    
    
    



    return {
        setUser: setUser,
        setCurChat: setCurChat,
        render: render
    }
}


export const formComp = createFormComp(document.getElementById("form-container"));

