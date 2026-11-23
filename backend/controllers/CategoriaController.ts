import type { RequestHandler } from "express";
import type { CategoriasRespondeDTO } from "../dto";
import { ICategoriaService } from "../services/ICategoriaService";
import { responderErroController } from "./HttpControllerResponse";
import { ICategoriaController } from "./ICategoriaController";

export class CategoriaController implements ICategoriaController {
  constructor(private readonly categoriaService: ICategoriaService) {}

  readonly buscarCategorias: RequestHandler = async (
    _requisicao,
    resposta,
  ) => {
    try {
      const categorias =
        await this.categoriaService.buscarTodasCategorias();
      const categoriasDTO: CategoriasRespondeDTO = categorias.map(
        ({ identificador, nome }) => ({
          id: identificador,
          nome
        }),
      );

      resposta.status(200).json(categoriasDTO);
    } catch (erro: unknown) {
      responderErroController(erro, resposta);
    }
  };
}
