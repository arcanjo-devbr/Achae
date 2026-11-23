import { api } from "./api";
import type { ProfissoesResponseDTO } from "@/types/Catalogo";

export async function buscarProfissoesPorCategoria(
  categoriaId: number,
): Promise<ProfissoesResponseDTO> {
  if (
    !Number.isSafeInteger(categoriaId) ||
    categoriaId <= 0
  ) {
    throw new RangeError(
      "categoriaId deve ser um inteiro positivo e seguro.",
    );
  }

  const resposta = await api.get<ProfissoesResponseDTO>(
    "profissoes/buscarPorCategoria",
    {
      params: {
        categoriaId,
      },
    },
  );

  return resposta.data;
}
