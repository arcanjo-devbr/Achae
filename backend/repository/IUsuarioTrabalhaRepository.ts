import { UsuarioTrabalha } from "../entities/UsuarioTrabalha";

export interface IUsuarioTrabalhaRepository {
  salvar(vinculo: UsuarioTrabalha): Promise<UsuarioTrabalha>;
  buscarPorUsuario(usuarioId: string): Promise<UsuarioTrabalha[]>;
  excluirPorUsuario(usuarioId: string): Promise<void>;
}
