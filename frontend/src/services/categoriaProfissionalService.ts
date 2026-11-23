import { api } from "./api";
import type { CategoriasResponseDTO } from "@/types/Catalogo";

export async function buscarCategoriasProfissionais(): Promise<CategoriasResponseDTO> {
  const resposta = await api.get<CategoriasResponseDTO>(
    "categorias-profissionais/buscarTodos",
  );

  return resposta.data;
}
