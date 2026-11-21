import type { RequestHandler } from "express";

export interface IProfissaoController {
  buscarProfissoes: RequestHandler;
}
