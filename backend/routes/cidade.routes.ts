import { Router } from "express";
import { CidadeController } from "../controllers";

export default class CidadeRoutes {
  static #instance: CidadeRoutes | null = null;
  readonly #routes: Router = Router();
  readonly #cidadeController: CidadeController;

  public static obterInstancia(cidadeController: CidadeController) {
    if (CidadeRoutes.#instance === null) {
      CidadeRoutes.#instance = new CidadeRoutes(cidadeController);
    }

    return CidadeRoutes.#instance;
  }

  private constructor(cidadeController: CidadeController) {
    this.#cidadeController = cidadeController;
    this.definirRotas();
  }

  private definirRotas(): void {
    // GET /cidades - Buscar todas as cidades
    this.#routes.get("/buscarTodos", this.#cidadeController.buscarCidades);
  }

  public getRoutes(): Router {
    return this.#routes;
  }
}
