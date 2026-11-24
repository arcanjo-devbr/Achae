import { buscarCategorias } from "@/services/categoriaService";
import { buscarCidades } from "@/services/cidadeService";
import { buscarProfissoes } from "@/services/profissaoService";
import { criarUsuario } from "@/services/usuarioService";
import type {
  CategoriaResponseDTO,
  CidadeResponseDTO,
  ProfissaoResponseDTO,
} from "@/types/Catalogo";
import type { UsuarioRequestDTO } from "@/types/Usuario";
import {
  recuperarRascunhoCadastroProfissional,
  removerRascunhoCadastroProfissional,
  salvarRascunhoCadastroProfissional,
  type RascunhoCadastroProfissional,
  type TrabalhoRascunhoCadastro,
} from "@/utils/rascunhoCadastroProfissional";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const opcoesStatus = ["Ativo", "Inativo"] as const;

function criarTrabalhoVazio(): TrabalhoRascunhoCadastro {
  return {
    id: `${Date.now()}-${Math.random()}`,
    profissao: "",
    categoria: "",
    descricaoServicos: "",
    status: "Ativo",
  };
}

function formatarTelefone(valor: string) {
  const digitos = valor.replace(/\D/g, "").slice(0, 11);

  if (digitos.length <= 2) {
    return digitos.length ? `(${digitos}` : "";
  }

  if (digitos.length <= 6) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
  }

  if (digitos.length <= 10) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
  }

  return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
}

function telefoneValido(valor: string) {
  const digitos = valor.replace(/\D/g, "");
  return digitos.length === 10 || digitos.length === 11;
}

