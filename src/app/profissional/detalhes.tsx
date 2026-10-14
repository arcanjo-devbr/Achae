import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DetalhesProfissional() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.tela}
      contentContainerStyle={[styles.conteudo, { paddingTop: insets.top + 10 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Cabeçalho */}
      <View style={styles.cabecalho}>
        <Pressable
          style={styles.botaoVoltar}
          onPress={() => router.back()}
        >
          <Text style={styles.setaVoltar}>‹</Text>
        </Pressable>

        <Text style={styles.tituloCabecalho}>Detalhes do profissional</Text>
      </View>

      {/* Apresentação do profissional */}
      <View style={styles.cartaoPerfil}>
        <View style={styles.avatar}>
          <Text style={styles.letraAvatar}>J</Text>
        </View>

        <Text style={styles.nomeProfissional}>João da Silva</Text>
        <Text style={styles.profissao}>Eletricista</Text>

        <View style={styles.status}>
          <View style={styles.pontoStatus} />
          <Text style={styles.textoStatus}>Ativo</Text>
        </View>
      </View>

      {/* Informações do profissional */}
      <Text style={styles.tituloSecao}>Informações</Text>

      <View style={styles.cartaoInformacoes}>
        <View style={styles.itemInformacao}>
          <View style={styles.icone}>
            <Text style={styles.simboloIcone}>☎</Text>
          </View>
          <View style={styles.dadosInformacao}>
            <Text style={styles.rotulo}>Telefone</Text>
            <Text style={styles.valor}>(83) 99999-9999</Text>
          </View>
        </View>

        <View style={styles.divisor} />

        <View style={styles.itemInformacao}>
          <View style={styles.icone}>
            <Text style={styles.simboloIcone}>⌖</Text>
          </View>
          <View style={styles.dadosInformacao}>
            <Text style={styles.rotulo}>Cidade</Text>
            <Text style={styles.valor}>Esperança - PB</Text>
          </View>
        </View>

        <View style={styles.divisor} />

        <View style={styles.itemInformacao}>
          <View style={styles.icone}>
            <Text style={styles.simboloIcone}>◇</Text>
          </View>
          <View style={styles.dadosInformacao}>
            <Text style={styles.rotulo}>Categoria</Text>
            <Text style={styles.valor}>Serviços residenciais</Text>
          </View>
        </View>
      </View>

      {/* Descrição */}
      <Text style={styles.tituloSecao}>Sobre o profissional</Text>

      <View style={styles.cartaoDescricao}>
        <Text style={styles.descricao}>
          Serviços de instalação e manutenção elétrica residencial, com
          atendimento para diferentes necessidades.
        </Text>
      </View>

      {/* Ações interativas */}
      <View style={styles.acoes}>
        <Pressable
          style={styles.botaoEditar}
          onPress={() => {
            /* ação de editar */
          }}
        >
          <Text style={styles.textoBotaoEditar}>Editar profissional</Text>
        </Pressable>

        <Pressable
          style={styles.botaoExcluir}
          onPress={() => {
            /* ação de excluir */
          }}
        >
          <Text style={styles.textoBotaoExcluir}>Excluir profissional</Text>
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
  status: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 14,
  },
  pontoStatus: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#16A34A",
    marginRight: 7,
  },
  textoStatus: {
    fontSize: 13,
    fontWeight: "600",
    color: "#166534",
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
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  textoBotaoExcluir: {
    color: "#DC2626",
    fontSize: 16,
    fontWeight: "600",
  },
});