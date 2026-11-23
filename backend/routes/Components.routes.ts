import { Router } from "express";
import HealthRoutes from "./health.routes";
import CategoriaRoutes from "./categoria.routes";
import CidadeRoutes from "./cidade.routes";
import ProfissaoRoutes from "./profissao.routes";
import UsuarioRoutes from "./usuario.routes";
import { instanceCategoriaProfissionalController, instanceCidadeController, instanceProfissaoController, instanceUsuarioController} from "../instances/UsuarioInstance";

const healthRoutes 
        : Router 
            = HealthRoutes
                .obterInstancia()
                .getRoutes();

const categoriaRoutes 
        : Router    
            = CategoriaRoutes   
                .obterInstancia(instanceCategoriaProfissionalController)
                .getRoutes();

const cidadeRoutes 
        : Router    
            = CidadeRoutes
                .obterInstancia(instanceCidadeController)
                .getRoutes();

const profissaoRoutes
        : Router
            = ProfissaoRoutes
                .obterInstancia(instanceProfissaoController)
                .getRoutes();


const usuarioRoutes
        : Router
            = UsuarioRoutes
                .obterInstancia(instanceUsuarioController)
                .getRoutes();

export {
    healthRoutes,
    categoriaRoutes,
    cidadeRoutes,
    profissaoRoutes,
    usuarioRoutes
}                    