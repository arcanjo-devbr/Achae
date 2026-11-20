import { Router } from "express";

export default class ProfissaoRoutes {
  static #instance: ProfissaoRoutes | null = null;
  readonly #routes: Router = Router();

  public static obterInstancia() {
    if (ProfissaoRoutes.#instance === null) {
      ProfissaoRoutes.#instance = new ProfissaoRoutes();
    }

    return ProfissaoRoutes.#instance;
  }

  private constructor() {
    this.definirRotas();
  }

  private definirRotas(): void {
    // GET /profissoes - Buscar todas as profissões (opcional, se categoria não for informada)
    // GET /profissoes?categoria=id - Buscar profissões por categoria
    // TODO: Implementar quando ProfissaoController estiver disponível
    // this.#routes.get("/", (req, res, next) => {
    //   const categoriaId = req.query.categoria;
    //   if (categoriaId) {
    //     profissaoController.buscarPorCategoria(req, res, categoriaId);
    //   } else {
    //     profissaoController.buscarTodasProfissoes(req, res);
    //   }
    // });

    this.#routes.get("/", (req, res, next) => {
      // Placeholder - será implementado com ProfissaoController
      res.status(501).json({
        mensagem: "Endpoint não implementado. Aguardando implementação do ProfissaoController.",
      });
    });
  }

  public getRoutes(): Router {
    return this.#routes;
  }
}
