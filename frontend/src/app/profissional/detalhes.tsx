import { buscarUsuarioPorId, excluirUsuario } from "@/services/usuarioService";
import type { UsuarioResponseDTO } from "@/types/Usuario";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DetalhesProfissional() {
  const insets = useSafeAreaInsets();
  const { id, profissional: profissionalParam } = useLocalSearchParams<{
    id: string;
    profissional?: string;
  }>();
  const [profissional, setProfissional] =
    useState<UsuarioResponseDTO | null>(null);
  const [nomeCidade, setNomeCidade] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [apagando, setApagando] = useState(false);

  function confirmarExclusao() {
    if (!profissional) return;

    Alert.alert(
      "Excluir profissional",
      `Deseja apagar ${profissional.nome}? Esta ação não pode ser desfeita.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => void apagarProfissional(),
        },
      ],
    );
  }

  async function apagarProfissional() {
    if (!profissional) return;

    setApagando(true);
    try {
      await excluirUsuario(profissional.id);
      Alert.alert("Profissional excluído", "Os dados foram removidos.", [
        { text: "OK", onPress: () => router.replace("/") },
      ]);
    } catch (erroExclusao) {
      Alert.alert(
        "Erro",
        erroExclusao instanceof Error
          ? erroExclusao.message
          : "Não foi possível excluir o profissional.",
      );
    } finally {
      setApagando(false);
    }
  }

  useEffect(() => {
    let cancelado = false;

    async function carregarDetalhes() {
      if (!id) {
        setErro("Profissional não informado.");
        setCarregando(false);
        return;
      }

      if (profissionalParam) {
        try {
          const usuario = JSON.parse(profissionalParam) as UsuarioResponseDTO;
          if (!cancelado) {
            setProfissional(usuario);
          }

          if (!cancelado) {
            setNomeCidade(usuario.cidade_nome ?? "Não informada");
            setErro(null);
            setCarregando(false);
          }
          return;
        } catch {
          if (!cancelado) {
            setProfissional(null);
          }
        }
      }

      try {
        const usuario = await buscarUsuarioPorId(id);

        if (!cancelado) {
          setProfissional(usuario);
          setNomeCidade(usuario.cidade_nome ?? "Não informada");
          setErro(null);
        }
      } catch (erroCarregamento) {
        if (!cancelado) {
          setErro(
            erroCarregamento instanceof Error
              ? erroCarregamento.message
              : "Não foi possível carregar os detalhes.",
          );
        }
      } finally {
        if (!cancelado) {
          setCarregando(false);
        }
      }
    }

    void carregarDetalhes();
    return () => {
      cancelado = true;
    };
  }, [id, profissionalParam]);

  return (
    <ScrollView
      style={styles.tela}
      contentContainerStyle={[styles.conteudo, { paddingTop: insets.top + 10 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.cabecalho}>
        <Pressable style={styles.botaoVoltar} onPress={() => router.back()}>
          <Text style={styles.setaVoltar}>‹</Text>
        </Pressable>

        <Text style={styles.tituloCabecalho}>Detalhes do profissional</Text>
      </View>

      {carregando ? (
        <View style={styles.estadoVazio}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.descricao}>Carregando detalhes...</Text>
        </View>
      ) : erro ? (
        <View style={styles.estadoVazio}>
          <Text style={styles.nomeProfissional}>Não foi possível carregar</Text>
          <Text style={styles.descricao}>{erro}</Text>
          <Pressable style={styles.botaoEditar} onPress={() => router.back()}>
            <Text style={styles.textoBotaoEditar}>Voltar para a lista</Text>
          </Pressable>
        </View>
      ) : profissional ? (
        <>
          <View style={styles.cartaoPerfil}>
            <View style={styles.avatar}>
              <Text style={styles.letraAvatar}>
                {profissional.nome.trim().charAt(0).toLocaleUpperCase()}
              </Text>
            </View>

            <Text style={styles.nomeProfissional}>{profissional.nome}</Text>
            {profissional.trabalhos.map((trabalho) => (
              <Text key={trabalho.id} style={styles.profissao}>
                {trabalho.profissao}
              </Text>
            ))}
            {[...new Set(profissional.trabalhos.map((trabalho) => trabalho.categoria))]
              .map((categoria) => (
                <Text key={categoria} style={styles.categoria}>
                  {categoria}
                </Text>
              ))}
          </View>

          <Text style={styles.tituloSecao}>Informações</Text>

          <View style={styles.cartaoInformacoes}>
            <View style={styles.itemInformacao}>
              <View style={styles.icone}>
                <Text style={styles.simboloIcone}>☎</Text>
              </View>
              <View style={styles.dadosInformacao}>
                <Text style={styles.rotulo}>Telefone</Text>
                <Text style={styles.valor}>
                  {profissional.telefone || "Não informado"}
                </Text>
              </View>
            </View>

            <View style={styles.divisor} />

            <View style={styles.itemInformacao}>
              <View style={styles.icone}>
                <Text style={styles.simboloIcone}>⌖</Text>
              </View>
              <View style={styles.dadosInformacao}>
                <Text style={styles.rotulo}>Cidade</Text>
                <Text style={styles.valor}>{nomeCidade}</Text>
              </View>
            </View>

            <View style={styles.divisor} />

            <View style={styles.itemInformacao}>
              <View style={styles.icone}>
                <Text style={styles.simboloIcone}>◇</Text>
              </View>
              <View style={styles.dadosInformacao}>
                <Text style={styles.rotulo}>Categoria</Text>
                <Text style={styles.valor}>
                  {[...new Set(
                    profissional.trabalhos.map((trabalho) => trabalho.categoria),
                  )].join(", ") || "Não informada"}
                </Text>
              </View>
            </View>

            <View style={styles.divisor} />

            <View style={styles.itemInformacao}>
              <View style={styles.icone}>
                <Text style={styles.simboloIcone}>◆</Text>
              </View>
              <View style={styles.dadosInformacao}>
                <Text style={styles.rotulo}>Profissão</Text>
                <Text style={styles.valor}>
                  {[...new Set(
                    profissional.trabalhos.map((trabalho) => trabalho.profissao),
                  )].join(", ") || "Não informada"}
                </Text>
              </View>
            </View>
          </View>

          <Text style={styles.tituloSecao}>Sobre o profissional</Text>

          <View style={styles.cartaoDescricao}>
            <Text style={styles.descricao}>
              {profissional.trabalhos
                .map((trabalho) => trabalho.descricao)
                .filter(Boolean)
                .join("\n\n") || "Descrição não informada."}
            </Text>
          </View>

          <View style={styles.acoes}>
            <Pressable
              style={styles.botaoEditar}
              onPress={() =>
                router.push({
                  pathname: "/profissional/editar",
                  params: { id: profissional.id },
                })
              }
            >
              <Text style={styles.textoBotaoEditar}>Editar profissional</Text>
            </Pressable>

            <Pressable
              style={[
                styles.botaoExcluir,
                apagando && styles.botaoDesabilitado,
              ]}
              onPress={confirmarExclusao}
              disabled={apagando}
            >
              <Text style={styles.textoBotaoExcluir}>
                {apagando ? "Excluindo..." : "Excluir profissional"}
              </Text>
            </Pressable>

          </View>
        </>
      ) : (
        <View style={styles.estadoVazio}>
          <Text style={styles.nomeProfissional}>
            Profissional não encontrado
          </Text>
          <Text style={styles.descricao}>
            Não foi possível localizar os dados deste profissional.
          </Text>
          <Pressable style={styles.botaoEditar} onPress={() => router.back()}>
            <Text style={styles.textoBotaoEditar}>Voltar para a lista</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: "#F3F6FB",
  },
  conteudo: {
    padding: 20,
    paddingBottom: 40,
  },
  cabecalho: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
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
  tituloCabecalho: {
    flex: 1,
    fontSize: 19,
    fontWeight: "700",
    color: "#172554",
  },
  cartaoPerfil: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    marginBottom: 28,
  },
  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  letraAvatar: {
    fontSize: 34,
    fontWeight: "700",
    color: "#2563EB",
  },
  nomeProfissional: {
    fontSize: 23,
    fontWeight: "700",
    color: "#172554",
    textAlign: "center",
  },
  profissao: {
    fontSize: 16,
    color: "#64748B",
    marginTop: 6,
  },
  categoria: {
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 14,
    fontSize: 13,
    fontWeight: "600",
    color: "#1D4ED8",
    overflow: "hidden",
  },
  tituloSecao: {
    fontSize: 18,
    fontWeight: "700",
    color: "#172554",
    marginBottom: 12,
  },
  cartaoInformacoes: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 28,
  },
  itemInformacao: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 17,
  },
  icone: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },
  simboloIcone: {
    fontSize: 24,
    color: "#2563EB",
  },
  dadosInformacao: {
    flex: 1,
  },
  rotulo: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 5,
  },
  valor: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E293B",
  },
  divisor: {
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  cartaoDescricao: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 28,
  },
  descricao: {
    fontSize: 15,
    lineHeight: 24,
    color: "#475569",
  },
  acoes: {
    marginTop: 4,
    gap: 12,
  },
  estadoVazio: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    gap: 14,
  },
  botaoEditar: {
    backgroundColor: "#2563EB",
    borderRadius: 12,
    padding: 17,
    alignItems: "center",
  },
  textoBotaoEditar: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  botaoExcluir: {
    backgroundColor: "#DC2626",
    borderRadius: 12,
    padding: 17,
    alignItems: "center",
  },
  textoBotaoExcluir: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  botaoDesabilitado: {
    opacity: 0.6,
  },
});
