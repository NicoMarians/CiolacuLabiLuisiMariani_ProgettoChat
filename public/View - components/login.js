import { pubsub } from "../BL - components/pubsub.js";
import { presenter } from "../BL - components/presenter.js";
import { middleware } from "../BL - components/middleware.js";

document.getElementById("buttonLogout").onclick = async () => {
    const user = presenter.getUser();
    createCookie(user.username,-1000);
    presenter.resetUser();

    window.location.href = "#starterPage";
}

//controllo cookie
document.getElementById("login_btn").onclick = async () => {
    if(document.cookie != "" && document.cookie != null && document.cookie != undefined){
        let cookies = document.cookie.split(";");
        let username = "";
        let found = false;
        
        cookies.forEach((cookie) => {
            if(cookie.split("=")[0].replaceAll(" ", "") == "username"){
                username = cookie.split("=")[1];
                found = true;
            }
        });

        if (found){
            const result = await middleware.getUserByName(username);
            const user = result.data[0];
            document.getElementById("username_homepage").innerHTML = user.username;
            presenter.setUser(user); //<- + importante da avere
            pubsub.publish("ready-user-presenter")

            window.location.href = "#homePage";
        } else {
            loginComp.render();
            window.location.href = "#loginPage"
        };
        
    } else {
        loginComp.render();
        window.location.href = "#loginPage"
    };
}

const createLogin = (newElement) => { 
    const bindingElement = newElement;
    let isLogged = false;

    const render = () => {
        bindingElement.innerHTML = `
            <h3 class="form-title mb-2">Entra nel tuo account</h3>
            <div id="errorDiv" ></div>
            <div class="input-container mb-2">
                <input type="text" id="username_login_input" placeholder="Inserisci username" class="form-control mb-2">
                <span>
                </span>
            </div>
            <div class="input-container">
                <input type="text" id="password_login_input" placeholder="Enterisci Password" class="form-control mb-3">
            </div>
            <button type="button" id="login_btn_login_space" class="btn btn-outline-info mb-2">Entra</button>
            <p class="signup-link">
                Non hai un account?
                <a class="p-1 rounded"  href="#registerMailPage">registrati</a>
            </p>    
        `;

        document.getElementById("login_btn_login_space").onclick = async () => {
            const username = document.getElementById("username_login_input").value;
            const password = presenter.hashPassword(document.getElementById("password_login_input").value);

            const response = await middleware.login(username,password);
            
            if(response.result){
                presenter.setUser(response.user);
                isLogged = true;
            } else {
                document.getElementById("errorDiv").innerHTML = response.message;
            }
            document.getElementById("username_login_input") = "";
            document.getElementById("password_login_input") = "";
        }
    };

    const checkIsLogged = () => isLogged;

    return {
        render: render,
        checkIsLogged: checkIsLogged
    };
};


export const loginComp = createLogin(document.getElementById("loginForm"));