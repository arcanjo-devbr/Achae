import { UsuarioTrabalha } from "../entities/UsuarioTrabalha";

export interface IUsuarioTrabalhaRepository {
  salvar(vinculo: UsuarioTrabalha): Promise<UsuarioTrabalha>;
}
