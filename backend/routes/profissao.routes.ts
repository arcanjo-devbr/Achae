import { Router } from "express";
import { ProfissaoController } from "../controllers";

export default class ProfissaoRoutes {
  static #instance: ProfissaoRoutes | null = null;
  readonly #routes: Router = Router();
  readonly #profissaoController: ProfissaoController;

  public static obterInstancia() {
    if (ProfissaoRoutes.#instance === null) {
      ProfissaoRoutes.#instance = new ProfissaoRoutes();
    }

    return ProfissaoRoutes.#instance;
  }

  private constructor() {
    this.#profissaoController = new ProfissaoController();
    this.definirRotas();
  }

  private definirRotas(): void {
    // GET /profissoes?categoriaId=id - Buscar profissões por categoria
    this.#routes.get("/", this.#profissaoController.buscarProfissoes);
  }

  public getRoutes(): Router {
    return this.#routes;
  }
}
