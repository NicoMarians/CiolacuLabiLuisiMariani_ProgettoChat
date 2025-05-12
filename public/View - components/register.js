export const createRegister = (parentElement) => {
    return { 
        render:() =>  {

            parentElement.innerHTML = 
                `<h1>Registrati su Flock</h1>`+
                `<form id="register_form">
                    <h3> Inserisci la tua mail </h3>
                    <input id="email" type="email" placeholder="email" required>

                    <button type="button" id="invia_email_password" class="">-></button>
                    <p>Hai un account? <a href="#home">Accedi</a></p>
                    <p id="outputformreg"></p>
                </form>`

            document.querySelector("#invia_email_password").onclick = async() => {
                const email = document.querySelector("#email").value;
                const outputform = document.querySelector("#outputformreg")
                if (email === "" ) {
                    outputform.innerHTML="Inserisci un'email";
                } else {
                    try {
                        const data = await register.register(Nome,Email)
                        window.location.href = "#input_pw";
                    } catch (error) {
                        console.error("Errore durante la registrazione:", error);
                    }
                }
            }
        }
    }
}