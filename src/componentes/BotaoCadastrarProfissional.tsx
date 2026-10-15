import { Feather} from "@expo/vector-icons";
import { Pressable, Text, View} from "react-native";

    export function BotaoCadastrarProfissional (){
        return (
           <View
            style={{
                marginHorizontal: 20,
                marginBottom: 10
            }}
           >
 <Pressable style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#2563EA',
                padding: 10,
                justifyContent: 'center',
                borderRadius: 15
                }}>

                <Feather 
                    name="plus"
                     size={20}
                    color="white"
                /> 
                
                <Text
                style={{
                        color: "white",
                        marginLeft: 8
                    }}
                >Cadastrar profissional</Text>
            </Pressable>

           </View> 
        )
    }