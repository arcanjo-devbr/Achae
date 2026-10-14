import { PropsProfissionalItem } from "@/types/PropsProfissionalItem";
import {View, StyleSheet, Text, Pressable} from 'react-native';
import {Feather, FontAwesome5} from '@expo/vector-icons';

export function ProfissionalItem({dadosProfissional, selecionarServico} : PropsProfissionalItem){
    return (
        <View style={styles.container}>

        <View style={styles.dadosIdentificacao}>

            <Feather name="user" size={24} style={{flex: 0.3}}/>

            <View style={styles.dadosIdentificacaoTextuais}>
                <Text style={styles.textoNomeProfissional}>{dadosProfissional.nome} </Text>
                <Text style={styles.textoPivoEspacamento}>{dadosProfissional.profissao} </Text>
                <Text>{dadosProfissional.localizacao} </Text>
            </View>
        </View>

        
            <Pressable onPress={selecionarServico}>
               <FontAwesome5 name="chevron-right" size={13} color="black" />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#DDD9CE'
    },
    dadosIdentificacao: {
        flexDirection: 'row',
        alignItems: 'center',
        flex:0.9,
        padding: 20
    },
    dadosIdentificacaoTextuais: {
        flexDirection: 'column'
    },
    textoPivoEspacamento: {
        marginVertical: 5
    },
    textoNomeProfissional: {
        fontWeight: 'bold'
    },
    textoDadosProfissional: {
        flex: 1
    }


});