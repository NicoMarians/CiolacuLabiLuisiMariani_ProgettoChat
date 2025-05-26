import { pubsub } from "../BL - components/pubsub.js";
import { presenter } from "../BL - components/presenter.js";
import { middleware } from "../BL - components/middleware.js";

const errorDiv = document.getElementById("creaChatErrorDiv");


/*
- - - - - - -SPIEGAZIONE FILE- - - - - - -

QUESTE COMPONENTI SI OCCUPANO DELLA CREAZIONE DI UNA NUOVA CHAT, C'E UNA BARRA
DI RICERCA CON ACCANTO UN BOTTONE ("createNewChatSearch") PER CERCARE GLI UTENTI DA
AGGIUNGERE AL GRUPPO, IL FILTRO E' PASSATO A "createNewChat" QUANDO SI PREME IL BOTTONE
CHE A SUA VOLTA STAMPERA' GLI UTENTI CHE HANNO LA STRINGA NEL USERNAME.UNA VOLTA CHE 
SI CLICCA SULL'UTENTE VIENE AGGIUNTO IN UNA LISTA DI "createNewChat", UNA VOLTA SCELTI TUTTI
GLI UTENTI SI INSERISCE SOTTO IL NOME DEL GRUPPO E L'IMMAGINE, GESTITI DA "createNewChatForm"
CHE DOPO I CONTROLLI DIRA' A "createNewChat" DI MANDARE I DATI AL SERVER CHE CREA IL NUOVO 
GRUPPO AGGIUNGENDO ANCHE GLI UTENTI.
*/ 


//BOTTONE NELLA HOME PER CREARE UNA NUOVA CHAT
document.getElementById("buttonCreateChat").onclick = () => {
    renderPage();
    window.location.href = "#createChatPage";
};

const renderPage = () => {
    newChatBack.render();
    newChatForm.render();
    newChatSearch.render();
    newChat.render();
}

//BOTTONE PER TORNARE ALLA HOME
const createNewChatBack = (newElement) => {
    const bindingElement = newElement;

    const render = () => {
        bindingElement.innerHTML = `
            <button class="btn" type="button" id="buttonBackCerca">Back</button>
        `;

        document.getElementById("buttonBackCerca").onclick = () => {
            window.location.href = "#homePage";
            newChat.resetData();
        }
    }

    return {
        render: render
    }
}

//FORM PER LA CREAZIONE DI UNA CHAT NUOVA
const createNewChatForm = (newElement) => {
    const bindingElement = newElement;

    const render = () => {
        bindingElement.innerHTML = `
        Foto chat: <input type="file" id="inputImmagineChat">
        Nome chat: <input type="text" id="inputNomeChat" placeholder="Nome Chat">
        <button type="button" id="completaCreaChat">Crea chat</button>
        `;

        document.getElementById("completaCreaChat").onclick = async () => {
            const chatName = document.getElementById("inputNomeChat").value;
            const chatImage = document.getElementById("inputImmagineChat");
            let imgpath;

            if (chatName) {
                if (chatImage.files && chatImage.files.length > 0) {
                    // Carica l'immagine usando il middleware
                    const formData = new FormData();
                    console.log("INPUTFILE: ", chatImage.files[0]);
                    formData.append("file", chatImage.files[0]);
                    const body = formData;
                    console.log("BODY: ",body)
                    //body.description = inputDescription.value;
                    const fetchOptions = {
                        method: 'post',
                        body: body
                    };

                    try {
                        const data = await middleware.uploadImg(fetchOptions);
                        console.log("DATA", data)
                        imgpath = data.url;
                    } catch (e) {
                        console.log(e);
                    }
                }
                else {
                    imgpath = null;
                }

                console.log(imgpath)

                let selectedUsers = newChat.getUsers();

                if(selectedUsers.length > 0){
                    const tempSelfUser = presenter.getUser();
                    const selfUser = {"email":tempSelfUser.email,"id":tempSelfUser.id, "picture":tempSelfUser.picture ,"username":tempSelfUser.username  }
                    selectedUsers.push(selfUser);
                    presenter.createNewChat(selectedUsers,chatName,imgpath);
                    window.location.href = `#homePage`;

                } else errorDiv.innerHTML = "Aggiungere almeno un utente";
            } else errorDiv.innerHTML = "Inserimento nome o immagine chat errati";
        }
    };

    return {
        render: render
    }
};

//BARRA DI RICERCA E BOTTONE PER TROVARE GLI UTENTI DA AGGIUNGERE
const createNewChatSearch = (newElement) => {
    //ATTRIBUTI
    const bindingElement = newElement;

    //METODI

    const render = () => {
        bindingElement.innerHTML = `
        <input type="text" id="inputRicercaUtenti" placeholder="⌕ Cerca utente">
        <button type="button" id="buttonRicercaUtenti">⌕</button>
        `;

        document.getElementById("buttonRicercaUtenti").onclick = () => {
            const appliedFilter = document.getElementById("inputRicercaUtenti").value.trim();
            pubsub.publish("renderUsers",appliedFilter);
        }
    };
    
    return {
        render: render,
    }
};

//GESTISCE I DATI, E MOSTRA GLI UTENTI DA AGGIUNGERE
const createNewChat = (newElement) => {
    //ATTRIBUTI
    const bindingElement = newElement;
    let filter = "";
    let addedUsers = [];

    //PUBSUB
    pubsub.subscribe("renderUsers",(newFilter) => {
        setFilter(newFilter);
        render();
    });

    //METODI

    const setFilter = (newFilter) => filter = newFilter;

    const resetData = () => filter = "";

    const getUsers = () => addedUsers;

    const render = () => {
        const allUsers = presenter.getAllUsers();

        let line = allUsers.map((user) => {
            if (user.username.includes(filter)){
                if(user.id != presenter.getUser().id){
                    return `
                    <div id="divUser_${user.id}" style="background-color:#1e2126; ">
                        <h3>${user.username}</h3>
                    </div>
                `;
                }
               
            }
            
        }).join("");
        bindingElement.innerHTML = line;

        allUsers.forEach((user) => {
            if (user.username.includes(filter)){
                if (user.id != presenter.getUser().id){
                    document.getElementById(`divUser_${user.id}`).onclick = () => {
                        if(!addedUsers.includes(user)){
                            addedUsers.push(user);
                            document.getElementById(`divUser_${user.id}`).style.background = "lightgreen";
                        } else {
                            addedUsers.pop(addedUsers.indexOf(user));
                            document.getElementById(`divUser_${user.id}`).style.background = "#1e2126";
                        }
                }    
                }
                  
            }
        });
    }

    return {
        setFilter: setFilter,
        resetData: resetData,
        render: render,
        getUsers: getUsers
    }
}

const newChatBack = createNewChatBack(document.getElementById("createChatBack"));
const newChatSearch = createNewChatSearch(document.getElementById("createChatSearch"));
const newChatForm = createNewChatForm(document.getElementById("createChatForm"));
export const newChat = createNewChat(document.getElementById("createChatUtenti"));