import AsyncStorage from "@react-native-async-storage/async-storage";

export type RascunhoCadastroProfissional = {
  nome: string;
  telefone: string;
  profissao: string;
  categoria: string;
  cidade: string;
  descricaoServicos: string;
  status: "Ativo" | "Inativo";
};

const CHAVE_RASCUNHO = "@achae/rascunho-cadastro-profissional";

function validarRascunho(
  valor: unknown,
): valor is RascunhoCadastroProfissional {
  if (typeof valor !== "object" || valor === null) {
    return false;
  }

  const rascunho = valor as Record<string, unknown>;

  const camposTexto = [
    rascunho.nome,
    rascunho.telefone,
    rascunho.profissao,
    rascunho.categoria,
    rascunho.cidade,
    rascunho.descricaoServicos,
  ].every((campo) => typeof campo === "string");

  return (
    camposTexto &&
    (rascunho.status === undefined ||
      rascunho.status === "Ativo" ||
      rascunho.status === "Inativo")
  );
}

export async function recuperarRascunhoCadastroProfissional() {
  const valorArmazenado = await AsyncStorage.getItem(CHAVE_RASCUNHO);

  if (valorArmazenado === null) {
    return null;
  }

  try {
    const valor: unknown = JSON.parse(valorArmazenado);

    if (validarRascunho(valor)) {
      return { ...valor, status: valor.status ?? "Ativo" };
    }
  } catch {}

  await AsyncStorage.removeItem(CHAVE_RASCUNHO);
  return null;
}

export function salvarRascunhoCadastroProfissional(
  rascunho: RascunhoCadastroProfissional,
) {
  return AsyncStorage.setItem(CHAVE_RASCUNHO, JSON.stringify(rascunho));
}

export function removerRascunhoCadastroProfissional() {
  return AsyncStorage.removeItem(CHAVE_RASCUNHO);
}
