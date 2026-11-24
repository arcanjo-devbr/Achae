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

  readonly buscarUsuarios: RequestHandler = async (requisicao, resposta) => {
    const obterTexto = (valor: unknown): string | undefined =>
      typeof valor === "string" && valor.trim()
        ? valor.trim()
        : undefined;

    const nome =
      obterTexto(requisicao.query.nome) ??
      obterTexto(requisicao.query.busca);
    const categoria =
      obterTexto(requisicao.query.categoria) ??
      obterTexto(requisicao.query.categoriaSelecionada);
    const categoriasQuery = requisicao.query.categorias;
    const categorias =
      Array.isArray(categoriasQuery)
        ? categoriasQuery
            .filter((item): item is string => typeof item === "string")
            .map((item) => item.trim())
            .filter(Boolean)
        : obterTexto(categoriasQuery)
          ? obterTexto(categoriasQuery)?.split(",").map((item) => item.trim()).filter(Boolean)
          : undefined;
    const categoriasSelecionadas =
      categorias && categorias.length > 0 ? categorias : categoria ? [categoria] : undefined;
    const profissao =
      obterTexto(requisicao.query.profissao);

    try {
      const usuarios =
        nome || categoriasSelecionadas || profissao
          ? await (
              this.usuarioService.buscarUsuarioComFiltros?.({
                nome,
                categoria: categoriasSelecionadas,
                profissao,
              }) ?? this.usuarioService.buscarUsuario()
            )
          : await this.usuarioService.buscarUsuario();
      resposta.status(200).json(usuarios);
    } catch (erro: unknown) {
      responderErroController(erro, resposta);
    }
  };

  readonly buscarUsuarioPorId: RequestHandler = async (
    requisicao,
    resposta,
  ) => {
    const id = requisicao.params.id;

    if (typeof id !== "string" || !id.trim()) {
      resposta.status(400).json({
        mensagem: "O identificador do profissional é obrigatório.",
      });
      return;
    }

    try {
      const usuario =
        await this.usuarioService.buscarUsuarioPorId?.(id.trim());

      if (!usuario) {
        resposta.status(404).json({
          mensagem: "Profissional não encontrado.",
        });
        return;
      }

      resposta.status(200).json(usuario);
    } catch (erro: unknown) {
      responderErroController(erro, resposta);
    }
  };

  readonly editarUsuario: RequestHandler = async (requisicao, resposta) => {
    const resultadoValidacao = usuarioRequestSchema.safeParse(
      requisicao.body,
    );

    if (!resultadoValidacao.success) {
      resposta.status(400).json({
        mensagem: "Dados de edição inválidos.",
        erros: resultadoValidacao.error.issues.map((erro) => ({
          campo: erro.path.join("."),
          mensagem: erro.message,
        })),
      });
      return;
    }

    const id = requisicao.params.id;
    if (typeof id !== "string" || !id.trim()) {
      resposta.status(400).json({
        mensagem: "O identificador do profissional é obrigatório.",
      });
      return;
    }

    try {
      const usuario =
        await this.usuarioService.editarUsuario?.(
          id.trim(),
          resultadoValidacao.data,
        );

      if (!usuario) {
        resposta.status(500).json({
          mensagem: "Não foi possível editar o profissional.",
        });
        return;
      }

      resposta.status(200).json(usuario);
    } catch (erro: unknown) {
      responderErroController(erro, resposta);
    }
  };

  readonly excluirUsuario: RequestHandler = async (requisicao, resposta) => {
    const id = requisicao.params.id;

    if (typeof id !== "string" || !id.trim()) {
      resposta.status(400).json({
        mensagem: "O identificador do profissional é obrigatório.",
      });
      return;
    }

    try {
      await this.usuarioService.excluirUsuario?.(id.trim());
      resposta.status(204).send();
    } catch (erro: unknown) {
      responderErroController(erro, resposta);
    }
  };
}
