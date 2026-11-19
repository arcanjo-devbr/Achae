export type UsuarioRequestDTO = Readonly<{
  nome: string;
  telefone: string;
  cidade: number;
  profissao: number;
  categoria_profissional: number;
}>;

export type UsuarioResponseDTO = Readonly<{
  id: string;
  nome: string;
  telefone: string;
  cidade: number;
  profissao: number;
  categoria_profissional: number;
}>;
