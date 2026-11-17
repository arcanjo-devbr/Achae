export type Profissional = {
  id: number;
  nome: string;
  profissao: string;
  categoria: string;
  localizacao: string;
  imagem: string | null;
  status: "Ativo" | "Inativo";
  telefone?: string;
  descricao?: string;
};
