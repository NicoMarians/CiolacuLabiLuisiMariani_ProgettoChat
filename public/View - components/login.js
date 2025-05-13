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

    return {
        setUsername: (username) => {
            tempUser.username = username;
        },
        getUsername: () => {
            return tempUser.username;
        },
        setPassword: (password) => {
            tempUser.password = password;
        },
        getPassword: () => {
            return tempUser.password;
        },
        setEmail: (email) => {
            tempUser.email = email;
        },
        getEmail: () => {
            return tempUser.email;
        },
        setPicture: (picture) => {
            tempUser.picture = picture;
        },
        getPicture: () => {
            return tempUser.picture;
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
        }
    };
};


export const loginComp = createLogin();