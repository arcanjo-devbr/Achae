import {Router} from "express";
import { categoriaRoutes, cidadeRoutes, healthRoutes, profissaoRoutes, usuarioRoutes } from "./Components.routes";



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

    private definirRotas() : void {
        this.#routes.use("/health", healthRoutes);
        this.#routes.use("/usuarios", usuarioRoutes);
        this.#routes.use("/cidades", cidadeRoutes);
        this.#routes.use("/profissoes", profissaoRoutes);
        this.#routes.use("/categorias-profissionais", categoriaRoutes);
    }

      public getRoutes() : Router {
        return this.#routes;
    }

}