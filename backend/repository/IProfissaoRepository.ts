import { Profissao } from "../entities/Profissao";

export interface IProfissaoRepository {
  buscarTodos(): Promise<Profissao[]>;
  buscarPorId(identificador: number): Promise<Profissao | null>;
  buscarPorNome(nome: string): Promise<Profissao | null>;
  buscarPorCategoriaProfissional(
    identificadorCategoria: number,
  ): Promise<Profissao[]>;
  salvar(profissao: Profissao): Promise<Profissao>;
}
