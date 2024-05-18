class Site {

    constructor() {
        this.header();
        this.main();
    }

    header() {
        //let header = document.getElementById("topo");
        //header.style.marginTop = "20px";
    }

    main() {
        let main = document.getElementById("conteudo");
        main.style.paddingTop = document.getElementById("topo").offsetHeight + "px";
    }
}

let site = new Site();

window.addEventListener("load", (event) => {
    /** Utilizei OOP porque é muito fácil o código ficar bagunçado em JavaScript */
    

});
