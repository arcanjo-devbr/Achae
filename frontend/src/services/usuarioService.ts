import { api } from "./api";
import type {
  UsuarioRequestDTO,
  UsuarioResponseDTO,
} from "../types/Usuario";

export async function criarUsuario(
  dados: UsuarioRequestDTO,
): Promise<UsuarioResponseDTO> {
  const resposta = await api.post<UsuarioResponseDTO>(
    "usuarios/criar",
    dados,
  );

  return resposta.data;
}

export async function buscarUsuarios(): Promise<UsuarioResponseDTO[]> {
  const resposta = await api.get<UsuarioResponseDTO[]>(
    "usuarios/buscarTodos",
  );

  return resposta.data;
}
