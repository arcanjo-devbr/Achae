import { Router } from "express";
import { UsuarioController } from "../controllers";

export default class UsuarioRoutes {
  static #instance: UsuarioRoutes | null = null;
  readonly #routes: Router = Router();
  readonly #usuarioController: UsuarioController;

  public static obterInstancia() {
    if (UsuarioRoutes.#instance === null) {
      UsuarioRoutes.#instance = new UsuarioRoutes();
    }

    return UsuarioRoutes.#instance;
  }

  private constructor() {
    this.#usuarioController = new UsuarioController();
    this.definirRotas();
  }

  private definirRotas(): void {
    // POST /usuarios - Criar usuário
    this.#routes.post("/", this.#usuarioController.criarUsuario);

    // GET /usuarios - Buscar todos os usuários
    this.#routes.get("/", this.#usuarioController.buscarUsuarios);
  }

  public getRoutes(): Router {
    return this.#routes;
  }
}
