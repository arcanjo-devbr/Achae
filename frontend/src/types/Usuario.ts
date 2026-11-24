export type TrabalhoRequestDTO = Readonly<{
  profissao: string;
  categoria: string;
  status: boolean;
  descricao: string;
}>;

export type UsuarioRequestDTO = Readonly<{
  nome: string;
  telefone: string;
  cidade: number;
  trabalhos: readonly TrabalhoRequestDTO[];
}>;

export type TrabalhoResponseDTO = Readonly<{
  id: string;
  profissao: string;
  categoria: string;
  status: boolean;
  descricao: string;
}>;

export type UsuarioResponseDTO = Readonly<{
  id: string;
  nome: string;
  telefone: string;
  cidade: number;
  cidade_nome?: string;
  trabalhos: readonly TrabalhoResponseDTO[];
}>;
