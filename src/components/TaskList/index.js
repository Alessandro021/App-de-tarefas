import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import Feather from 'react-native-vector-icons/Feather'

export default function TasksList({data, deleteItem, editItem}){
    return(
        <View style={styles.container}>
            <TouchableOpacity style={styles.btn}
                onPress={()=>deleteItem(data.key)}
            >
                <Feather name='trash' color="#FFF" size={30}/>
            </TouchableOpacity>

            <View style={{paddingRight: 10}}>
                <TouchableWithoutFeedback  //sem efeito visual
                    onPress={()=> editItem(data)}
                >
                    <Text style={styles.text} >{data.nome}</Text>
                    
                </TouchableWithoutFeedback>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection: "row",
        backgroundColor: '#141414',
        alignItems: "center",
        marginBottom: 10,
        padding: 10,
        borderRadius: 5
    },
    btn:{
        marginRight: 20, 
        height: 35, 
        alignItems: "center", 
        justifyContent: "center"
    },
    text:{
        color: "#FFF", 
        paddingRight: 10,
        fontSize: 18
    }
})
