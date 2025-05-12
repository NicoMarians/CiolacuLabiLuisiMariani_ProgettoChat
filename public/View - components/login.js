export const createLogin = async (username,password) => {
    
    let isLogged = false;
    let bindingElement = null;

    return {
        //Metodo per impostare l'elemento di binding
        setBingingElement: function (element) {
            bindingElement = element;
        },

        //Metodo per confermare la login
        confirmLogin: async function () {
            try {
                const response = await fetch("/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body : JSON.stringify({username, password}),
                });
                const data = await response.json();

                if (data.resutl === "ok") {
                    isLogged = true;
                    return {
                        succes: true,
                        user: data.user,
                    };
                } else {
                    isLogged = false;
                    return {
                        succes: false,
                        message: data.message || "Credenziali errate",
                    };
                    
                }
            } catch (error) {
                isLogged = false;
                return {
                    succes: false,
                    message: "Errore di rete",
                };
            }
        },
        //Metodo per verificare lo stato di login
        checkIsLogged: function () {
            return isLogged;
        }
    };
};