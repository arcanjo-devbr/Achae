import { api } from "./api";
import type { CidadesResponseDTO } from "@/types/Catalogo";

export async function buscarCidades(): Promise<CidadesResponseDTO> {
  const resposta = await api.get<CidadesResponseDTO>(
    "cidades/buscarTodos",
  );

  return resposta.data;
}
