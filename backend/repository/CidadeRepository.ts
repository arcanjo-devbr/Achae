import { ILike, type Repository } from "typeorm";
import { Cidade } from "../entities/Cidade";
import { ICidadeRepository } from "./ICidadeRepository";

export class CidadeRepository implements ICidadeRepository {
  constructor(private readonly repository: Repository<Cidade>) {}

  buscarTodos(): Promise<Cidade[]> {
    return this.repository.find();
  }

  buscarPorId(identificador: number): Promise<Cidade | null> {
    return this.repository.findOneBy({ identificador });
  }

  buscarPorNome(nome: string): Promise<Cidade | null> {
    return this.repository.findOneBy({
      nome: ILike(`%${nome}%`),
    });
  }
}
