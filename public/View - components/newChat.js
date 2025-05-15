import { pubsub } from "../BL - components/pubsub.js";

const createNewChat = (newElement) => {
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
            let line = filteredUsers.map((user) => {
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

            document.getElementById("completaCreaChat").onclick = () => {
                pubsub.createNewChat()
            }
        }
    }
}