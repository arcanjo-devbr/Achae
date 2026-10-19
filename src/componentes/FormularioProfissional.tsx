
import { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";

export type DadosFormularioProfissional = {
  nome: string;
  telefone: string;
  profissao: string;
  categoria: string;
  cidade: string;
  descricaoServicos: string;
};

type FormularioProfissionalProps = {
  valores: DadosFormularioProfissional;

  onChangeCampo: (
    campo: keyof DadosFormularioProfissional,
    valor: string
  ) => void;

  categorias: string[];

  status: "Ativo" | "Inativo";
  onChangeStatus: (status: "Ativo" | "Inativo") => void;

  modo: "cadastro" | "edicao";
  salvando: boolean;
  carregando?: boolean;

  onSubmit: () => void | Promise<void>;
  onCancelar: () => void;
};

export function FormularioProfissional({
  valores,
  onChangeCampo,
  categorias,
  status,
  onChangeStatus,
  modo,
  salvando,
  carregando = false,
  onSubmit,
  onCancelar,
}: FormularioProfissionalProps) {
  const [mostrarCategorias, setMostrarCategorias] = useState(false);

  const titulo =
    modo === "cadastro"
      ? "Cadastrar profissional"
      : "Editar profissional";

  const textoBotao =
    modo === "cadastro"
      ? "Cadastrar profissional"
      : "Salvar alterações";

  const campoDesabilitado = salvando || carregando;

  return (
    <ScrollView
      style={styles.tela}
      contentContainerStyle={styles.conteudo}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Cabeçalho */}
      <View style={styles.cabecalho}>
        <Pressable
          style={styles.botaoVoltar}
          onPress={onCancelar}
          disabled={salvando}
        >
          <Text style={styles.setaVoltar}>‹</Text>
        </Pressable>

        <View style={styles.tituloContainer}>
          <Text style={styles.titulo}>{titulo}</Text>

          <Text style={styles.subtitulo}>
            {modo === "cadastro"
              ? "Preencha os dados do profissional"
              : "Atualize os dados do profissional"}
          </Text>
        </View>
      </View>

      {/* Nome */}
      <Text style={styles.rotulo}>Nome completo *</Text>

      <TextInput
        style={styles.campo}
        placeholder="Digite o nome completo"
        placeholderTextColor="#94A3B8"
        autoCapitalize="words"
        value={valores.nome}
        onChangeText={(valor) =>
          onChangeCampo("nome", valor)
        }
        editable={!campoDesabilitado}
      />

      {/* Telefone */}
      <Text style={styles.rotulo}>Telefone *</Text>

      <TextInput
        style={styles.campo}
        placeholder="Digite o telefone"
        placeholderTextColor="#94A3B8"
        keyboardType="phone-pad"
        value={valores.telefone}
        onChangeText={(valor) =>
          onChangeCampo("telefone", valor)
        }
        editable={!campoDesabilitado}
      />

      {/* Profissão */}
      <Text style={styles.rotulo}>Profissão *</Text>

      <TextInput
        style={styles.campo}
        placeholder="Digite a profissão"
        placeholderTextColor="#94A3B8"
        value={valores.profissao}
        onChangeText={(valor) =>
          onChangeCampo("profissao", valor)
        }
        editable={!campoDesabilitado}
      />

      {/* Categoria */}
      <Text style={styles.rotulo}>Categoria *</Text>

      <Pressable
        style={styles.seletor}
        onPress={() =>
          setMostrarCategorias((atual) => !atual)
        }
        disabled={campoDesabilitado}
      >
        <Text
          style={[
            styles.textoSeletor,
            !valores.categoria && styles.placeholder,
          ]}
        >
          {valores.categoria || "Selecione uma categoria"}
        </Text>

        <Text style={styles.setaSeletor}>
          {mostrarCategorias ? "⌃" : "⌄"}
        </Text>
      </Pressable>

      {mostrarCategorias && (
        <View style={styles.listaCategorias}>
          {categorias.map((categoria) => (
            <Pressable
              key={categoria}
              style={styles.opcaoCategoria}
              onPress={() => {
                onChangeCampo("categoria", categoria);
                setMostrarCategorias(false);
              }}
            >
              <Text
                style={[
                  styles.textoOpcao,
                  valores.categoria === categoria &&
                    styles.opcaoSelecionada,
                ]}
              >
                {categoria}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* Cidade */}
      <Text style={styles.rotulo}>Cidade *</Text>

      <TextInput
        style={styles.campo}
        placeholder="Digite a cidade"
        placeholderTextColor="#94A3B8"
        autoCapitalize="words"
        value={valores.cidade}
        onChangeText={(valor) =>
          onChangeCampo("cidade", valor)
        }
        editable={!campoDesabilitado}
      />

      {/* Descrição */}
      <Text style={styles.rotulo}>Descrição dos serviços</Text>

      <TextInput
        style={[styles.campo, styles.campoDescricao]}
        placeholder="Descreva os serviços oferecidos"
        placeholderTextColor="#94A3B8"
        multiline
        textAlignVertical="top"
        value={valores.descricaoServicos}
        onChangeText={(valor) =>
          onChangeCampo("descricaoServicos", valor)
        }
        editable={!campoDesabilitado}
      />

      {/* Status */}
      <Text style={styles.rotulo}>Status</Text>

      <View style={styles.opcoesStatus}>
        {(["Ativo", "Inativo"] as const).map((opcao) => (
          <Pressable
            key={opcao}
            style={[
              styles.botaoStatus,
              status === opcao &&
                styles.botaoStatusSelecionado,
            ]}
            onPress={() => onChangeStatus(opcao)}
            disabled={campoDesabilitado}
          >
            <Text
              style={[
                styles.textoStatus,
                status === opcao &&
                  styles.textoStatusSelecionado,
              ]}
            >
              {opcao}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Ações */}
      <Pressable
        style={[
          styles.botaoCadastrar,
          campoDesabilitado && styles.botaoDesabilitado,
        ]}
        onPress={() => {
          void onSubmit();
        }}
        disabled={campoDesabilitado}
      >
        <Text style={styles.textoBotaoCadastrar}>
          {carregando
            ? "Carregando..."
            : salvando
              ? "Salvando..."
              : textoBotao}
        </Text>
      </Pressable>

      <Pressable
        style={styles.botaoCancelar}
        onPress={onCancelar}
        disabled={salvando}
      >
        <Text style={styles.textoBotaoCancelar}>
          Cancelar
        </Text>
      </Pressable>
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
    paddingTop: 20,
    paddingBottom: 30,
  },
  cabecalho: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  botaoVoltar: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  setaVoltar: {
    fontSize: 36,
    color: "#1E293B",
    lineHeight: 40,
  },
  tituloContainer: {
    flex: 1,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E293B",
  },
  subtitulo: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 4,
  },
  rotulo: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 8,
    marginTop: 16,
  },
  campo: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: "#1E293B",
  },
  campoDescricao: {
    minHeight: 120,
  },
  seletor: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 15,
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
    marginTop: 6,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    overflow: "hidden",
  },
  opcaoCategoria: {
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  textoOpcao: {
    fontSize: 15,
    color: "#334155",
  },
  opcaoSelecionada: {
    color: "#2563EA",
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
    backgroundColor: "#FFFFFF",
  },
  botaoStatusSelecionado: {
    borderColor: "#2563EA",
    backgroundColor: "#EFF6FF",
  },
  textoStatus: {
    fontSize: 15,
    color: "#64748B",
  },
  textoStatusSelecionado: {
    color: "#2563EA",
    fontWeight: "700",
  },
  botaoCadastrar: {
    marginTop: 28,
    backgroundColor: "#2563EA",
    padding: 16,
    borderRadius: 12,
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
    marginTop: 12,
    padding: 15,
    alignItems: "center",
  },
  textoBotaoCancelar: {
    color: "#64748B",
    fontSize: 15,
    fontWeight: "600",
  },
});
