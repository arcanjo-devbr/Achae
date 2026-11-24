import AsyncStorage from "@react-native-async-storage/async-storage";

export type TrabalhoRascunhoCadastro = {
  id: string;
  profissao: string;
  categoria: string;
  descricaoServicos: string;
  status: "Ativo" | "Inativo";
};

export type RascunhoCadastroProfissional = {
  nome: string;
  telefone: string;
  cidade: string;
  trabalhos: TrabalhoRascunhoCadastro[];
};

const CHAVE_RASCUNHO = "@achae/rascunho-cadastro-profissional";

function ehObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null;
}

function validarTrabalho(valor: unknown): valor is TrabalhoRascunhoCadastro {
  if (!ehObjeto(valor)) {
    return false;
  }

  return (
    typeof valor.id === "string" &&
    typeof valor.profissao === "string" &&
    typeof valor.categoria === "string" &&
    typeof valor.descricaoServicos === "string" &&
    (valor.status === "Ativo" || valor.status === "Inativo")
  );
}

function validarRascunho(
  valor: unknown,
): valor is RascunhoCadastroProfissional {
  if (!ehObjeto(valor)) {
    return false;
  }

  return (
    typeof valor.nome === "string" &&
    typeof valor.telefone === "string" &&
    typeof valor.cidade === "string" &&
    Array.isArray(valor.trabalhos) &&
    valor.trabalhos.length > 0 &&
    valor.trabalhos.every(validarTrabalho)
  );
}

function migrarRascunhoAntigo(
  valor: unknown,
): RascunhoCadastroProfissional | null {
  if (!ehObjeto(valor)) {
    return null;
  }

  if (
    typeof valor.nome !== "string" ||
    typeof valor.telefone !== "string" ||
    typeof valor.profissao !== "string" ||
    typeof valor.categoria !== "string" ||
    typeof valor.cidade !== "string" ||
    typeof valor.descricaoServicos !== "string" ||
    (valor.status !== undefined &&
      valor.status !== "Ativo" &&
      valor.status !== "Inativo")
  ) {
    return null;
  }

  return {
    nome: valor.nome,
    telefone: valor.telefone,
    cidade: valor.cidade,
    trabalhos: [
      {
        id: "legado-0",
        profissao: valor.profissao,
        categoria: valor.categoria,
        descricaoServicos: valor.descricaoServicos,
        status: valor.status ?? "Ativo",
      },
    ],
  };
}

export async function recuperarRascunhoCadastroProfissional() {
  const valorArmazenado = await AsyncStorage.getItem(CHAVE_RASCUNHO);

  if (valorArmazenado === null) {
    return null;
  }

  try {
    const valor: unknown = JSON.parse(valorArmazenado);

    if (validarRascunho(valor)) {
      return valor;
    }

    const rascunhoMigrado = migrarRascunhoAntigo(valor);
    if (rascunhoMigrado) {
      return rascunhoMigrado;
    }
  } catch {
    await AsyncStorage.removeItem(CHAVE_RASCUNHO);
    return null;
  }

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
