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
        let [categoria, profissao] = await Promise.all([
          this.categoriaRepository.buscarPorNome(trabalho.categoria),
          this.profissaoRepository.buscarPorNome(trabalho.profissao),
        ]);

        if (!categoria) {
            const categoriaProfissional : CategoriaProfissional = this.categoriaProfissional.toEntity({categoria: trabalho.categoria});
            categoria = await this.categoriaRepository.salvar(categoriaProfissional);
        }
        if (!profissao) {
            const profissaoUsuario : Profissao = this.profissaoMapper.toEntity({especialidade: trabalho.profissao});
            profissao = await this.profissaoRepository.salvar(profissaoUsuario);
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
}