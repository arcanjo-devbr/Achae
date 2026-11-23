import type { RequestHandler } from "express";
import type { UsuarioRequestDTO } from "../dto";
import { IUsuarioService } from "../services/IUsuarioService";
import { responderErroController } from "./HttpControllerResponse";
import { IUsuarioController } from "./IUsuarioController";
import { usuarioRequestSchema } from "./UsuarioRequestSchema";

export class UsuarioController implements IUsuarioController {
  constructor(private readonly usuarioService: IUsuarioService) {}

  readonly criarUsuario: RequestHandler = async (requisicao, resposta) => {
    const resultadoValidacao = usuarioRequestSchema.safeParse(
      requisicao.body,
    );

    if (!resultadoValidacao.success) {
      resposta.status(400).json({
        mensagem: "Dados de cadastro inválidos.",
        erros: resultadoValidacao.error.issues.map((erro) => ({
          campo: erro.path.join("."),
          mensagem: erro.message,
        })),
      });
      return;
    }

    try {
      const dadosCadastro: UsuarioRequestDTO = resultadoValidacao.data;
      const usuario = await this.usuarioService.criarUsuario(dadosCadastro);
      resposta.status(201).json(usuario);
    } catch (erro: unknown) {
      responderErroController(erro, resposta);
    }
  };

  readonly buscarUsuarios: RequestHandler = async (_requisicao, resposta) => {
    try {
      const usuarios = await this.usuarioService.buscarUsuario();
      resposta.status(200).json(usuarios);
    } catch (erro: unknown) {
      responderErroController(erro, resposta);
    }
  };
}
