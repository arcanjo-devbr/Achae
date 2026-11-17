import { profissionais as profissionaisIniciais } from "@/data/profissionais";
import type { Profissional } from "@/types/Profissional";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

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
    typeof profissional.categoria === "string" &&
    typeof profissional.localizacao === "string" &&
    (typeof profissional.imagem === "string" || profissional.imagem === null) &&
    (profissional.telefone === undefined ||
      typeof profissional.telefone === "string") &&
    (profissional.descricao === undefined ||
      typeof profissional.descricao === "string") &&
    (profissional.status === undefined ||
      profissional.status === "Ativo" ||
      profissional.status === "Inativo")
  );
}

export async function lerProfissionaisSalvos() {
  const valorArmazenado = await AsyncStorage.getItem(CHAVE_PROFISSIONAIS);

  if (valorArmazenado === null) {
    return [];
  }

  try {
    const valor: unknown = JSON.parse(valorArmazenado);

    if (Array.isArray(valor) && valor.every(validarProfissional)) {
      return valor.map((profissional) => ({
        ...profissional,
        status: profissional.status ?? "Ativo",
      }));
    }
  } catch {}

  await AsyncStorage.removeItem(CHAVE_PROFISSIONAIS);
  return [];
}

export async function carregarProfissionais(): Promise<Profissional[]> {
  const profissionaisSalvos = await lerProfissionaisSalvos();
  return [...profissionaisSalvos];
}

export async function salvarProfissional(profissional: Profissional) {
  const profissionaisSalvos = await lerProfissionaisSalvos();
  await AsyncStorage.setItem(
    CHAVE_PROFISSIONAIS,
    JSON.stringify([...profissionaisSalvos, profissional]),
  );
}



export async function editarProfissionalStorage(
  profissionalOriginal: Profissional,
  novosDados: RascunhoCadastroProfissional,
) {
  const profissionaisSalvos = await lerProfissionaisSalvos();

  const profissionaisAtualizados = profissionaisSalvos.map(
    (profissional) =>
      profissional.id === profissionalOriginal.id
        ? {
            ...profissional,
            nome: novosDados.nome,
            telefone: novosDados.telefone,
            profissao: novosDados.profissao,
            categoria: novosDados.categoria,
            localizacao: novosDados.cidade,
            descricao: novosDados.descricaoServicos,
          }
        : profissional,
  );

  await AsyncStorage.setItem(
    CHAVE_PROFISSIONAIS,
    JSON.stringify(profissionaisAtualizados),
  );
}

export async function apagarProfissional(
  { id }: Profissional,
) {
  const profissionaisSalvos = await lerProfissionaisSalvos();

  const profissionaisNaoSelecionados = profissionaisSalvos.filter(
    (profissional) => profissional.id !== id,
  );

  await AsyncStorage.setItem(
    CHAVE_PROFISSIONAIS,
    JSON.stringify(profissionaisNaoSelecionados),
  );

  router.back()
}