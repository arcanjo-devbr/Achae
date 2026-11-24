import { Profissao, Usuario } from "../entities";

export type UsuarioTrabalhaInput = Readonly<{
  usuario: Usuario;
  profissao: Profissao;
  status: boolean;
  descricao: string;
}>;

export interface IUsuarioTrabalhaService {
  relacionarProfissaoUsuario(dados: UsuarioTrabalhaInput): Promise<void>;
  substituirProfissoesUsuario(usuario: Usuario, trabalhos: UsuarioTrabalhaInput[]): Promise<void>;
  excluirProfissoesUsuario(usuario: Usuario): Promise<void>;
}