import { buscarCategorias } from "@/services/categoriaService";
import { buscarCidades } from "@/services/cidadeService";
import { buscarProfissoes } from "@/services/profissaoService";
import {
  buscarUsuarioPorId,
  editarUsuario,
} from "@/services/usuarioService";
import type {
  CategoriaResponseDTO,
  CidadeResponseDTO,
  ProfissaoResponseDTO,
} from "@/types/Catalogo";
import type {
  UsuarioRequestDTO,
  UsuarioResponseDTO,
  TrabalhoRequestDTO,
} from "@/types/Usuario";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TrabalhoFormulario = Readonly<{
  id: string;
  profissao: string;
  categoria: string;
  descricao: string;
  status: "Ativo" | "Inativo";
}>;

function criarTrabalhoVazio(): TrabalhoFormulario {
  return {
    id: `${Date.now()}-${Math.random()}`,
    profissao: "",
    categoria: "",
    descricao: "",
    status: "Ativo",
  };
}

export default function EditarProfissional() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [profissional, setProfissional] =
    useState<UsuarioResponseDTO | null>(null);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cidadeId, setCidadeId] = useState("");
  const [trabalhos, setTrabalhos] = useState<TrabalhoFormulario[]>([
    criarTrabalhoVazio(),
  ]);
  const [cidades, setCidades] = useState<CidadeResponseDTO[]>([]);
  const [categorias, setCategorias] = useState<CategoriaResponseDTO[]>([]);
  const [profissoesPorCategoria, setProfissoesPorCategoria] = useState<
    Record<number, ProfissaoResponseDTO[]>
  >({});
  const [mostrarCidades, setMostrarCidades] = useState(false);
  const [categoriaAberta, setCategoriaAberta] = useState<number | null>(null);
  const [profissaoAberta, setProfissaoAberta] = useState<number | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    let cancelado = false;

    async function carregar() {
      if (!id) {
        Alert.alert("Erro", "Profissional não informado.");
        router.back();
        return;
      }

      try {
        const [usuario, listaCidades, listaCategorias] = await Promise.all([
          buscarUsuarioPorId(id),
          buscarCidades(),
          buscarCategorias(),
        ]);

        if (cancelado) return;

        setProfissional(usuario);
        setNome(usuario.nome);
        setTelefone(usuario.telefone);
        setCidadeId(String(usuario.cidade));
        setCidades(listaCidades);
        setCategorias(listaCategorias);
        setTrabalhos(
          usuario.trabalhos.length > 0
            ? usuario.trabalhos.map((trabalho) => ({
                id: trabalho.id,
                profissao: trabalho.profissao,
                categoria: trabalho.categoria,
                descricao: trabalho.descricao,
                status: trabalho.status ? "Ativo" : "Inativo",
              }))
            : [criarTrabalhoVazio()],
        );

        await Promise.all(
          [...new Set(usuario.trabalhos.map((trabalho) => trabalho.categoria))]
            .map((nomeCategoria) =>
              listaCategorias.find(
                (categoria) => categoria.nome === nomeCategoria,
              ),
            )
            .filter(
              (categoria): categoria is CategoriaResponseDTO =>
                categoria !== undefined,
            )
            .map(async (categoria) => {
              const lista = await buscarProfissoes(categoria.id);
              if (!cancelado) {
                setProfissoesPorCategoria((atual) => ({
                  ...atual,
                  [categoria.id]: lista,
                }));
              }
            }),
        );
      } catch (erro) {
        if (!cancelado) {
          Alert.alert(
            "Erro",
            erro instanceof Error
              ? erro.message
              : "Não foi possível carregar os dados.",
          );
          router.back();
        }
      } finally {
        if (!cancelado) setCarregando(false);
      }
    }

    void carregar();
    return () => {
      cancelado = true;
    };
  }, [id]);

  function atualizarTrabalho(
    indice: number,
    campo: "profissao" | "categoria" | "descricao" | "status",
    valor: string,
  ) {
    setTrabalhos((atuais) =>
      atuais.map((trabalho, indiceAtual) =>
        indiceAtual === indice
          ? {
              ...trabalho,
              [campo]: valor,
            }
          : trabalho,
      ),
    );
  }

  async function carregarProfissoes(categoriaId: number) {
    if (profissoesPorCategoria[categoriaId]) return;
    const lista = await buscarProfissoes(categoriaId);
    setProfissoesPorCategoria((atual) => ({
      ...atual,
      [categoriaId]: lista,
    }));
  }

  async function salvar() {
    if (!profissional) return;
    if (!nome.trim() || !telefone.trim() || !cidadeId) {
      Alert.alert(
        "Campos obrigatórios",
        "Preencha nome, telefone e cidade.",
      );
      return;
    }

    if (
      trabalhos.some(
        (trabalho) => !trabalho.categoria || !trabalho.profissao,
      )
    ) {
      Alert.alert(
        "Trabalhos incompletos",
        "Selecione categoria e profissão em todos os trabalhos.",
      );
      return;
    }

    const cidade = Number(cidadeId);
    if (!Number.isSafeInteger(cidade)) {
      Alert.alert("Cidade inválida", "Selecione uma cidade da lista.");
      return;
    }

    const dados: UsuarioRequestDTO = {
      nome: nome.trim(),
      telefone: telefone.trim(),
      cidade,
      trabalhos: trabalhos.map(
        (trabalho): TrabalhoRequestDTO => ({
          profissao: trabalho.profissao,
          categoria: trabalho.categoria,
          descricao: trabalho.descricao.trim(),
          status: trabalho.status === "Ativo",
        }),
      ),
    };

    setSalvando(true);
    try {
      await editarUsuario(profissional.id, dados);
      Alert.alert("Alterações salvas!", "O profissional foi atualizado.", [
        { text: "OK", onPress: () => router.replace("/") },
      ]);
    } catch (erro) {
      Alert.alert(
        "Erro",
        erro instanceof Error
          ? erro.message
          : "Não foi possível salvar as alterações.",
      );
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <View style={styles.carregando}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
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
    >
      <View style={styles.cabecalho}>
        <Pressable style={styles.botaoVoltar} onPress={() => router.back()}>
          <Text style={styles.setaVoltar}>‹</Text>
        </Pressable>
        <View style={styles.tituloContainer}>
          <Text style={styles.titulo}>Editar profissional</Text>
          <Text style={styles.subtitulo}>Atualize os dados cadastrados</Text>
        </View>
      </View>

      <View style={styles.cartao}>
        <Text style={styles.rotulo}>Nome completo *</Text>
        <TextInput
          style={styles.campo}
          value={nome}
          onChangeText={setNome}
        />

        <Text style={styles.rotulo}>Telefone *</Text>
        <TextInput
          style={styles.campo}
          value={telefone}
          onChangeText={setTelefone}
          keyboardType="phone-pad"
        />

        <Text style={styles.rotulo}>Cidade *</Text>
        <Pressable
          style={styles.seletor}
          onPress={() => setMostrarCidades((atual) => !atual)}
        >
          <Text style={styles.textoSeletor}>
            {cidades.find((cidade) => String(cidade.id) === cidadeId)?.nome ??
              "Selecione uma cidade"}
          </Text>
          <Text style={styles.setaSeletor}>{mostrarCidades ? "⌃" : "⌄"}</Text>
        </Pressable>
        {mostrarCidades && (
          <View style={styles.listaOpcoes}>
            {cidades.map((cidade) => (
              <Pressable
                key={cidade.id}
                style={styles.opcao}
                onPress={() => {
                  setCidadeId(String(cidade.id));
                  setMostrarCidades(false);
                }}
              >
                <Text
                  style={[
                    styles.textoOpcao,
                    cidadeId === String(cidade.id) &&
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

      {trabalhos.map((trabalho, indice) => {
        const categoria = categorias.find(
          (item) => item.nome === trabalho.categoria,
        );
        const profissoes = categoria
          ? (profissoesPorCategoria[categoria.id] ?? [])
          : [];

        return (
          <View key={trabalho.id} style={styles.cartao}>
            <View style={styles.cabecalhoTrabalho}>
              <Text style={styles.tituloSecao}>Trabalho {indice + 1}</Text>
              {trabalhos.length > 1 && (
                <Pressable
                  onPress={() =>
                    setTrabalhos((atuais) =>
                      atuais.filter(
                        (_, indiceAtual) => indiceAtual !== indice,
                      ),
                    )
                  }
                >
                  <Text style={styles.textoRemover}>Remover</Text>
                </Pressable>
              )}
            </View>

            <Text style={styles.rotulo}>Categoria *</Text>
            <Pressable
              style={styles.seletor}
              onPress={() =>
                setCategoriaAberta((atual) =>
                  atual === indice ? null : indice,
                )
              }
            >
              <Text style={styles.textoSeletor}>
                {trabalho.categoria || "Selecione uma categoria"}
              </Text>
              <Text style={styles.setaSeletor}>
                {categoriaAberta === indice ? "⌃" : "⌄"}
              </Text>
            </Pressable>
            {categoriaAberta === indice && (
              <View style={styles.listaOpcoes}>
                {categorias.map((item) => (
                  <Pressable
                    key={item.id}
                    style={styles.opcao}
                    onPress={() => {
                      atualizarTrabalho(indice, "categoria", item.nome);
                      atualizarTrabalho(indice, "profissao", "");
                      setCategoriaAberta(null);
                      setProfissaoAberta(null);
                      void carregarProfissoes(item.id);
                    }}
                  >
                    <Text
                      style={[
                        styles.textoOpcao,
                        trabalho.categoria === item.nome &&
                          styles.opcaoSelecionada,
                      ]}
                    >
                      {item.nome}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}

            <Text style={styles.rotulo}>Profissão *</Text>
            <Pressable
              style={styles.seletor}
              disabled={!categoria}
              onPress={() =>
                setProfissaoAberta((atual) =>
                  atual === indice ? null : indice,
                )
              }
            >
              <Text style={styles.textoSeletor}>
                {trabalho.profissao || "Selecione uma profissão"}
              </Text>
              <Text style={styles.setaSeletor}>
                {profissaoAberta === indice ? "⌃" : "⌄"}
              </Text>
            </Pressable>
            {profissaoAberta === indice && categoria && (
              <View style={styles.listaOpcoes}>
                {profissoes.map((item) => (
                  <Pressable
                    key={item.id}
                    style={styles.opcao}
                    onPress={() => {
                      atualizarTrabalho(indice, "profissao", item.nome);
                      setProfissaoAberta(null);
                    }}
                  >
                    <Text
                      style={[
                        styles.textoOpcao,
                        trabalho.profissao === item.nome &&
                          styles.opcaoSelecionada,
                      ]}
                    >
                      {item.nome}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}

            <Text style={styles.rotulo}>Descrição dos serviços</Text>
            <TextInput
              style={[styles.campo, styles.campoDescricao]}
              multiline
              value={trabalho.descricao}
              onChangeText={(valor) =>
                atualizarTrabalho(indice, "descricao", valor)
              }
            />

            <Text style={styles.rotulo}>Status *</Text>
            <View style={styles.statusOpcoes}>
              {(["Ativo", "Inativo"] as const).map((opcao) => (
                <Pressable
                  key={opcao}
                  style={[
                    styles.statusBotao,
                    trabalho.status === opcao && styles.statusSelecionado,
                  ]}
                  onPress={() =>
                    atualizarTrabalho(indice, "status", opcao)
                  }
                >
                  <Text
                    style={[
                      styles.statusTexto,
                      trabalho.status === opcao &&
                        styles.statusTextoSelecionado,
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
        style={styles.botaoAdicionar}
        onPress={() =>
          setTrabalhos((atuais) => [...atuais, criarTrabalhoVazio()])
        }
      >
        <Text style={styles.textoAdicionar}>+ Adicionar trabalho</Text>
      </Pressable>

      <Pressable
        style={[styles.botaoSalvar, salvando && styles.botaoDesabilitado]}
        onPress={() => void salvar()}
        disabled={salvando}
      >
        <Text style={styles.textoSalvar}>
          {salvando ? "Salvando..." : "Salvar alterações"}
        </Text>
      </Pressable>

      <Pressable style={styles.botaoCancelar} onPress={() => router.back()}>
        <Text style={styles.textoCancelar}>Cancelar</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: "#F3F6FB" },
  conteudo: { paddingHorizontal: 20 },
  carregando: { flex: 1, alignItems: "center", justifyContent: "center" },
  cabecalho: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  botaoVoltar: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  setaVoltar: { fontSize: 34, color: "#1E293B" },
  tituloContainer: { flex: 1, marginLeft: 8 },
  titulo: { fontSize: 20, fontWeight: "700", color: "#172554" },
  subtitulo: { fontSize: 13, color: "#64748B", marginTop: 4 },
  cartao: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
  },
  tituloSecao: { fontSize: 17, fontWeight: "700", color: "#172554" },
  cabecalhoTrabalho: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  textoRemover: { color: "#DC2626", fontWeight: "600" },
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
    color: "#1E293B",
  },
  campoDescricao: { minHeight: 100, textAlignVertical: "top" },
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
  textoSeletor: { color: "#1E293B", fontSize: 15 },
  setaSeletor: { color: "#64748B", fontSize: 20 },
  listaOpcoes: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    marginTop: 6,
    overflow: "hidden",
  },
  opcao: {
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  textoOpcao: { color: "#334155", fontSize: 15 },
  opcaoSelecionada: { color: "#2563EB", fontWeight: "700" },
  statusOpcoes: { flexDirection: "row", gap: 12 },
  statusBotao: {
    flex: 1,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    paddingVertical: 13,
  },
  statusSelecionado: { backgroundColor: "#DBEAFE", borderColor: "#2563EB" },
  statusTexto: { color: "#64748B", fontWeight: "600" },
  statusTextoSelecionado: { color: "#1D4ED8" },
  botaoAdicionar: {
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2563EB",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  textoAdicionar: { color: "#2563EB", fontWeight: "700" },
  botaoSalvar: {
    backgroundColor: "#2563EB",
    borderRadius: 12,
    padding: 17,
    alignItems: "center",
  },
  botaoDesabilitado: { opacity: 0.6 },
  textoSalvar: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  botaoCancelar: { alignItems: "center", padding: 16 },
  textoCancelar: { color: "#475569", fontWeight: "600" },
});
