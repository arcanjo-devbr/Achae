import { CategoriaProfissional } from "../entities/CategoriaProfissional";

export interface ICategoriaProfissionalRepository {
  buscarTodos(): Promise<CategoriaProfissional[]>;
  buscarPorId(identificador: number): Promise<CategoriaProfissional | null>;
  buscarPorNome(nome: string): Promise<CategoriaProfissional | null>;
}
