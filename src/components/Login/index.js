import { StatusBar } from 'expo-status-bar';
import React, {useState}from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import firebase from '../../services/firebaseconnection';

export default function Login({data}) {

  const [type, setType] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

 function handleLogin(){
    if(type === 'login'){
      //fazer login
      const user = firebase.auth().signInWithEmailAndPassword(email, password)
      .then((user)=>{
        data(user.user.uid)
      }).catch((error)=>{
          console.log(error)
          alert("PARECE QUE DEU ALGUM ERROR")
          return;
      })
    }else{
      //cadastrando usuario
      const user = firebase.auth().createUserWithEmailAndPassword(email,password)
      .then((user)=>{
        data(user.user.uid)
      }).catch((error)=>{
        console.log(error)
          alert("ERROR AO CADASTRAR")
          return;
      })
    }
  }
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <TextInput style={styles.input}
      value={email}
      placeholder='E-mail'
      onChangeText={(texto) => setEmail(texto)}
      />

      <TextInput style={styles.input}
      placeholder='Password'
      value={password}
      onChangeText={(texto) => setPassword(texto)}
      />

      <TouchableOpacity style={[styles.handleLogin, {backgroundColor: type === 'login' ? "#3ea6f2" : '#141414'}]}
      onPress={handleLogin}
      >
        <Text style={styles.loginText}>{ type === 'login' ? 'Acessar' : 'Cadastrar'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={()=> setType(type => type === 'login' ? "cadastrar" : 'login')}>
        <Text style={{textAlign: 'center'}}>{type === 'login' ? "Criar uma conta" : "já possuo uma conta"}</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f6fc',
    paddingTop: 40,
    paddingHorizontal: 30,
  },
  input:{
    marginBottom: 10,
    backgroundColor: "#FFF",
    borderRadius: 10,
    height: 55,
    padding: 10,
    borderWidth: 1,
    borderColor: "#141414"
  },
  handleLogin:{
    alignItems: 'center',
    justifyContent: 'center',
    height: 55,
    borderRadius: 10,
    marginBottom: 10
  },
  loginText:{
    color: "#FFF",
    fontSize: 18
  }
});
