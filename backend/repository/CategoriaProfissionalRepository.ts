import { ILike, type Repository } from "typeorm";
import { CategoriaProfissional } from "../entities/CategoriaProfissional";
import { ICategoriaProfissionalRepository } from "./ICategoriaProfissionalRepository";

export class CategoriaProfissionalRepository
  implements ICategoriaProfissionalRepository
{
  constructor(
    private readonly repository: Repository<CategoriaProfissional>,
  ) {}

  buscarTodos(): Promise<CategoriaProfissional[]> {
    return this.repository.find();
  }

  buscarPorId(identificador: number): Promise<CategoriaProfissional | null> {
    return this.repository.findOneBy({ identificador });
  }

  buscarPorNome(nome: string): Promise<CategoriaProfissional | null> {
    return this.repository.findOneBy({
      nome: ILike(`%${nome}%`),
    });
  }
}
