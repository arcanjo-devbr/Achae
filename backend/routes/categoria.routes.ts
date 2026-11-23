import { Router } from "express";
import { CategoriaController } from "../controllers";

export default class CategoriaRoutes {
  static #instance: CategoriaRoutes | null = null;
  readonly #routes: Router = Router();
  readonly #categoriaController: CategoriaController;

  public static obterInstancia(categoriaController: CategoriaController) {
    if (CategoriaRoutes.#instance === null) {
      CategoriaRoutes.#instance = new CategoriaRoutes(categoriaController);
    }

    return CategoriaRoutes.#instance;
  }

  private constructor(categoriaController: CategoriaController) {
    this.#categoriaController = categoriaController;
    this.definirRotas();
  }

  private definirRotas(): void {
    // GET /categorias-profissionais - Buscar todas as categorias profissionais
    this.#routes.get("/buscarTodos", this.#categoriaController.buscarCategorias);
  }

  public getRoutes(): Router {
    return this.#routes;
  }
}
