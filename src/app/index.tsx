import { BotaoCadastrarProfissional } from "@/componentes/BotaoCadastrarProfissional";
import { CampoBuscaItem } from "@/componentes/CampoBuscaItem";
import { ProfissionalItem } from "@/componentes/ProfissionalItem";
import { profissionais } from "@/data/profissionais";
import { Profissional } from "@/types/Profissional";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
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
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<
    string[]
  >([]);

  const profissionaisFiltrados = profissionais.filter(
    ({ nome, profissao, categoria }: Profissional) => {
      const termoBusca = busca.trim().toLocaleLowerCase();
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

      <CampoBuscaItem buscaValor={busca} setBuscaValor={setBusca} />

      <View style={styles.secaoCategorias}>
        <Text>Categorias</Text>
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
                categoriasSelecionadas.length === 0 && styles.textoSelecionado,
              ]}
            >
              Todos
            </Text>
          </Pressable>
          {categorias.map((categoria) => {
            const selecionada = categoriasSelecionadas.includes(categoria);

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
          <Text style={styles.listaVazia}>Nenhum profissional encontrado.</Text>
        }
      />

      <BotaoCadastrarProfissional />
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
  },
  conteudoMarcaAchae: {
    flex: 0.9,
  },
  nomeMarca: {
    color: "#2563EA",
    fontSize: 17,
  },
  secaoCategorias: {
    marginLeft: 12,
  },
  listaCategorias: {
    alignItems: "center",
    gap: 8,
    paddingTop: 8,
    paddingBottom: 16,
    paddingRight: 12,
  },
  botaoCategoria: {
    backgroundColor: "#E8ECF2",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  categoriaSelecionada: {
    backgroundColor: "#2563EA",
  },
  textoCategoria: {
    color: "#334155",
    fontSize: 14,
  },
  textoSelecionado: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  listaVazia: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    color: "#64748B",
    textAlign: "center",
  },
});
