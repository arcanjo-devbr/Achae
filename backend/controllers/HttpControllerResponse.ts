import type { Response } from "express";
import { HttpError } from "../exceptions/HttpError";

export function responderErroController(
  erro: unknown,
  resposta: Response,
): void {
  if (erro instanceof HttpError) {
    resposta.status(erro.statusCode).json({ mensagem: erro.message });
    return;
  }

  console.error("Erro ao processar requisição:", erro);
  resposta.status(500).json({
    mensagem: "Erro interno ao processar a requisição.",
  });
}
