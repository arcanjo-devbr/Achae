import { PropsProfissionalItem } from "@/types/PropsProfissionalItem";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

export function ProfissionalItem({
  dadosProfissional,
  selecionarServico,
}: PropsProfissionalItem) {
  return (
    <View style={styles.container}>
      <View style={styles.dadosIdentificacao}>
        <View style={styles.iconeProfissional}>
          <Feather name="user" size={24} />
        </View>

        <View style={styles.dadosIdentificacaoTextuais}>
          <Text
            style={styles.textoNomeProfissional}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {dadosProfissional.nome}
          </Text>
          <Text
            style={styles.textoProfissao}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {dadosProfissional.profissao}
          </Text>
          <Text
            style={styles.textoLocalizacao}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {dadosProfissional.localizacao}
          </Text>
        </View>
      </View>

      <Pressable style={styles.botaoSelecionar} onPress={selecionarServico}>
        <FontAwesome5 name="chevron-right" size={13} color="black" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#DDD9CE",
  },
  dadosIdentificacao: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    minWidth: 0,
    paddingVertical: 14,
    paddingLeft: 16,
    paddingRight: 8,
  },
  iconeProfissional: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  dadosIdentificacaoTextuais: {
    flexDirection: "column",
    flex: 1,
    minWidth: 0,
  },
  textoProfissao: {
    marginTop: 3,
    color: "#475569",
  },
  textoLocalizacao: {
    marginTop: 2,
    color: "#64748B",
  },
  textoNomeProfissional: {
    fontWeight: "bold",
    color: "#1E293B",
  },
  botaoSelecionar: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});
