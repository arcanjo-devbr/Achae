import type { RequestHandler } from "express";

export interface IUsuarioController {
  criarUsuario: RequestHandler;
  buscarUsuarios: RequestHandler;
}
