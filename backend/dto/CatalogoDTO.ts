export type CidadesResponseDTO = Readonly<{
  id: number;
  nome: string;
}>;

export type CategoriaResponseDTO = Readonly<{
  id: number;
  nome: string;
  categoria: string;
}>;

export type ProfissoesResponseDTO = Readonly<{
  id: number;
  nome: string;
  especialidade: string;
  categoria_profissional: number;
}>;
