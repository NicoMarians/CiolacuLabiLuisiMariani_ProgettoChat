import { pubsub } from "../BL - components/pubsub.js";

export const createNewChat = (newElement) => {
    const bindingElement = newElement;
    let filteredUsers;
    let addedUsers = [];

    return {
        setData: (newData) => {
            filteredUsers = newData;
        },

        resetAddedUsers: () => {
            addedUsers = [];
        },

        render: () => {
            let line = `<div id=creaChatErrorDiv></div>`;
            line = filteredUsers.map((user) => {
                return `<div id="divUser_${user.id}">
                    <h3>${user.username}</h3>
                </div>`
            }).join("");
            line += `Foto chat: <input type="file" id="inputImmagineChat"`;
            line += `<input type="text" id="inputNomeChat" placeholder="Nome Chat">`;
            line += `<button type="button" id="completaCreaChat">Crea chat</button>`;
            bindingElement.innerHTML = line;

            filteredUsers.forEach((user) => {
                document.getElementById(`divUser_${user.id}`).onclick = () => {
                    addedUsers.push(user);
                    document.getElementById(`divUser_${user.id}`).style.background = "light-green";
                }
            });

            document.getElementById("completaCreaChat").onclick = async () => {
                if(addedUsers.length > 0){
                    const nomeChat = document.getElementById("inputNomeChat").value;
                    const immagineChat = document.getElementById("inputImmagineChat").value;
                    if (nomeChat){
                        const chatId = await pubsub.publish("createNewChat",{"nome":nomeChat,"immagine":immagineChat});
                        addedUsers.forEach(async (user) => {
                            await pubsub.publish("joinChat",user.id,chatId);
                        });
                    } else {
                        document.getElementById("creaChatErrorDiv").innerHTML = "Inserire un nome della chat valido";
                    }
                } else {
                    document.getElementById("creaChatErrorDiv").innerHTML = "Aggiungere almeno una persona";
                }
                
                
            }
        }
    }
}