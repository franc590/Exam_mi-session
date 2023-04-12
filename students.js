import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from 'react-native';

export default function components() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');

  useEffect(() => {
    // Charger les données enregistrées sur AsyncStorage
    const loadStudents = async () => {
      try {
        const studentsString = await AsyncStorage.getItem('students');
        if (studentsString) {
          setStudents(JSON.parse(studentsString));
        }
      } catch (error) {
        console.error(error);
      }
    };
    loadStudents();
  }, []);

  const addStudent = async () => {
    if (name && grade) {
      const newStudent = { name, grade };
      const newStudents = [...students, newStudent];
      setStudents(newStudents);
      try {
        // Enregistrer les nouvelles données sur AsyncStorage
        await AsyncStorage.setItem('students', JSON.stringify(newStudents));
      } catch (error) {
        console.error(error);
      }
      setName('');
      setGrade('');
    } else {
      Alert.alert('Erreur', 'Veuillez saisir un nom et une note.');
    }
  };

  const removeStudent = async (index) => {
    const newStudents = students.filter((student, i) => i !== index);
    setStudents(newStudents);
    try {
      // Mettre à jour les données enregistrées sur AsyncStorage
      await AsyncStorage.setItem('students', JSON.stringify(newStudents));
    } catch (error) {
      console.error(error);
      setStudents(JSON.parse(await AsyncStorage.getItem('students')));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saisir les notes de l'étudiant :</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom Complet"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Note sur 20"
        keyboardType="numeric"
        value={grade}
        onChangeText={setGrade}
      />
      <Button title="Valider" onPress={addStudent} />
      <Text style={styles.title}>Liste des étudiants :</Text>
      {students.map((student, index) => (
        <View style={styles.studentContainer} key={index}>
          <Text style={styles.studentText}>{student.name} : {student.grade}/20</Text>
          <TouchableOpacity onPress={() => removeStudent(index)}>
            <MaterialCommunityIcons name="delete" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  studentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  studentText: {
    flex: 1,
  }}) 