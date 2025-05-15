const hide = (elements) => {
   elements.forEach((element) => {
      element.classList.add("hidden");
      element.classList.remove("visible");
   });
}

const show = (element) => {
   element.classList.add("visible");
   element.classList.remove("hidden");   
}

const makeHidden = (pe) => {
    document.getElementById(pe).classList.add("hidden");
    document.getElementById(pe).classList.remove("visible");
    document.getElementById(pe).style.display = "none";
}

const makeVisible = (pe) => {
    document.getElementById(pe).classList.add("visible");
    document.getElementById(pe).classList.remove("hidden");
    document.getElementById(pe).style.display = "block";
}

export const createNavigator = (parentElement) => {
   const pages = Array.from(parentElement.querySelectorAll(".page"));
   
   const render = () => {
      const url = new URL(document.location.href);
      const pageName = url.hash.replace("#", "");
      const selected = pages.filter((page) => page.id === pageName)[0] || pages[0]

      /*
      pages.forEach((page) => {
         makeHidden(page);
      });
      makeVisible(selected)
      */
      hide(pages);
      show(selected);

   }
   window.addEventListener('popstate', render); 
   render();   
}