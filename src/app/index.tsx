import { View, Text, FlatList, StyleSheet} from "react-native";
import {useState} from "react";
import { profissionais } from "@/data/profissionais";
import { CampoBuscaItem } from "@/componentes/CampoBuscaItem";
import { ProfissionalItem } from "@/componentes/ProfissionalItem";
import { router } from "expo-router";
import {Feather} from "@expo/vector-icons";
import { BotaoCadastrarProfissional } from "@/componentes/BotaoCadastrarProfissional";

export default function Index() {
    const [busca, setBusca] = useState("");

    const profissionaisFiltrados = profissionais.filter(
      ({nome, profissao}) => {
        return (
           nome.includes(busca) || 
           profissao.includes(busca)
        )
      }
    )


    return (

      <View style={styles.container}>

          <View style={styles.marcaAchae}>
              <View style={styles.conteudoMarcaAchae}>
                  <Text style={{
                    color: '#2563EA',
                    fontSize:17
                    }}>Achaê</Text>
                  <Text>Encontre profissionais</Text>
              </View>
              <Feather name="users" size={24} color={'#2563EA'}/>


          </View>

          <CampoBuscaItem buscaValor={busca} setBuscaValor={setBusca}/>

      <View style={{
       marginLeft: 12
      }}>
         <View>

              <Text>
                Categorias
              </Text>

        </View>
        <View style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 15,
            paddingTop: 1,
            paddingBottom: 15
        }}>
          <Text style={styles.elementosNecessidadeServico}>Todos</Text>
          <Text style={styles.elementosNecessidadeServico}>Elétrica</Text>
          <Text style={styles.elementosNecessidadeServico}>Hidráulica</Text>
          <Text style={styles.elementosNecessidadeServico}>Pintura</Text>
        </View>
      </View>
         
          <FlatList 
            data={profissionaisFiltrados}
            keyExtractor={(item) => String(item.id)}
            renderItem={
              
              ({item}) => (
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
              )
          
          
          }
          />

            <BotaoCadastrarProfissional/>

      </View>
      
    )
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    margin: 20,
    borderRadius: 10
  },
  marcaAchae:{
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    justifyContent: 'center'
  },
  categorias: {
    paddingTop: 1,
    justifyContent:'center',
    alignItems:'center',
    flexDirection: 'row',
    paddingBottom: 15
  },
  conteudoMarcaAchae:{
    flex: 0.89999
  },
  elementosNecessidadeServico:{
    backgroundColor: '#DDD9CE',
    borderRadius: 10,
    marginTop: 10
  }
})