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

export type CidadesResponseDTO = readonly CidadeResponseDTO[];
export type CategoriasResponseDTO = readonly CategoriaResponseDTO[];
export type ProfissoesResponseDTO = readonly ProfissaoResponseDTO[];
