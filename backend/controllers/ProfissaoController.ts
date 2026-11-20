import type { RequestHandler } from "express";
import type { ProfissoesResponseDTO } from "../dto";
import { IProfissaoService } from "../services/IProfissaoService";
import { responderErroController } from "./HttpControllerResponse";
import { IProfissaoController } from "./IProfissaoController";

export class ProfissaoController implements IProfissaoController {
  constructor(private readonly profissaoService: IProfissaoService) {}

  readonly buscarProfissoes: RequestHandler = async (
    requisicao,
    resposta,
  ) => {
    const categoriaParam = requisicao.query.categoriaId;

    if (
      typeof categoriaParam !== "string" ||
      !/^[1-9]\d*$/.test(categoriaParam)
    ) {
      resposta.status(400).json({
        mensagem: "O parâmetro categoriaId deve ser um inteiro positivo.",
      });
      return;
    }

    const identificadorCategoria = Number(categoriaParam);

    if (!Number.isSafeInteger(identificadorCategoria)) {
      resposta.status(400).json({
        mensagem: "O parâmetro categoriaId está fora do intervalo permitido.",
      });
      return;
    }

    try {
      const profissoes = await this.profissaoService.buscarPorCategoria(
        identificadorCategoria,
      );
      const profissoesDTO: ProfissoesResponseDTO[] = profissoes.map(
        ({ identificador, nome, especialidade }) => ({
          id: identificador,
          nome,
          especialidade,
          categoria_profissional: identificadorCategoria,
        }),
      );

      resposta.status(200).json(profissoesDTO);
    } catch (erro: unknown) {
      responderErroController(erro, resposta);
    }
  };
}
