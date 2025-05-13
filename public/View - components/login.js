const createLogin = () => { 
    let isLogged = false;
    let bindingElement = null;
    let tempUser = {
        username: null,
        password: null,
        email: null,
        picture: null,
        public_key: "prova",
        private_key: "prova"
    };

    let registerState = [false,false,false];

    return {
        setUsername: (username) => {
            tempUser.username = username;
        },
        setPassword: (password) => {
            tempUser.password = password;
        },
        setEmail: (email) => {
            tempUser.email = email;
        },
        setPicture: (picture) => {
            tempUser.picture = picture;
        },
        getUserData: () => {
            return tempUser;
        },
        // Metodo per confermare la login
        confirmLogin: function () {
            isLogged = true;
        },
        // Metodo per verificare lo stato di login
        checkIsLogged: function () {
            return isLogged;
        },
        // Ritorina a che stato della registrazione e' (per il navigator)
        getRegisterStatus: () => {
            return registerState;
        },
    };
};


export const loginComp = createLogin();