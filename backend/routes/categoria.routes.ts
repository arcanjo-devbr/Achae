import { Router } from "express";

export default class CategoriaRoutes {
  static #instance: CategoriaRoutes | null = null;
  readonly #routes: Router = Router();

  public static obterInstancia() {
    if (CategoriaRoutes.#instance === null) {
      CategoriaRoutes.#instance = new CategoriaRoutes();
    }

    return CategoriaRoutes.#instance;
  }

  private constructor() {
    this.definirRotas();
  }

  private definirRotas(): void {
    // GET /categorias-profissionais - Buscar todas as categorias profissionais
    // TODO: Implementar quando CategoriaProfissionalController estiver disponível
    // this.#routes.get("/", (req, res, next) => {
    //   categoriaController.buscarTodasCategorias(req, res);
    // });

    this.#routes.get("/", (req, res, next) => {
      // Placeholder - será implementado com CategoriaProfissionalController
      res.status(501).json({
        mensagem: "Endpoint não implementado. Aguardando implementação do CategoriaProfissionalController.",
      });
    });
  }

  public getRoutes(): Router {
    return this.#routes;
  }
}
