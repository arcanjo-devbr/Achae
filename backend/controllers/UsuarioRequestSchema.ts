import { z } from "zod";

const trabalhoSchema = z.object({
  profissao: z
    .string({ error: "Profissão deve ser um texto." })
    .trim()
    .min(1, "Profissão é obrigatória.")
    .max(100, "Profissão deve ter no máximo 100 caracteres."),
  categoria: z
    .string({ error: "Categoria deve ser um texto." })
    .trim()
    .min(1, "Categoria é obrigatória.")
    .max(100, "Categoria deve ter no máximo 100 caracteres."),
  status: z.boolean({ error: "Status deve ser verdadeiro ou falso." }),
  descricao: z
    .string({ error: "Descrição deve ser um texto." })
    .trim()
    .max(500, "Descrição deve ter no máximo 500 caracteres."),
});

export const usuarioRequestSchema = z.object({
  nome: z
    .string({ error: "Nome deve ser um texto." })
    .trim()
    .min(1, "Nome é obrigatório.")
    .max(150, "Nome deve ter no máximo 150 caracteres."),
  telefone: z
    .string({ error: "Telefone deve ser um texto." })
    .trim()
    .max(20, "Telefone deve ter no máximo 20 caracteres.")
    .regex(
      /^[0-9()+\-\s]+$/,
      "Telefone contém caracteres inválidos.",
    )
    .refine((telefone) => {
      const quantidadeDigitos = telefone.replace(/\D/g, "").length;
      return quantidadeDigitos === 10 || quantidadeDigitos === 11;
    }, "Telefone deve conter DDD e 10 ou 11 dígitos."),
  cidade: z
    .number({ error: "Cidade deve ser um identificador numérico." })
    .int("Cidade deve ser um identificador inteiro.")
    .positive("Cidade deve ser um identificador positivo."),
  trabalhos: z
    .array(trabalhoSchema, {
      error: "Trabalhos deve ser uma lista válida.",
    })
    .min(1, "Informe ao menos um trabalho."),
});
