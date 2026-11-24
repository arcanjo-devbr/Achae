import { Usuario } from "../entities/Usuario";

export type UsuarioFiltros = Readonly<{
  nome?: string;
  categoria?: string | readonly string[];
  profissao?: string;
}>;

export interface IUsuarioRepository {
  buscarTodos(): Promise<Usuario[]>;
  buscarTodosComRelacoes(): Promise<Usuario[]>;
  buscarComFiltros(filtros: UsuarioFiltros): Promise<Usuario[]>;
  buscarPorId(identificador: string): Promise<Usuario | null>;
  buscarPorIdComRelacoes(identificador: string): Promise<Usuario | null>;
  buscarPorNome(nome: string): Promise<Usuario | null>;
  salvar(usuario: Usuario): Promise<Usuario>;
  excluirPorId(identificador: string): Promise<void>;
}
