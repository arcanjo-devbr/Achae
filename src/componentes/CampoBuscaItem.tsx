import { Ionicons } from "@expo/vector-icons"
import { TextInput, View } from "react-native"

export function CampoBuscaItem(
        {buscaValor, setBuscaValor} : 
        {buscaValor: string, setBuscaValor: React.Dispatch<React.SetStateAction<string>>}
    ) {
    return (
        <View style={{
             position: 'relative'
        }}>
        <TextInput 
            placeholder="Buscar por nome ou profissão..."
            onChangeText={setBuscaValor}
            value={buscaValor}
            style={{
                paddingLeft:40,
                borderWidth: 1,
                padding: 10,
                margin: 10,
                borderRadius: 10,
                color: '#DDD9CE',
                borderColor: '#DDD9CE',
            }}
        />
      <Ionicons name="search" style={{
        position:'absolute',
        top: "50%",
        transform:[{translateY: -10}],
        left: 22
        }}
        size={20}
        />
</View>
    )
}