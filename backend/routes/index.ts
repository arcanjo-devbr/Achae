import {Router} from "express";
import { healthRoutes } from "./Components.routes";
import UsuarioRoutes from "./usuario.routes";
import CidadeRoutes from "./cidade.routes";
import ProfissaoRoutes from "./profissao.routes";
import CategoriaRoutes from "./categoria.routes";


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
        this.#routes.use("/usuarios", UsuarioRoutes.obterInstancia().getRoutes());
        this.#routes.use("/cidades", CidadeRoutes.obterInstancia().getRoutes());
        this.#routes.use("/profissoes", ProfissaoRoutes.obterInstancia().getRoutes());
        this.#routes.use("/categorias-profissionais", CategoriaRoutes.obterInstancia().getRoutes());
    }

      public getRoutes() : Router {
        return this.#routes;
    }

}