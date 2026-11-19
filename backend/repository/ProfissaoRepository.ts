import { ILike, type Repository } from "typeorm";
import { Profissao } from "../entities/Profissao";
import { IProfissaoRepository } from "./IProfissaoRepository";

export class ProfissaoRepository implements IProfissaoRepository {
  constructor(private readonly repository: Repository<Profissao>) {}

  buscarTodos(): Promise<Profissao[]> {
    return this.repository.find();
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
}
