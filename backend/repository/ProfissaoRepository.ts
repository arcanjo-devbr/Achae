import { ILike, type Repository } from "typeorm";
import { Profissao } from "../entities/Profissao";
import { IProfissaoRepository } from "./IProfissaoRepository";

export class ProfissaoRepository implements IProfissaoRepository {
  constructor(private readonly repository: Repository<Profissao>) {}

  buscarTodos(): Promise<Profissao[]> {
    return this.repository.find();
  }

  buscarPorId(identificador: number): Promise<Profissao | null> {
    return this.repository.findOne({
      where: { identificador },
      relations: { categoriaProfissional: true },
    });
  }

  buscarPorNome(nome: string): Promise<Profissao | null> {
    return this.repository.findOneBy({
      nome: ILike(`%${nome}%`),
    });
  }

  buscarPorCategoriaProfissional(
    identificadorCategoria: number,
  ): Promise<Profissao[]> {
    return this.repository.find({
      where: {
        categoriaProfissional: {
          identificador: identificadorCategoria,
        },
      },
    });
  }

  salvar(profissao: Profissao): Promise<Profissao> {
    return this.repository.save(profissao);
  }
}
