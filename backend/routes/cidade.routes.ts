import { Router } from "express";

export default class CidadeRoutes {
  static #instance: CidadeRoutes | null = null;
  readonly #routes: Router = Router();

  public static obterInstancia() {
    if (CidadeRoutes.#instance === null) {
      CidadeRoutes.#instance = new CidadeRoutes();
    }

    return CidadeRoutes.#instance;
  }

  private constructor() {
    this.definirRotas();
  }

  private definirRotas(): void {
    // GET /cidades - Buscar todas as cidades
    // TODO: Implementar quando CidadeController estiver disponível
    // this.#routes.get("/", (req, res, next) => {
    //   cidadeController.buscarTodasCidades(req, res);
    // });

    this.#routes.get("/", (req, res, next) => {
      // Placeholder - será implementado com CidadeController
      res.status(501).json({
        mensagem: "Endpoint não implementado. Aguardando implementação do CidadeController.",
      });
    });
  }

  public getRoutes(): Router {
    return this.#routes;
  }
}
