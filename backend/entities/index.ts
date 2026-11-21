import { Cidade } from "./Cidade";
import { CategoriaProfissional } from "./CategoriaProfissional";
import { Profissao } from "./Profissao";
import { Usuario } from "./Usuario";
import { UsuarioTrabalha } from "./UsuarioTrabalha";

export { Cidade, CategoriaProfissional, Profissao, Usuario, UsuarioTrabalha };

export const ENTITY_CLASSES = [
  Cidade,
  Profissao,
  CategoriaProfissional,
  Usuario,
  UsuarioTrabalha,
] as const;

export const READ_ONLY_ENTITY_CLASSES = [
  Cidade,
  Profissao,
  CategoriaProfissional,
] as const;
