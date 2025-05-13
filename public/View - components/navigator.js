import { loginComp } from "./login.js";

const hide = (elements) => {
   elements.forEach((element) => {
      element.classList.add("hidden");
      element.classList.remove("visible");
   });
};

const show = (element) => {
   element.classList.add("visible");
   element.classList.remove("hidden");
};

export const createNavigator = (parentElement) => {
   const pages = Array.from(parentElement.querySelectorAll(".page"));

   const render = () => {
      const pageName = window.location.hash.replace("#", ""); 
      let selected = pages.find((page) => {page.id === pageName});

      if (selected) {
         console.log(selected)

         hide(pages);
         show(selected);
      
      } else {
         console.error(`Pagina con id "${pageName}" non trovata.`);
      }
   };

   window.addEventListener("hashchange", render);

   render();
};