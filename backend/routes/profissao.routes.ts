import { Router } from "express";
import { ProfissaoController } from "../controllers";

export default class ProfissaoRoutes {
  static #instance: ProfissaoRoutes | null = null;
  readonly #routes: Router = Router();
  readonly #profissaoController: ProfissaoController;

  public static obterInstancia(profissaoController : ProfissaoController) {
    if (ProfissaoRoutes.#instance === null) {
      ProfissaoRoutes.#instance = new ProfissaoRoutes(profissaoController);
    }

    return ProfissaoRoutes.#instance;
  }

  private constructor(profissaoController : ProfissaoController) {
    this.#profissaoController = profissaoController;
    this.definirRotas();
  }

  private definirRotas(): void {
    // GET /profissoes?categoriaId=id - Buscar profissões por categoria
    this.#routes.get("/buscarPorCategoria", this.#profissaoController.buscarProfissoes);
  }

  public getRoutes(): Router {
    return this.#routes;
  }
}
