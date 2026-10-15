import { profissionais as profissionaisIniciais } from "@/data/profissionais";
import type { Profissional } from "@/types/Profissional";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAVE_PROFISSIONAIS = "@achae/profissionais";

function validarProfissional(valor: unknown): valor is Profissional {
  if (typeof valor !== "object" || valor === null) {
    return false;
  }

  const profissional = valor as Record<string, unknown>;

  return (
    typeof profissional.id === "number" &&
    typeof profissional.nome === "string" &&
    typeof profissional.profissao === "string" &&
    typeof profissional.localizacao === "string" &&
    (typeof profissional.imagem === "string" || profissional.imagem === null)
  );
}

async function lerProfissionaisSalvos() {
  const valorArmazenado = await AsyncStorage.getItem(CHAVE_PROFISSIONAIS);

  if (valorArmazenado === null) {
    return [];
  }

  try {
    const valor: unknown = JSON.parse(valorArmazenado);

    if (Array.isArray(valor) && valor.every(validarProfissional)) {
      return valor;
    }
  } catch {}

  await AsyncStorage.removeItem(CHAVE_PROFISSIONAIS);
  return [];
}

export async function carregarProfissionais(): Promise<Profissional[]> {
  const profissionaisSalvos = await lerProfissionaisSalvos();
  return [...profissionaisIniciais, ...profissionaisSalvos];
}

export async function salvarProfissional(profissional: Profissional) {
  const profissionaisSalvos = await lerProfissionaisSalvos();
  await AsyncStorage.setItem(
    CHAVE_PROFISSIONAIS,
    JSON.stringify([...profissionaisSalvos, profissional]),
  );
}
