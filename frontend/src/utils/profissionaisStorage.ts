import { buscarUsuarios } from "@/services/usuarioService";
import type { Profissional } from "@/types/Profissional";
import { UsuarioResponseDTO } from "@/types/Usuario";

const CHAVE_PROFISSIONAIS = "@achae/profissionais";



export async function lerProfissionaisSalvos(
  filtros?: Readonly<{
    busca?: string;
    categorias?: readonly string[];
  }>,
) {
   const profissionais = await buscarUsuarios(filtros);
     if (Array.isArray(profissionais) && profissionais.length > 0) {
        return profissionais;
     }
  return [];
}

export async function carregarProfissionais(): Promise<UsuarioResponseDTO[]> {
  const profissionaisSalvos = await lerProfissionaisSalvos();
  return [...profissionaisSalvos];
}

export async function salvarProfissional(_profissional: Profissional) {}



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