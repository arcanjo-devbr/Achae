import { UsuarioRequestDTO, UsuarioResponseDTO } from "../dto";
import { CategoriaProfissional, Profissao} from "../entities";
import { ConflictError, HttpError } from "../exceptions/HttpError";
import { CategoriaProfissionalMapper } from "../mapper/CategoriaProfissionalMapper";
import { ProfissaoMapper } from "../mapper/ProfissaoMapper";
import { UsuarioMapper } from "../mapper/UsuarioMapper";
import {
  ICategoriaProfissionalRepository,
  ICidadeRepository,
  IProfissaoRepository,
  IUsuarioRepository,
} from "../repository";
import { IUsuarioService } from "./IUsuarioService";
import { IUsuarioTrabalhaService } from "./IUsuarioTrabalhaService";
import type { UsuarioFiltros } from "../repository/IUsuarioRepository";



export class UsuarioServiceImpl implements IUsuarioService {
  constructor(
    private readonly usuarioRepository: IUsuarioRepository,
    private readonly cidadeRepository: ICidadeRepository,
    private readonly categoriaRepository: ICategoriaProfissionalRepository,
    private readonly profissaoRepository: IProfissaoRepository,
    private readonly usuarioTrabalhaService: IUsuarioTrabalhaService,
    private readonly usuarioMapper: UsuarioMapper,
    private readonly categoriaProfissional: CategoriaProfissionalMapper,
    private readonly profissaoMapper : ProfissaoMapper
  ) {}

  async criarUsuario(
    usuarioRequestDTO: UsuarioRequestDTO,
  ): Promise<UsuarioResponseDTO> {
    const usuarioExistente = await this.usuarioRepository.buscarPorNome(
      usuarioRequestDTO.nome,
    );
    if (usuarioExistente) {
      throw new ConflictError("Profissional já cadastrado.");
    }

    const cidade = await this.cidadeRepository.buscarPorId(
      usuarioRequestDTO.cidade,
    );
    if (!cidade) {
      throw new HttpError(404, "Cidade não encontrada.");
    }

    const trabalhosResolvidos = await Promise.all(
      usuarioRequestDTO.trabalhos.map(async (trabalho) => {
        const [categoria, profissao] = await Promise.all([
          this.categoriaRepository.buscarPorNome(trabalho.categoria),
          this.profissaoRepository.buscarPorNome(trabalho.profissao),
        ]);

        if (!categoria) {
          throw new HttpError(
            400,
            `Categoria ${trabalho.categoria} não encontrada.`,
          );
        }
        if (!profissao) {
          throw new HttpError(
            400,
            `Profissão ${trabalho.profissao} não encontrada.`,
          );
        }
        if (
          profissao.categoriaProfissional.identificador !==
          categoria.identificador
        ) {
          throw new HttpError(
            400,
            `A profissão ${trabalho.profissao} não pertence à categoria ${trabalho.categoria}.`,
          );
        }

        return { trabalho, profissao };
      }),
    );

    const entidadeUsuario = this.usuarioMapper.toEntity({
      request: usuarioRequestDTO,
      cidade,
    });
    const usuarioSalvo = await this.usuarioRepository.salvar(entidadeUsuario);

    await Promise.all(
      trabalhosResolvidos.map(({ trabalho, profissao }) =>
        this.usuarioTrabalhaService.relacionarProfissaoUsuario({
          usuario: usuarioSalvo,
          profissao,
          status: trabalho.status,
          descricao: trabalho.descricao,
        }),
      ),
    );

    const usuarioCompleto =
      await this.usuarioRepository.buscarPorIdComRelacoes(
        usuarioSalvo.identificador,
      );
      
    if (!usuarioCompleto) {
      throw new Error("O usuário salvo não foi encontrado para montar a resposta.");
    }

    return this.usuarioMapper.toDTOResponse(usuarioCompleto);
  }

