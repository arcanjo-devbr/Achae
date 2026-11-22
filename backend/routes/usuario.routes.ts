import { Router } from "express";
import { UsuarioController } from "../controllers";

export default class UsuarioRoutes {
  static #instance: UsuarioRoutes | null = null;
  readonly #routes: Router = Router();
  readonly #usuarioController : UsuarioController; 
 

  public static obterInstancia(usuarioController : UsuarioController) {
    if (UsuarioRoutes.#instance === null) {
      UsuarioRoutes.#instance = new UsuarioRoutes(usuarioController);
    }

    return UsuarioRoutes.#instance;
  }

  private constructor(usuarioController : UsuarioController) {
    this.#usuarioController = usuarioController;
    this.definirRotas();
  }

  private definirRotas(): void {
    // POST /usuarios - Criar usuário
    this.#routes.post("/criar", this.#usuarioController.criarUsuario);

    // GET /usuarios - Buscar todos os usuários
    this.#routes.get("/buscarTodos", this.#usuarioController.buscarUsuarios);
  }

  public getRoutes(): Router {
    return this.#routes;
  }
}
