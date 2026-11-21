import { Router } from "express";
import { CidadeController } from "../controllers";

export default class CidadeRoutes {
  static #instance: CidadeRoutes | null = null;
  readonly #routes: Router = Router();
  readonly #cidadeController: CidadeController;

  public static obterInstancia() {
    if (CidadeRoutes.#instance === null) {
      CidadeRoutes.#instance = new CidadeRoutes();
    }

    return CidadeRoutes.#instance;
  }

  private constructor() {
    this.#cidadeController = new CidadeController();
    this.definirRotas();
  }

  private definirRotas(): void {
    // GET /cidades - Buscar todas as cidades
    this.#routes.get("/", this.#cidadeController.buscarCidades);
  }

  public getRoutes(): Router {
    return this.#routes;
  }
}