  async buscarUsuario(): Promise<UsuarioResponseDTO[]> {
    const usuarios = await this.usuarioRepository.buscarTodosComRelacoes();
    return usuarios.map((usuario) => this.usuarioMapper.toDTOResponse(usuario));
  }

  async buscarUsuarioComFiltros(
    filtros: UsuarioFiltros,
  ): Promise<UsuarioResponseDTO[]> {
    const usuarios = await this.usuarioRepository.buscarComFiltros(filtros);
    return usuarios.map((usuario) => this.usuarioMapper.toDTOResponse(usuario));
  }

  async buscarUsuarioPorId(
    id: string,
  ): Promise<UsuarioResponseDTO | null> {
    const usuario =
      await this.usuarioRepository.buscarPorIdComRelacoes(id);
    return usuario ? this.usuarioMapper.toDTOResponse(usuario) : null;
  }

  async editarUsuario(
    id: string,
    usuarioRequestDTO: UsuarioRequestDTO,
  ): Promise<UsuarioResponseDTO> {
    const usuarioExistente =
      await this.usuarioRepository.buscarPorIdComRelacoes(id);
    if (!usuarioExistente) {
      throw new HttpError(404, "Profissional não encontrado.");
    }

    const usuarioComMesmoNome =
      await this.usuarioRepository.buscarPorNome(usuarioRequestDTO.nome);
    if (
      usuarioComMesmoNome &&
      usuarioComMesmoNome.identificador !== usuarioExistente.identificador
    ) {
      throw new ConflictError("Profissional já cadastrado.");
    }

    const cidade = await this.cidadeRepository.buscarPorId(
      usuarioRequestDTO.cidade,
    );
    if (!cidade) {
      throw new HttpError(404, "Cidade não encontrada.");
    }

    const trabalhosResolvidos = await Promise.all(
      usuarioRequestDTO.trabalhos.map(async (trabalho) => {
        const [categoria, profissao] = await Promise.all([
          this.categoriaRepository.buscarPorNome(trabalho.categoria),
          this.profissaoRepository.buscarPorNome(trabalho.profissao),
        ]);

        if (!categoria) {
          throw new HttpError(
            400,
            `Categoria ${trabalho.categoria} não encontrada.`,
          );
        }
        if (!profissao) {
          throw new HttpError(
            400,
            `Profissão ${trabalho.profissao} não encontrada.`,
          );
        }
        if (
          !profissao.categoriaProfissional ||
          profissao.categoriaProfissional.identificador !==
            categoria.identificador
        ) {
          throw new HttpError(
            400,
            `A profissão ${trabalho.profissao} não pertence à categoria ${trabalho.categoria}.`,
          );
        }

        return { trabalho, profissao };
      }),
    );

    usuarioExistente.nome = usuarioRequestDTO.nome;
    usuarioExistente.telefone = usuarioRequestDTO.telefone;
    usuarioExistente.cidade = cidade;
    const usuarioSalvo =
      await this.usuarioRepository.salvar(usuarioExistente);

    await this.usuarioTrabalhaService.substituirProfissoesUsuario(
      usuarioSalvo,
      trabalhosResolvidos.map(({ trabalho, profissao }) => ({
        usuario: usuarioSalvo,
        profissao,
        status: trabalho.status,
        descricao: trabalho.descricao,
      })),
    );

    const usuarioCompleto =
      await this.usuarioRepository.buscarPorIdComRelacoes(
        usuarioSalvo.identificador,
      );
    if (!usuarioCompleto) {
      throw new Error("O usuário editado não foi encontrado.");
    }

    return this.usuarioMapper.toDTOResponse(usuarioCompleto);
  }

  async excluirUsuario(id: string): Promise<void> {
    const usuario =
      await this.usuarioRepository.buscarPorIdComRelacoes(id);
    if (!usuario) {
      throw new HttpError(404, "Profissional não encontrado.");
    }

    await this.usuarioTrabalhaService.excluirProfissoesUsuario(usuario);
    await this.usuarioRepository.excluirPorId(id);
  }
}