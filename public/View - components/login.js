export const createLogin = async (username,password) => {
    
    let isLogged = false;
    let bindingElement = null;

    return {
        //Metodo per impostare l'elemento di binding
        setBingingElement: function (element) {
            bindingElement = element;
        }
    }
}