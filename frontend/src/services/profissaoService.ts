import type { ProfissaoResponseDTO } from "@/types/Catalogo";
import { api } from "./api";

export async function buscarProfissoes(
  categoriaId: number,
): Promise<ProfissaoResponseDTO[]> {
  const resposta = await api.get<ProfissaoResponseDTO[]>(
    "profissoes/buscarPorCategoria",
    { params: { categoriaId } },
  );
  return resposta.data;
}
