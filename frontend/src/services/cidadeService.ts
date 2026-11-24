import { api } from "./api";
import type { CidadeResponseDTO } from "@/types/Catalogo";

export async function buscarCidades(): Promise<CidadeResponseDTO[]> {
  const resposta = await api.get<CidadeResponseDTO[]>("cidades/buscarTodos");
  return resposta.data;
}
