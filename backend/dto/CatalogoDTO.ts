 type CidadeResponseDTO = Readonly<{
  id: number;
  nome: string;
}>;

 type CategoriaResponseDTO = Readonly<{
  id: number;
  nome: string;
}>;

 type ProfissaoResponseDTO = Readonly<{
  id: number;
  nome: string;
  categoria_profissional: number;
}>;


export type CidadesResponseDTO = CidadeResponseDTO[];

export type CategoriasRespondeDTO = CategoriaResponseDTO[];

export type ProfissoesResponseDTO = ProfissaoResponseDTO[];