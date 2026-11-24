import { ILike, type Repository } from "typeorm";
import { Usuario } from "../entities/Usuario";
import { IUsuarioRepository, UsuarioFiltros } from "./IUsuarioRepository";

export class UsuarioRepository implements IUsuarioRepository {
  constructor(private readonly repository: Repository<Usuario>) {}

  buscarTodos(): Promise<Usuario[]> {
    return this.repository.find();
  }

  buscarTodosComRelacoes(): Promise<Usuario[]> {
    return this.repository.find({
      relations: {
        cidade: true,
        vinculosProfissionais: {
          profissao: { categoriaProfissional: true },
        },
      },
    });
  }

  async buscarComFiltros(filtros: UsuarioFiltros): Promise<Usuario[]> {
    const consulta = this.repository
      .createQueryBuilder("usuario")
      .leftJoinAndSelect("usuario.cidade", "cidade")
      .leftJoinAndSelect("usuario.vinculosProfissionais", "vinculo")
      .leftJoinAndSelect("vinculo.profissao", "profissao")
      .leftJoinAndSelect("profissao.categoriaProfissional", "categoria");

    const busca = filtros.nome?.trim();
    const categoria = filtros.categoria;
    const profissao = filtros.profissao?.trim();

    if (busca) {
      consulta.andWhere(
        `(
          usuario.nome ILIKE :busca
          OR categoria.nome ILIKE :busca
          OR profissao.nome ILIKE :busca
        )`,
        { busca: `%${busca}%` },
      );
    }

    if (categoria) {
      const categorias = Array.isArray(categoria) ? categoria : [categoria];
      const categoriasValidas = categorias
        .map((item) => item.trim())
        .filter(Boolean);

      if (categoriasValidas.length > 0) {
        consulta.andWhere(
          new Array(categoriasValidas.length)
            .fill(null)
            .map((_, indice) =>
              `categoria.nome ILIKE :categoria${indice}`,
            )
            .join(" OR "),
          Object.fromEntries(
            categoriasValidas.map((item, indice) => [
              `categoria${indice}`,
              `%${item}%`,
            ]),
          ),
        );
      }
    }

    if (profissao) {
      consulta.andWhere("profissao.nome ILIKE :profissao", {
        profissao: `%${profissao}%`,
      });
    }

    return consulta.distinct(true).getMany();
  }

  buscarPorId(identificador: string): Promise<Usuario | null> {
    return this.repository.findOneBy({ identificador });
  }

  buscarPorIdComRelacoes(identificador: string): Promise<Usuario | null> {
    return this.repository.findOne({
      where: { identificador },
      relations: {
        cidade: true,
        vinculosProfissionais: {
          profissao: { categoriaProfissional: true },
        },
      },
    });
  }

  buscarPorNome(nome: string): Promise<Usuario | null> {
    return this.repository.findOne({
      where: { nome: ILike(`%${nome}%`) },
    });
  }

  salvar(usuario: Usuario): Promise<Usuario> {
    return this.repository.save(usuario);
  }

  async excluirPorId(identificador: string): Promise<void> {
    await this.repository.delete(identificador);
  }
}
