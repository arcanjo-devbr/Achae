import express from "express";
import Rotas from "../routes";


export default class App {
    readonly #app = express();
    static #instanciaApp : App | null = null;


    public static obterInstancia() : App {
        if(App.#instanciaApp === null){
            App.#instanciaApp = new App();
        }

        return App.#instanciaApp;
    }

    private constructor (){
        this.definirMiddlewaresGlobais();
        this.definirRotas();
    }


    private definirMiddlewaresGlobais() : void {
        this.#app.use(express.json());

    }

    private definirRotas() : void {
        this.#app.use("/api",
            Rotas.obterInstancia().getRoutes()
        );
    }

    public getApp () : express.Express {
        return this.#app;
    }
    
}