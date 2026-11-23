import { Cidade } from "../entities/Cidade";

export interface ICidadeRepository {
  buscarTodos(): Promise<Cidade[]>;
  buscarPorId(identificador: number): Promise<Cidade | null>;
  buscarPorNome(nome: string): Promise<Cidade | null>;
}
