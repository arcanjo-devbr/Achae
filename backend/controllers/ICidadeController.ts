import type { RequestHandler } from "express";

export interface ICidadeController {
  buscarCidades: RequestHandler;
}
