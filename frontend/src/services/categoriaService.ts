import type { CategoriaResponseDTO } from "@/types/Catalogo";
import { api } from "./api";

export async function buscarCategorias(): Promise<CategoriaResponseDTO[]> {
  const resposta = await api.get<CategoriaResponseDTO[]>(
    "categorias-profissionais/buscarTodos",
  );
  return resposta.data;
}
