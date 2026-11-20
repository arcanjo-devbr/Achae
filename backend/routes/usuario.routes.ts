import { Router } from "express";

export default class UsuarioRoutes {
  static #instance: UsuarioRoutes | null = null;
  readonly #routes: Router = Router();

  public static obterInstancia() {
    if (UsuarioRoutes.#instance === null) {
      UsuarioRoutes.#instance = new UsuarioRoutes();
    }

    return UsuarioRoutes.#instance;
  }

  private constructor() {
    this.definirRotas();
  }

  private definirRotas(): void {
    // POST /usuarios - Criar usuário
    // TODO: Implementar quando UsuarioController estiver disponível
    // this.#routes.post("/", (req, res, next) => {
    //   usuarioController.criarUsuario(req, res);
    // });

    this.#routes.post("/", (req, res, next) => {
      // Placeholder - será implementado com UsuarioController
      res.status(501).json({
        mensagem: "Endpoint não implementado. Aguardando implementação do UsuarioController.",
      });
    });

    // GET /usuarios - Buscar todos os usuários
    // TODO: Implementar quando UsuarioController estiver disponível
    // this.#routes.get("/", (req, res, next) => {
    //   usuarioController.buscarTodosUsuarios(req, res);
    // });

    this.#routes.get("/", (req, res, next) => {
      // Placeholder - será implementado com UsuarioController
      res.status(501).json({
        mensagem: "Endpoint não implementado. Aguardando implementação do UsuarioController.",
      });
    });
  }

  public getRoutes(): Router {
    return this.#routes;
  }
}
