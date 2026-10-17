import { salvarProfissional } from "@/utils/profissionaisStorage";
import {
  recuperarRascunhoCadastroProfissional,
  removerRascunhoCadastroProfissional,
  salvarRascunhoCadastroProfissional,
  type RascunhoCadastroProfissional,
} from "@/utils/rascunhoCadastroProfissional";
import { router } from "expo-router";
import { useEffect, useState } from "react";
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
    profissao: "",
    categoria: "",
    cidade: "",
    descricaoServicos: "",
  });
  const [rascunhoCarregado, setRascunhoCarregado] = useState(false);
  const [mostrarCategorias, setMostrarCategorias] = useState(false);
  const [status, setStatus] = useState("Ativo");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    let cancelado = false;

    async function carregarRascunho() {
      try {
        const rascunhoSalvo = await recuperarRascunhoCadastroProfissional();

        if (!cancelado && rascunhoSalvo) {
          setRascunho(rascunhoSalvo);
        }

        if (!cancelado) {
          setRascunhoCarregado(true);
        }
      } catch (erro) {
        console.error(
          "Não foi possível recuperar o rascunho do cadastro.",
          erro,
        );
      }
    }

    void carregarRascunho();

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

  function atualizarCampo<K extends keyof RascunhoCadastroProfissional>(
    campo: K,
    valor: RascunhoCadastroProfissional[K],
  ) {
    setRascunho((atual) => ({ ...atual, [campo]: valor }));
  }

  async function cadastrarProfissional() {
    const camposObrigatorios: (keyof RascunhoCadastroProfissional)[] = [
      "nome",
      "telefone",
      "profissao",
      "categoria",
      "cidade",
    ];
    const possuiCampoObrigatorioVazio = camposObrigatorios.some(
      (campo) => !rascunho[campo].trim(),
    );

    if (possuiCampoObrigatorioVazio) {
      Alert.alert(
        "Campos obrigatórios",
        "Preencha nome, telefone, profissão, categoria e cidade para continuar.",
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

    setSalvando(true);

    try {
      await salvarRascunhoCadastroProfissional(rascunho);
      await salvarProfissional({
        id: Date.now(),
        nome: rascunho.nome.trim(),
        profissao: rascunho.profissao.trim(),
        categoria: rascunho.categoria,
        localizacao: rascunho.cidade.trim(),
        imagem: null,
        telefone: rascunho.telefone.trim(),
        descricao: rascunho.descricaoServicos.trim(),
      });
      await removerRascunhoCadastroProfissional();

      Alert.alert(
        "Cadastro realizado!",
        "O profissional foi cadastrado com sucesso.",
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
        "Não foi possível salvar o profissional. Os dados preenchidos foram mantidos para uma nova tentativa.",
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
        <Text style={styles.tituloSecao}>Dados do profissional</Text>

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
            atualizarCampo("telefone", formatarTelefone(valor))}
        />

        <Text style={styles.rotulo}>Profissão *</Text>
        <TextInput
          style={styles.campo}
          placeholder="Ex.: Eletricista"
          placeholderTextColor="#94A3B8"
          autoCapitalize="words"
          value={rascunho.profissao}
          onChangeText={(valor) => atualizarCampo("profissao", valor)}
        />

        <Text style={styles.rotulo}>Categoria *</Text>

        <Pressable
          style={styles.seletor}
          onPress={() => setMostrarCategorias(!mostrarCategorias)}
        >
          <Text
            style={[
              styles.textoSeletor,
              !rascunho.categoria && styles.placeholder,
            ]}
          >
            {rascunho.categoria || "Selecione uma categoria"}
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
                  atualizarCampo("categoria", item);
                  setMostrarCategorias(false);
                }}
              >
                <Text
                  style={[
                    styles.textoOpcao,
                    rascunho.categoria === item && styles.opcaoSelecionada,
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
          value={rascunho.cidade}
          onChangeText={(valor) => atualizarCampo("cidade", valor)}
        />

        <Text style={styles.rotulo}>Descrição dos serviços</Text>
        <TextInput
          style={[styles.campo, styles.campoDescricao]}
          placeholder="Descreva os serviços oferecidos"
          placeholderTextColor="#94A3B8"
          multiline
          textAlignVertical="top"
          value={rascunho.descricaoServicos}
          onChangeText={(valor) => atualizarCampo("descricaoServicos", valor)}
        />
      </View>

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

      <View style={styles.acoes}>
        <Pressable
          style={[styles.botaoCadastrar, salvando && styles.botaoDesabilitado]}
          onPress={() => void cadastrarProfissional()}
          disabled={salvando || !rascunhoCarregado}
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
