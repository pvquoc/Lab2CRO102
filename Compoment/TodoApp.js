import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const todosJson = await AsyncStorages.getItem('todos');
        if (todosJson != null) {
          setTodos(JSON.parse(todosJson));
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadTodos();
  }, []);

  useEffect(() => {
    const saveTodos = async () => {
      try {
        await AsyncStorage.setItem('todos', JSON.stringify(todos));
      } catch (e) {
        console.error(e);
      }
    };
    saveTodos();
  }, [todos]);

  const addTodo = () => {
    const newTodo = {
      id: Date.now(),
      title,
      content,
      completed: false,
    };
    setTodos([...todos, newTodo]);
    setTitle('');
    setContent('');
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const editTodo = (id) => {
    const todo = todos.find(todo => todo.id === id);
    setTitle(todo.title);
    setContent(todo.content);
    setEditingId(id);
  };

  const updateTodo = () => {
    setTodos(todos.map(todo => todo.id === editingId ? { ...todo, title, content } : todo));
    setTitle('');
    setContent('');
    setEditingId(null);
  };

  const toggleComplete = (id) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const incompleteCount = todos.length - completedCount;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Todo List</Text>
      <Text>Hoàn thành: {completedCount} | Chưa hoàn thành: {incompleteCount}</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Content"
        value={content}
        onChangeText={setContent}
        multiline
      />
      {editingId ? (
        <Button title="Update Todo" onPress={updateTodo} />
      ) : (
        <Button title="Add Todo" onPress={addTodo} />
      )}
      <FlatList
        data={todos}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.todo}>
            <Text style={styles.todoTitle}>{item.title}</Text>
            <Text>{item.content}</Text>
            <Text>Status: {item.completed ? 'Song' : 'Chưa song'}</Text>
            <View style={styles.todoActions}>
              <Button title={item.completed ? 'Chưa hoàn thành' : 'Đã hoàn thành'} onPress={() => toggleComplete(item.id)} />
              <Button title="Edit" onPress={() => editTodo(item.id)} />
              <Button title="Delete" onPress={() => deleteTodo(item.id)} />
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
   
  // },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  todo: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  todoTitle: {
    fontWeight: 'bold',
  },
  todoActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default TodoApp;
