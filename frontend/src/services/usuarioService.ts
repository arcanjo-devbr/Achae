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

export async function buscarUsuarios(
  filtros?: Readonly<{
    busca?: string;
    categorias?: readonly string[];
  }>,
): Promise<UsuarioResponseDTO[]> {
  const resposta = await api.get<UsuarioResponseDTO[]>(
    "usuarios/buscarTodos",
    {
      params: {
        busca: filtros?.busca?.trim() || undefined,
        categorias: filtros?.categorias?.join(",") || undefined,
      },
    },
  );

  return resposta.data;
}

export async function buscarUsuarioPorId(
  id: string,
): Promise<UsuarioResponseDTO> {
  const resposta = await api.get<UsuarioResponseDTO>(`usuarios/${id}`);
  return resposta.data;
}

export async function editarUsuario(
  id: string,
  dados: UsuarioRequestDTO,
): Promise<UsuarioResponseDTO> {
  const resposta = await api.put<UsuarioResponseDTO>(
    `usuarios/${id}`,
    dados,
  );
  return resposta.data;
}

export async function excluirUsuario(id: string): Promise<void> {
  await api.delete(`usuarios/${id}`);
}
