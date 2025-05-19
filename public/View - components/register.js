import { pubsub } from "../BL - components/pubsub.js"
import { presenter } from "../BL - components/presenter.js"
import { middleware } from "../BL - components/middleware.js"


//BOTTONE BACK
document.querySelectorAll(".buttonToStarterPage").onclick = () => {
    document.getElementById("inputEmail").value = "";
    document.getElementById("password_input_register").value = "";
    document.getElementById("username_input").value = "";
    document.getElementById("image_input").value = "";
    document.getElementById("password_login_input").value = "";
    document.getElementById("username_login_input").value = "";

    window.location.href = "#starterPage";
}

document.getElementById("register_btn").onclick = async () => {    
    mailRegister.render();
    window.location.href = "#registerMailPage";
}


const createMailRegister = (newElement) => {
    const bindingElement = newElement

    const render = () =>  {
        bindingElement.innerHTML =`
            <h3 class="form-title mb-2">Inserisci la tua email</h3>
            <div class="input-group px-4 mt-4 input-register-width mb-10" >
                <input type="text" id="inputEmail" class="form-control" placeholder="Inserisci email">
                <button type="button" id="invia_email_password" class="btn btn-outline-info">➤</button>
            </div> 
        `;

        document.getElementById("invia_email_password").onclick = async () => {
            const email = document.getElementById("inputEmail").value;

            if (email.trim() != "" ) {
                try {
                    const response = await middleware.sendMail(email);
                    if (response.result){
                        passwordRegister.render();
                        register.setEmail(email);
                        window.location.href = "#registerPasswordPage";
                    }
                } catch (error) {console.error("Errore durante la registrazione:", error);}
            } else {
                outputform.innerHTML="Inserisci un'email";
            }
        }
    };

    return {
        render: render
    }
}

const createPasswordRegister = (newElement) => {
    const bindingElement = newElement

    const render = () =>  {
        bindingElement.innerHTML =`
            <h3 id="messErrorIfNotPsw">Inserisci la password che ti è arrivata sulla mail inserita</h3>
            <div class="input-group px-4 mt-4 input-register-width">
                <input type="text" id="password_input_register" class="form-control" placeholder="Inserisci password">
                <button type="button" id="check_password" class="btn btn-outline-info">➤</button>
            </div>
        `;

        document.getElementById("check_password").onclick = async () => {
            const password = presenter.hashPassword(document.getElementById("password_input_register").value);
            document.getElementById("password_input_register").value = "";

            const response = await middleware.checkPassword(password);

            if(response.result) {
                register.setPassword(password);
                usernameRegister.render();
                window.location.href = "#registerUsernamePage";
                
            } else document.getElementById("messErrorIfNotPsw").innerText = "Password errata";
        }
    };

    return {
        render: render
    }
}

const createUsernameRegister = (newElement) => {
    const bindingElement = newElement

    const render = () =>  {
        bindingElement.innerHTML =`
            <h3>Scegli l'username</h3>
            <div class="input-group px-4 mt-4 input-register-width">
                <input type="text" id="username_input" class="form-control" placeholder="inserisci username">
                <button type="button" id="add_username" class="btn btn-outline-info">➤</button>
            </div>
        `;

        document.getElementById("add_username").onclick = async () => {
            const username = document.getElementById("username_input").value;
            //const image = document.getElementById("image_register").value;
            const image = null;

            if (username.trim() != "" ) {
                try {
                    document.getElementById("username_input").value = "";
                    //document.getElementById("image_input").value = "";
                    register.setData(username,image);
                    register.createUser();
                } catch (error) {console.error("Errore durante la registrazione:", error);}
            } else {
                outputform.innerHTML="Inserisci un'email";
            }
        }
    };

    return {
        render: render
    }
}


const createRegister = () => {

    let email;
    let username;
    let password;
    let picture;

    const createUser = async () => {
        const userData = {
            "email":email,
            "username":username,
            "picture":picture,
            "password":password,
            "public_key":"prova",
            "private_key":"prova",
        }
        const user = await middleware.createUser(userData);
        presenter.setUser(user);
        pubsub.publish("ready-user-presenter");

        window.location.href = "#homePage";
    }

    const setEmail = (newEmail) => {
        email = newEmail;
    }

    const setPassword = (newPassword) => {
        password = newPassword;
    }

    const setData = (newUsername,newImage) => {
        username = newUsername;
        picture = newImage
    }

    const resetData = () => {
        email = "";
        username = "";
        password = "";
        picture = "";
    }
    
    return { 
        createUser: createUser,
        setEmail: setEmail,
        setPassword: setPassword,
        setData: setData,
        resetData: resetData
    }
}


export const mailRegister = createMailRegister(document.getElementById("registerMailForm"));
const passwordRegister = createPasswordRegister(document.getElementById("registerPasswordForm"));
const usernameRegister = createUsernameRegister(document.getElementById("registerUsernameForm"));
const register = createRegister();