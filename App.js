import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState, useRef}from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, FlatList, Keyboard } from 'react-native';
import Login from './src/components/Login';
import TasksList from './src/components/TaskList';
import firebase from './src/services/firebaseconnection';
import Feather from 'react-native-vector-icons/Feather'


export default function App() {

  const inputRef = useRef(null)
  const [key, setKey] = useState('');
  const [user,setUser] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [newTesk, setNewTesk] = useState('');

  useEffect(() => {
    function getUser(){
      if(!user){
        return
      }

      firebase.database().ref('tarefas').child(user).once('value', (snapshot) => {
        setTasks([]);

        snapshot?.forEach((childItem) => {
          let data = {
            key: childItem.key,
            nome: childItem.val().nome
          }
          setTasks(oldTasks => [...oldTasks, data])

        })
      })
    }

    getUser();
  },[user])

  function cancelEdit(){
    setKey('')
    setNewTesk('')
    Keyboard.dismiss();
  }

  function handleDelete(key){
    firebase.database().ref('tarefas').child(user).child(key).remove()
    .then(() => {
      const removerTarefa = tasks.filter( item => item.key !== key)
      setTasks(removerTarefa)
      setNewTesk('')
      setKey('')
    })
  }

  function handleEdit(data){
    setKey(data.key)
    setNewTesk(data.nome)
    inputRef.current.focus();
  }
  function handleAdd(){
    if(newTesk === ''){
      return
    }

    //usuario quer editar uma tarefa
    if(key !== ''){
      firebase.database().ref('tarefas').child(user).child(key).update({
        nome: newTesk
      }).then(()=>{
        const tarefaIndex = tasks.findIndex((item) => item.key === key)
        const tarefaClone = tasks;
        tarefaClone[tarefaIndex].nome = newTesk

        setTasks([...tarefaClone])
      })

      setNewTesk('');
      setKey('')
      Keyboard.dismiss();
      return;
    }

    let tarefas = firebase.database().ref('tarefas').child(user);
    let chave = tarefas.push().key;
    tarefas.child(chave).set({
      nome: newTesk,

    })
    .then(()=>{
      const data = {
        key: chave,
        nome: newTesk
      }
    setTasks(oldTasks => [...oldTasks, data])
    Keyboard.dismiss();
    }).catch((error)=>{
      alert("ERRO AO CRIAR TAREFA")
    })

    setNewTesk('')
  }


  if(!user){
    return <Login data={(user) => setUser(user)}/>
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      { key.length > 0 && 
      (
        <View style={{flexDirection: 'row', marginBottom: 10}}>
        <TouchableOpacity 
          onPress={cancelEdit}
        >
            <Feather name='x-circle' size={25} color='#FF0000'/>
        </TouchableOpacity>
          <Text style={{marginLeft: 10, color: '#ff0000'}}>Você esta editando uma tarefa</Text>

      </View>

      )}
      
      <View style={styles.containerTarefas}>
        <TextInput style={styles.input}
        placeholder='Qual é a sua proxima tarefa?'
        value={newTesk}
        onChangeText={(tarefa) => setNewTesk(tarefa)}
        ref={inputRef}

        />
        <TouchableOpacity style={styles.buttonAdd}
          onPress={handleAdd}
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList 
      data={tasks}
      keyExtractor={(item)=> item.key}
      renderItem={({item}) => <TasksList data={item} deleteItem={handleDelete} editItem={handleEdit}/>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f6fc',
    paddingTop: 30,
    paddingHorizontal: 10,
    marginTop: 30,
    marginHorizontal: 10

  },
  containerTarefas:{
    flexDirection: 'row',
    // marginTop: 30

  },
  input:{
    flex: 1,
    marginBottom: 10,
    paddingLeft: 20,
    backgroundColor: "#FFF",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#141414",
    height: 55
  },
  buttonAdd:{
    backgroundColor: "#141414",
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
    paddingHorizontal: 25,
    borderRadius: 5
  },
  buttonText:{
    color: "#FFF",
    fontSize: 30
  }
});
