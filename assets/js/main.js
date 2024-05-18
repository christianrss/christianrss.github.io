class Site {

    constructor() {
        this.header();
        this.main();
    }

    header() {
    }

    main() {
        /* 
            Adiciona margem automática ao topo do conteúdo principal.
            Para que o conteúdo da página não fique sobreposto pelo topo fixado.
        */
        let main = document.getElementById("conteudo");
        main.style.marginTop = document.getElementById("topo").offsetHeight + "px";
    }
}

/** Utilizei OOP porque é muito fácil o código ficar bagunçado em JavaScript */
let site = new Site();

window.addEventListener("load", (event) => {

});
