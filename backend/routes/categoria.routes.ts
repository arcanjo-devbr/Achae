import { Router } from "express";
import { CategoriaController } from "../controllers";

export default class CategoriaRoutes {
  static #instance: CategoriaRoutes | null = null;
  readonly #routes: Router = Router();
  readonly #categoriaController: CategoriaController;

  public static obterInstancia() {
    if (CategoriaRoutes.#instance === null) {
      CategoriaRoutes.#instance = new CategoriaRoutes();
    }

    return CategoriaRoutes.#instance;
  }

  private constructor() {
    this.#categoriaController = new CategoriaController();
    this.definirRotas();
  }

  private definirRotas(): void {
    // GET /categorias-profissionais - Buscar todas as categorias profissionais
    this.#routes.get("/", this.#categoriaController.buscarCategorias);
  }

  public getRoutes(): Router {
    return this.#routes;
  }
}
