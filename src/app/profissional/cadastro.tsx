
import { router } from "expo-router";
import { useState } from "react";
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

const categorias = [
  "Elétrica",
  "Hidráulica",
  "Pintura",
  "Construção",
  "Informática",
  "Limpeza",
  "Manutenção",
  "Outros",
];

export default function CadastroProfissional() {
  const insets = useSafeAreaInsets();

  const [categoria, setCategoria] = useState("");
  const [mostrarCategorias, setMostrarCategorias] = useState(false);
  const [status, setStatus] = useState("Ativo");

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
      {/* Cabeçalho */}
      <View style={styles.cabecalho}>
        <Pressable
          style={styles.botaoVoltar}
          onPress={() => router.back()}
        >
          <Text style={styles.setaVoltar}>‹</Text>
        </Pressable>

        <View style={styles.tituloContainer}>
          <Text style={styles.titulo}>Cadastrar profissional</Text>
          <Text style={styles.subtitulo}>
            Preencha os dados do profissional
          </Text>
        </View>
      </View>

      {/* Dados pessoais */}
      <View style={styles.cartao}>
        <Text style={styles.tituloSecao}>Dados do profissional</Text>

        <Text style={styles.rotulo}>Nome completo *</Text>
        <TextInput
          style={styles.campo}
          placeholder="Digite o nome completo"
          placeholderTextColor="#94A3B8"
          autoCapitalize="words"
        />

        <Text style={styles.rotulo}>Telefone *</Text>
        <TextInput
          style={styles.campo}
          placeholder="(83) 99999-9999"
          placeholderTextColor="#94A3B8"
          keyboardType="phone-pad"
        />

        <Text style={styles.rotulo}>Profissão *</Text>
        <TextInput
          style={styles.campo}
          placeholder="Ex.: Eletricista"
          placeholderTextColor="#94A3B8"
          autoCapitalize="words"
        />

        {/* Seleção de categoria */}
        <Text style={styles.rotulo}>Categoria *</Text>

        <Pressable
          style={styles.seletor}
          onPress={() => setMostrarCategorias(!mostrarCategorias)}
        >
          <Text
            style={[
              styles.textoSeletor,
              !categoria && styles.placeholder,
            ]}
          >
            {categoria || "Selecione uma categoria"}
          </Text>

          <Text style={styles.setaSeletor}>
            {mostrarCategorias ? "⌃" : "⌄"}
          </Text>
        </Pressable>

        {mostrarCategorias && (
          <View style={styles.listaCategorias}>
            {categorias.map((item) => (
              <Pressable
                key={item}
                style={styles.opcaoCategoria}
                onPress={() => {
                  setCategoria(item);
                  setMostrarCategorias(false);
                }}
              >
                <Text
                  style={[
                    styles.textoOpcao,
                    categoria === item && styles.opcaoSelecionada,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        <Text style={styles.rotulo}>Cidade *</Text>
        <TextInput
          style={styles.campo}
          placeholder="Digite a cidade"
          placeholderTextColor="#94A3B8"
          autoCapitalize="words"
        />

        <Text style={styles.rotulo}>Descrição dos serviços</Text>
        <TextInput
          style={[styles.campo, styles.campoDescricao]}
          placeholder="Descreva os serviços oferecidos"
          placeholderTextColor="#94A3B8"
          multiline
          textAlignVertical="top"
        />
      </View>

      {/* Status */}
      <View style={styles.cartao}>
        <Text style={styles.tituloSecao}>Status do profissional</Text>
        <Text style={styles.textoAjuda}>
          Indique se o profissional está ativo no sistema.
        </Text>

        <View style={styles.opcoesStatus}>
          {["Ativo", "Inativo"].map((opcao) => (
            <Pressable
              key={opcao}
              style={[
                styles.botaoStatus,
                status === opcao && styles.botaoStatusSelecionado,
              ]}
              onPress={() => setStatus(opcao)}
            >
              <Text
                style={[
                  styles.textoStatus,
                  status === opcao && styles.textoStatusSelecionado,
                ]}
              >
                {opcao}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Ações */}
      <View style={styles.acoes}>
        <Pressable
          style={styles.botaoCadastrar}
          onPress={() =>
            Alert.alert(
              "Cadastro não implementado",
              "A interface está pronta para a próxima etapa. Os dados ainda não são salvos."
            )
          }
        >
          <Text style={styles.textoBotaoCadastrar}>
            Cadastrar profissional
          </Text>
        </Pressable>

        <Pressable
          style={styles.botaoCancelar}
          onPress={() => router.back()}
        >
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
