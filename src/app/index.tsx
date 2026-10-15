import { BotaoCadastrarProfissional } from "@/componentes/BotaoCadastrarProfissional";
import { CampoBuscaItem } from "@/componentes/CampoBuscaItem";
import { ProfissionalItem } from "@/componentes/ProfissionalItem";
import type { Profissional } from "@/types/Profissional";
import { carregarProfissionais } from "@/utils/profissionaisStorage";
import { Feather } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function Index() {
  const [busca, setBusca] = useState("");
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
          console.error("Não foi possível carregar os profissionais.", erro);
        });

      return () => {
        ativo = false;
      };
    }, []),
  );

  const profissionaisFiltrados = profissionais.filter(({ nome, profissao }) => {
    const termoBusca = busca.trim().toLocaleLowerCase();
    return (
      nome.toLocaleLowerCase().includes(termoBusca) ||
      profissao.toLocaleLowerCase().includes(termoBusca)
    );
  });

  return (
    <View style={styles.container}>
      <View style={styles.marcaAchae}>
        <View style={styles.conteudoMarcaAchae}>
          <Text
            style={{
              color: "#2563EA",
              fontSize: 17,
            }}
          >
            Achaê
          </Text>
          <Text>Encontre profissionais</Text>
        </View>
        <Feather name="users" size={24} color={"#2563EA"} />
      </View>

      <CampoBuscaItem buscaValor={busca} setBuscaValor={setBusca} />

      <View
        style={{
          marginLeft: 12,
        }}
      >
        <View>
          <Text>Categorias</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 15,
            paddingTop: 1,
            paddingBottom: 15,
          }}
        >
          <Text style={styles.elementosNecessidadeServico}>Todos</Text>
          <Text style={styles.elementosNecessidadeServico}>Elétrica</Text>
          <Text style={styles.elementosNecessidadeServico}>Hidráulica</Text>
          <Text style={styles.elementosNecessidadeServico}>Pintura</Text>
        </View>
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
                params: {
                  id: item.id.toString(),
                },
              })
            }
          />
        )}
      />

      <BotaoCadastrarProfissional
        onPress={() => router.push("/profissional/cadastro")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  categorias: {
    paddingTop: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingBottom: 15,
  },
  conteudoMarcaAchae: {
    flex: 0.89999,
  },
  elementosNecessidadeServico: {
    backgroundColor: "#DDD9CE",
    borderRadius: 10,
    marginTop: 10,
  },
});
