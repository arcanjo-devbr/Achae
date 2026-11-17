import {Router} from "express";
import { healthRoutes } from "./Components.routes";


export default class Rotas {

    readonly #routes : Router = Router();
    static #instanciaRotas : Rotas | null = null

    private constructor () {
        this.definirRotas();
    }

    public static obterInstancia () : Rotas {
        if(Rotas.#instanciaRotas === null){
            Rotas.#instanciaRotas = new Rotas();
        }

        return Rotas.#instanciaRotas;
    }

    private definirRotas() : void{
        this.#routes.use("/health", healthRoutes);
    }

      public getRoutes() : Router {
        return this.#routes;
    }

}