export type CidadeResponseDTO = Readonly<{
  id: number;
  nome: string;
}>;

export type CategoriaResponseDTO = Readonly<{
  id: number;
  nome: string;
}>;

export type ProfissaoResponseDTO = Readonly<{
  id: number;
  nome: string;
  categoria_profissional: number;
}>;
