import type { RequestHandler } from "express";
import type { CidadesResponseDTO } from "../dto";
import { ICidadeService } from "../services/ICidadeService";
import { responderErroController } from "./HttpControllerResponse";
import { ICidadeController } from "./ICidadeController";

export class CidadeController implements ICidadeController {
  constructor(private readonly cidadeService: ICidadeService) {}

  readonly buscarCidades: RequestHandler = async (_requisicao, resposta) => {
    try {
      const cidades = await this.cidadeService.buscarTodasCidades();
      const cidadesDTO: CidadesResponseDTO = cidades.map(
        ({ identificador, nome }) => ({
          id: identificador,
          nome,
        }),
      );

      resposta.status(200).json(cidadesDTO);
    } catch (erro: unknown) {
      responderErroController(erro, resposta);
    }
  };
}
