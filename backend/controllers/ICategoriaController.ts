import type { RequestHandler } from "express";

export interface ICategoriaController {
  buscarCategorias: RequestHandler;
}
