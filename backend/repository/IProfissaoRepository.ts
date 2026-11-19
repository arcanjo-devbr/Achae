import { Profissao } from "../entities/Profissao";

export interface IProfissaoRepository {
  buscarTodos(): Promise<Profissao[]>;
  buscarPorNome(nome: string): Promise<Profissao | null>;
  buscarPorCategoriaProfissional(
    identificadorCategoria: number,
  ): Promise<Profissao[]>;
}