export default function CadastroProfissional() {
  const insets = useSafeAreaInsets();

  const [rascunho, setRascunho] = useState<RascunhoCadastroProfissional>({
    nome: "",
    telefone: "",
    cidade: "",
    trabalhos: [criarTrabalhoVazio()],
  });
  const [cidades, setCidades] = useState<CidadeResponseDTO[]>([]);
  const [carregandoCidades, setCarregandoCidades] = useState(true);
  const [erroCidades, setErroCidades] = useState<string | null>(null);
  const [categorias, setCategorias] = useState<CategoriaResponseDTO[]>([]);
  const [carregandoCategorias, setCarregandoCategorias] = useState(true);
  const [erroCategorias, setErroCategorias] = useState<string | null>(null);
  const [profissoesPorCategoria, setProfissoesPorCategoria] = useState<
    Record<number, ProfissaoResponseDTO[]>
  >({});
  const [categoriasCarregandoProfissoes, setCategoriasCarregandoProfissoes] =
    useState<Record<number, boolean>>({});
  const [errosProfissoes, setErrosProfissoes] = useState<
    Record<number, string>
  >({});
  const requisicoesProfissoes = useRef(new Set<number>());
  const categoriasComProfissoes = useRef(new Set<number>());
  const [rascunhoCarregado, setRascunhoCarregado] = useState(false);
  const [categoriaAberta, setCategoriaAberta] = useState<number | null>(null);
  const [profissaoAberta, setProfissaoAberta] = useState<number | null>(null);
  const [mostrarCidades, setMostrarCidades] = useState(false);
  const [salvando, setSalvando] = useState(false);

  async function carregarProfissoes(categoriaId: number) {
    if (
      categoriasComProfissoes.current.has(categoriaId) ||
      requisicoesProfissoes.current.has(categoriaId)
    ) {
      return;
    }

    requisicoesProfissoes.current.add(categoriaId);
    setCategoriasCarregandoProfissoes((atual) => ({
      ...atual,
      [categoriaId]: true,
    }));

    try {
      const lista = await buscarProfissoes(categoriaId);
      setProfissoesPorCategoria((atual) => ({
        ...atual,
        [categoriaId]: lista,
      }));
      setErrosProfissoes((atual) => {
        const novosErros = { ...atual };
        delete novosErros[categoriaId];
        return novosErros;
      });
      categoriasComProfissoes.current.add(categoriaId);
    } catch (erro) {
      console.error("Não foi possível carregar as profissões.", erro);
      setErrosProfissoes((atual) => ({
        ...atual,
        [categoriaId]:
          erro instanceof Error
            ? erro.message
            : "Não foi possível carregar as profissões.",
      }));
    } finally {
      requisicoesProfissoes.current.delete(categoriaId);
      setCategoriasCarregandoProfissoes((atual) => ({
        ...atual,
        [categoriaId]: false,
      }));
    }
  }

  useEffect(() => {
    let cancelado = false;

    async function carregarRascunho() {
      try {
        const rascunhoSalvo = await recuperarRascunhoCadastroProfissional();

        if (!cancelado && rascunhoSalvo) {
          setRascunho(rascunhoSalvo);
        }
      } catch (erro) {
        console.error(
          "Não foi possível recuperar o rascunho do cadastro.",
          erro,
        );
      } finally {
        if (!cancelado) {
          setRascunhoCarregado(true);
        }
      }
    }

    void carregarRascunho();

    return () => {
      cancelado = true;
    };
  }, []);

  useEffect(() => {
    let cancelado = false;

    async function carregarListaCategorias() {
      try {
        const lista = await buscarCategorias();
        if (!cancelado) {
          setCategorias(lista);
          setErroCategorias(null);
        }
      } catch (erro) {
        console.error("Não foi possível carregar as categorias.", erro);
        if (!cancelado) {
          setErroCategorias(
            erro instanceof Error
              ? erro.message
              : "Não foi possível carregar as categorias.",
          );
        }
      } finally {
        if (!cancelado) {
          setCarregandoCategorias(false);
        }
      }
    }

    void carregarListaCategorias();

    return () => {
      cancelado = true;
    };
  }, []);

  useEffect(() => {
    for (const trabalho of rascunho.trabalhos) {
      const categoria = categorias.find(
        (opcao) => opcao.nome === trabalho.categoria,
      );
      if (categoria) {
        void carregarProfissoes(categoria.id);
      }
    }
  }, [categorias, rascunho.trabalhos]);

  useEffect(() => {
    let cancelado = false;

    async function carregarListaCidades() {
      try {
        const lista = await buscarCidades();
        if (!cancelado) {
          setCidades(lista);
          setErroCidades(null);
        }
      } catch (erro) {
        console.error("Não foi possível carregar as cidades.", erro);
        if (!cancelado) {
          setErroCidades(
            erro instanceof Error
              ? erro.message
              : "Não foi possível carregar as cidades.",
          );
        }
      } finally {
        if (!cancelado) {
          setCarregandoCidades(false);
        }
      }
    }

    void carregarListaCidades();

    return () => {
      cancelado = true;
    };
  }, []);

  useEffect(() => {
    if (!rascunhoCarregado) {
      return;
    }

    void salvarRascunhoCadastroProfissional(rascunho).catch((erro: unknown) => {
      console.error("Não foi possível salvar o rascunho do cadastro.", erro);
    });
  }, [rascunho, rascunhoCarregado]);

  function atualizarCampo<K extends "nome" | "telefone" | "cidade">(
    campo: K,
    valor: string,
  ) {
    setRascunho((atual) => ({ ...atual, [campo]: valor }));
  }

  function atualizarTrabalho<K extends keyof TrabalhoRascunhoCadastro>(
    indice: number,
    campo: K,
    valor: TrabalhoRascunhoCadastro[K],
  ) {
    setRascunho((atual) => ({
      ...atual,
      trabalhos: atual.trabalhos.map((trabalho, indiceAtual) =>
        indiceAtual === indice ? { ...trabalho, [campo]: valor } : trabalho,
      ),
    }));
  }

  function adicionarTrabalho() {
    setRascunho((atual) => ({
      ...atual,
      trabalhos: [...atual.trabalhos, criarTrabalhoVazio()],
    }));
  }

  function removerTrabalho(indice: number) {
    setRascunho((atual) =>
      atual.trabalhos.length > 1
        ? {
            ...atual,
            trabalhos: atual.trabalhos.filter(
              (_, indiceAtual) => indiceAtual !== indice,
            ),
          }
        : atual,
    );
    setCategoriaAberta(null);
    setProfissaoAberta(null);
  }

  async function cadastrarProfissional() {
    if (
      !rascunho.nome.trim() ||
      !rascunho.telefone.trim() ||
      !rascunho.cidade
    ) {
      Alert.alert(
        "Campos obrigatórios",
        "Preencha nome, telefone e cidade para continuar.",
      );
      return;
    }

    if (!telefoneValido(rascunho.telefone)) {
      Alert.alert(
        "Telefone inválido",
        "Informe um telefone com DDD e 10 ou 11 dígitos.",
      );
      return;
    }

    const cidadeId = Number(rascunho.cidade);
    if (
      !Number.isSafeInteger(cidadeId) ||
      !cidades.some((cidade) => cidade.id === cidadeId)
    ) {
      Alert.alert("Cidade inválida", "Selecione uma cidade da lista.");
      return;
    }

    const trabalhoInvalido = rascunho.trabalhos.some((trabalho) => {
      const categoria = categorias.find(
        (opcao) => opcao.nome === trabalho.categoria,
      );
      return (
        !categoria ||
        !trabalho.profissao.trim() ||
        !profissoesPorCategoria[categoria.id]?.some(
          (profissao) => profissao.nome === trabalho.profissao,
        )
      );
    });

    if (trabalhoInvalido) {
      Alert.alert(
        "Trabalhos incompletos",
        "Selecione uma profissão e categoria disponíveis para cada trabalho.",
      );
      return;
    }

    if (
      rascunho.trabalhos.some(
        (trabalho) =>
          trabalho.profissao.trim().length > 100 ||
          trabalho.descricaoServicos.trim().length > 500,
      )
    ) {
      Alert.alert(
        "Limite de caracteres",
        "Cada profissão pode ter até 100 caracteres e cada descrição até 500.",
      );
      return;
    }

    setSalvando(true);

    try {
      await salvarRascunhoCadastroProfissional(rascunho);
      const dadosCadastro: UsuarioRequestDTO = {
        nome: rascunho.nome.trim(),
        telefone: rascunho.telefone.trim(),
        cidade: cidadeId,
        trabalhos: rascunho.trabalhos.map((trabalho) => ({
          profissao: trabalho.profissao.trim(),
          categoria: trabalho.categoria,
          descricao: trabalho.descricaoServicos.trim(),
          status: trabalho.status === "Ativo",
        })),
      };

      await criarUsuario(dadosCadastro);
      let falhaAoLimparRascunho = false;
      try {
        await removerRascunhoCadastroProfissional();
      } catch (erro) {
        falhaAoLimparRascunho = true;
        console.error("Não foi possível remover o rascunho do cadastro.", erro);
      }

      Alert.alert(
        "Cadastro realizado!",
        falhaAoLimparRascunho
          ? "O usuário foi cadastrado, mas não foi possível limpar o rascunho salvo."
          : "O usuário foi cadastrado com sucesso.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/"),
          },
        ],
      );
    } catch (erro) {
      console.error("Não foi possível cadastrar o profissional.", erro);
      Alert.alert(
        "Falha no cadastro",
        erro instanceof Error
          ? erro.message
          : "Não foi possível cadastrar o usuário. Os dados preenchidos foram mantidos para uma nova tentativa.",
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <ScrollView
      style={styles.tela}
      contentContainerStyle={[
        styles.conteudo,
        {
          paddingTop: insets.top + 10,
          paddingBottom: insets.bottom + 30,
        },
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.cabecalho}>
        <Pressable style={styles.botaoVoltar} onPress={() => router.back()}>
          <Text style={styles.setaVoltar}>‹</Text>
        </Pressable>

        <View style={styles.tituloContainer}>
          <Text style={styles.titulo}>Cadastrar profissional</Text>
          <Text style={styles.subtitulo}>
            Preencha os dados do profissional
          </Text>
        </View>
      </View>

      <View style={styles.cartao}>
        <Text style={styles.tituloSecao}>Dados do usuário</Text>

        <Text style={styles.rotulo}>Nome completo *</Text>
        <TextInput
          style={styles.campo}
          placeholder="Digite o nome completo"
          placeholderTextColor="#94A3B8"
          autoCapitalize="words"
          value={rascunho.nome}
          onChangeText={(valor) => atualizarCampo("nome", valor)}
        />

        <Text style={styles.rotulo}>Telefone *</Text>
        <TextInput
          style={styles.campo}
          placeholder="(83) 99999-9999"
          placeholderTextColor="#94A3B8"
          keyboardType="phone-pad"
          value={rascunho.telefone}
          onChangeText={(valor) =>
            atualizarCampo("telefone", formatarTelefone(valor))
          }
        />

        <Text style={styles.rotulo}>Cidade *</Text>
        <Pressable
          style={styles.seletor}
          onPress={() => setMostrarCidades((aberta) => !aberta)}
          disabled={carregandoCidades || cidades.length === 0}
        >
          <Text
            style={[
              styles.textoSeletor,
              !rascunho.cidade && styles.placeholder,
            ]}
          >
            {carregandoCidades
              ? "Carregando cidades..."
              : (cidades.find((cidade) => String(cidade.id) === rascunho.cidade)
                  ?.nome ?? "Selecione uma cidade")}
          </Text>
          <Text style={styles.setaSeletor}>{mostrarCidades ? "⌃" : "⌄"}</Text>
        </Pressable>
        {erroCidades && (
          <Text style={styles.textoErroCidades}>{erroCidades}</Text>
        )}
        {mostrarCidades && (
          <View style={styles.listaCategorias}>
            {cidades.map((cidade) => (
              <Pressable
                key={cidade.id}
                style={styles.opcaoCategoria}
                onPress={() => {
                  atualizarCampo("cidade", String(cidade.id));
                  setMostrarCidades(false);
                }}
              >
                <Text
                  style={[
                    styles.textoOpcao,
                    rascunho.cidade === String(cidade.id) &&
                      styles.opcaoSelecionada,
                  ]}
                >
                  {cidade.nome}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {rascunho.trabalhos.map((trabalho, indice) => {
        const categoriaId = categorias.find(
          (categoria) => categoria.nome === trabalho.categoria,
        )?.id;
        const profissoes = categoriaId
          ? (profissoesPorCategoria[categoriaId] ?? [])
          : [];

        return (
          <View key={trabalho.id} style={styles.cartao}>
            <View style={styles.cabecalhoTrabalho}>
              <Text style={styles.tituloSecao}>Trabalho {indice + 1}</Text>
              {rascunho.trabalhos.length > 1 && (
                <Pressable
                  onPress={() => removerTrabalho(indice)}
                >
                  <Text style={styles.textoRemoverTrabalho}>Remover</Text>
                </Pressable>
              )}
            </View>

            <Text style={styles.rotulo}>Categoria *</Text>
            <Pressable
              style={styles.seletor}
              disabled={carregandoCategorias || categorias.length === 0}
              onPress={() =>
                setCategoriaAberta((aberta) =>
                  aberta === indice ? null : indice,
                )
              }
            >
              <Text
                style={[
                  styles.textoSeletor,
                  !trabalho.categoria && styles.placeholder,
                ]}
              >
                {carregandoCategorias
                  ? "Carregando categorias..."
                  : (trabalho.categoria || "Selecione uma categoria")}
              </Text>
              <Text style={styles.setaSeletor}>
                {categoriaAberta === indice ? "⌃" : "⌄"}
              </Text>
            </Pressable>
            {erroCategorias && (
              <Text style={styles.textoErroCidades}>{erroCategorias}</Text>
            )}
            {categoriaAberta === indice && (
              <View style={styles.listaCategorias}>
                {categorias.map((categoria) => (
                  <Pressable
                    key={categoria.id}
                    style={styles.opcaoCategoria}
                    onPress={() => {
                      atualizarTrabalho(indice, "categoria", categoria.nome);
                      atualizarTrabalho(indice, "profissao", "");
                      setCategoriaAberta(null);
                      setProfissaoAberta(null);
                    }}
                  >
                    <Text
                      style={[
                        styles.textoOpcao,
                        trabalho.categoria === categoria.nome &&
                          styles.opcaoSelecionada,
                      ]}
                    >
                      {categoria.nome}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}

            <Text style={styles.rotulo}>Profissão *</Text>
            <Pressable
              style={styles.seletor}
              disabled={
                !categoriaId ||
                categoriasCarregandoProfissoes[categoriaId] ||
                profissoes.length === 0
              }
              onPress={() =>
                setProfissaoAberta((aberta) =>
                  aberta === indice ? null : indice,
                )
              }
            >
              <Text
                style={[
                  styles.textoSeletor,
                  !trabalho.profissao && styles.placeholder,
                ]}
              >
                {categoriaId && categoriasCarregandoProfissoes[categoriaId]
                  ? "Carregando profissões..."
                  : categoriaId && profissoes.length === 0
                    ? "Nenhuma profissão disponível"
                    : (trabalho.profissao || "Selecione uma profissão")}
              </Text>
              <Text style={styles.setaSeletor}>
                {profissaoAberta === indice ? "⌃" : "⌄"}
              </Text>
            </Pressable>
            {categoriaId && errosProfissoes[categoriaId] && (
              <Text style={styles.textoErroCidades}>
                {errosProfissoes[categoriaId]}
              </Text>
            )}
            {profissaoAberta === indice && categoriaId && (
              <View style={styles.listaCategorias}>
                {profissoes.map((profissao) => (
                  <Pressable
                    key={profissao.id}
                    style={styles.opcaoCategoria}
                    onPress={() => {
                      atualizarTrabalho(indice, "profissao", profissao.nome);
                      setProfissaoAberta(null);
                    }}
                  >
                    <Text
                      style={[
                        styles.textoOpcao,
                        trabalho.profissao === profissao.nome &&
                          styles.opcaoSelecionada,
                      ]}
                    >
                      {profissao.nome}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}

            <Text style={styles.rotulo}>Descrição dos serviços</Text>
            <TextInput
              style={[styles.campo, styles.campoDescricao]}
              placeholder="Descreva os serviços oferecidos"
              placeholderTextColor="#94A3B8"
              multiline
              textAlignVertical="top"
              value={trabalho.descricaoServicos}
              onChangeText={(valor) =>
                atualizarTrabalho(indice, "descricaoServicos", valor)
              }
            />

            <Text style={styles.rotulo}>Status *</Text>
            <View style={styles.opcoesStatus}>
              {opcoesStatus.map((opcao) => (
                <Pressable
                  key={opcao}
                  style={[
                    styles.botaoStatus,
                    trabalho.status === opcao && styles.botaoStatusSelecionado,
                  ]}
                  onPress={() => atualizarTrabalho(indice, "status", opcao)}
                >
                  <Text
                    style={[
                      styles.textoStatus,
                      trabalho.status === opcao &&
                        styles.textoStatusSelecionado,
                    ]}
                  >
                    {opcao}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        );
      })}

      <Pressable
        style={styles.botaoAdicionarTrabalho}
        onPress={adicionarTrabalho}
      >
        <Text style={styles.textoBotaoAdicionarTrabalho}>
          + Adicionar trabalho
        </Text>
      </Pressable>

      <View style={styles.acoes}>
        <Pressable
          style={[styles.botaoCadastrar, salvando && styles.botaoDesabilitado]}
          onPress={() => void cadastrarProfissional()}
          disabled={
            salvando ||
            !rascunhoCarregado ||
            carregandoCidades ||
            carregandoCategorias ||
            Object.values(categoriasCarregandoProfissoes).some(Boolean)
          }
        >
          <Text style={styles.textoBotaoCadastrar}>
            {salvando ? "Salvando..." : "Cadastrar profissional"}
          </Text>
        </Pressable>

        <Pressable style={styles.botaoCancelar} onPress={() => router.back()}>
          <Text style={styles.textoBotaoCancelar}>Cancelar</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: "#F3F6FB",
  },
  conteudo: {
    paddingHorizontal: 20,
  },
  cabecalho: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  botaoVoltar: {
    width: 42,
    height: 42,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  setaVoltar: {
    fontSize: 34,
    color: "#1E293B",
    lineHeight: 38,
  },
  tituloContainer: {
    flex: 1,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "700",
    color: "#172554",
  },
  subtitulo: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 5,
  },
  cartao: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
  },
  cabecalhoTrabalho: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textoRemoverTrabalho: {
    color: "#DC2626",
    fontSize: 14,
    fontWeight: "600",
  },
  tituloSecao: {
    fontSize: 17,
    fontWeight: "700",
    color: "#172554",
    marginBottom: 18,
  },
  rotulo: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 8,
    marginTop: 14,
  },
  campo: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 12,
    fontSize: 15,
    color: "#1E293B",
    backgroundColor: "#FFFFFF",
  },
  campoDescricao: {
    minHeight: 100,
  },
  seletor: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textoSeletor: {
    fontSize: 15,
    color: "#1E293B",
  },
  placeholder: {
    color: "#94A3B8",
  },
  setaSeletor: {
    fontSize: 20,
    color: "#64748B",
  },
  listaCategorias: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    marginTop: 6,
    overflow: "hidden",
  },
  opcaoCategoria: {
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  textoOpcao: {
    fontSize: 15,
    color: "#334155",
  },
  opcaoSelecionada: {
    color: "#2563EB",
    fontWeight: "700",
  },
  textoAjuda: {
    fontSize: 13,
    lineHeight: 20,
    color: "#64748B",
    marginTop: -8,
    marginBottom: 16,
  },
  textoErroCidades: {
    color: "#DC2626",
    fontSize: 13,
    marginTop: 6,
  },
  botaoAdicionarTrabalho: {
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2563EB",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
  },
  textoBotaoAdicionarTrabalho: {
    color: "#2563EB",
    fontSize: 15,
    fontWeight: "700",
  },
  opcoesStatus: {
    flexDirection: "row",
    gap: 12,
  },
  botaoStatus: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
  },
  botaoStatusSelecionado: {
    backgroundColor: "#DBEAFE",
    borderColor: "#2563EB",
  },
  textoStatus: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
  },
  textoStatusSelecionado: {
    color: "#1D4ED8",
  },
  acoes: {
    gap: 12,
    marginBottom: 10,
  },
  botaoCadastrar: {
    backgroundColor: "#2563EB",
    borderRadius: 12,
    padding: 17,
    alignItems: "center",
  },
  botaoDesabilitado: {
    opacity: 0.6,
  },
  textoBotaoCadastrar: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  botaoCancelar: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  textoBotaoCancelar: {
    color: "#475569",
    fontSize: 15,
    fontWeight: "600",
  },
});
