import { Usuario } from "../entities/Usuario";

export interface IUsuarioRepository {
  buscarTodos(): Promise<Usuario[]>;
  buscarPorId(identificador: string): Promise<Usuario | null>;
  buscarPorNome(nome: string): Promise<Usuario | null>;
  salvar(usuario: Usuario): Promise<Usuario>;
  excluirPorId(identificador: string): Promise<void>;
}
