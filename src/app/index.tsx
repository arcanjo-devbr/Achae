
import { BotaoCadastrarProfissional } from "@/componentes/BotaoCadastrarProfissional";
import { CampoBuscaItem } from "@/componentes/CampoBuscaItem";
import { ProfissionalItem } from "@/componentes/ProfissionalItem";
import type { Profissional } from "@/types/Profissional";
import { carregarProfissionais } from "@/utils/profissionaisStorage";
import { Feather } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

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

export default function Index() {
  const [busca, setBusca] = useState("");
  const [categoriasSelecionadas, setCategoriasSelecionadas] =
    useState<string[]>([]);
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      void carregarProfissionais()
        .then((lista) => {
          if (ativo) {
            setProfissionais(lista);
          }
        })
        .catch((erro: unknown) => {
          console.error(
            "Não foi possível carregar os profissionais.",
            erro,
          );
        });

      return () => {
        ativo = false;
      };
    }, []),
  );

  const termoBusca = busca.trim().toLocaleLowerCase();

  const profissionaisFiltrados = profissionais.filter(
    ({ nome, profissao, categoria }) => {
      const correspondeBusca =
        nome.toLocaleLowerCase().includes(termoBusca) ||
        profissao.toLocaleLowerCase().includes(termoBusca);

      const correspondeCategoria =
        categoriasSelecionadas.length === 0 ||
        categoriasSelecionadas.includes(categoria);

      return correspondeBusca && correspondeCategoria;
    },
  );

  function alternarCategoria(categoria: string) {
    setCategoriasSelecionadas((selecionadas) =>
      selecionadas.includes(categoria)
        ? selecionadas.filter((item) => item !== categoria)
        : [...selecionadas, categoria],
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.marcaAchae}>
        <View style={styles.conteudoMarcaAchae}>
          <Text style={styles.nomeMarca}>Achaê</Text>
          <Text>Encontre profissionais</Text>
        </View>

        <Feather name="users" size={24} color="#2563EA" />
      </View>

      <CampoBuscaItem
        buscaValor={busca}
        setBuscaValor={setBusca}
      />

      <View style={styles.secaoCategorias}>
        <Text style={styles.tituloCategorias}>Categorias</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listaCategorias}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityState={{
              selected: categoriasSelecionadas.length === 0,
            }}
            onPress={() => setCategoriasSelecionadas([])}
            style={[
              styles.botaoCategoria,
              categoriasSelecionadas.length === 0 &&
                styles.categoriaSelecionada,
            ]}
          >
            <Text
              style={[
                styles.textoCategoria,
                categoriasSelecionadas.length === 0 &&
                  styles.textoSelecionado,
              ]}
            >
              Todos
            </Text>
          </Pressable>

          {categorias.map((categoria) => {
            const selecionada =
              categoriasSelecionadas.includes(categoria);

            return (
              <Pressable
                key={categoria}
                accessibilityRole="button"
                accessibilityState={{ selected: selecionada }}
                onPress={() => alternarCategoria(categoria)}
                style={[
                  styles.botaoCategoria,
                  selecionada && styles.categoriaSelecionada,
                ]}
              >
                <Text
                  style={[
                    styles.textoCategoria,
                    selecionada && styles.textoSelecionado,
                  ]}
                >
                  {categoria}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        style={styles.listaProfissionais}
        data={profissionaisFiltrados}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <ProfissionalItem
            dadosProfissional={item}
            selecionarServico={() =>
              router.push({
                pathname: "/profissional/detalhes",
                params: { id: item.id.toString() },
              })
            }
          />
        )}
        ListEmptyComponent={
          <Text style={styles.listaVazia}>
            Nenhum profissional encontrado.
          </Text>
        }
      />

      <BotaoCadastrarProfissional
        onPress={() => router.push("/profissional/cadastro")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 2,
    margin: 20,
    borderRadius: 10,
  },

  marcaAchae: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  conteudoMarcaAchae: {
    flex: 1,
  },

  nomeMarca: {
    color: "#2563EA",
    fontSize: 17,
  },

  secaoCategorias: {
    paddingTop: 16,
    paddingBottom: 15,
  },

  tituloCategorias: {
    marginHorizontal: 20,
    marginBottom: 10,
  },

  listaCategorias: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 8,
  },

  botaoCategoria: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DDD9CE",
    backgroundColor: "#FFFFFF",
  },

  categoriaSelecionada: {
    backgroundColor: "#2563EA",
    borderColor: "#2563EA",
  },

  textoCategoria: {
    color: "#333333",
    fontSize: 14,
  },

  textoSelecionado: {
    color: "#FFFFFF",
  },

  listaProfissionais: {
    flex: 1,
  },

  listaVazia: {
    textAlign: "center",
    marginTop: 24,
    marginHorizontal: 20,
    color: "#666666",
  },
});
