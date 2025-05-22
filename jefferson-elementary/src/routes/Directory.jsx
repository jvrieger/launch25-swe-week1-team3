import React, { useState, useEffect } from 'react';
import DirectoryHeader from '../components/DirectoryHeader';
import DirectoryTabs from '../components/DirectoryTabs';
import DirectoryPersonList from '../components/DirectoryPersonList';
import DirectoryAddPerson from '../components/DirectoryAddPerson';
import "../styles/Directory.css";
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase'

const Directory = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [people, setPeople] = useState({
    students: [],
    teachers: []
  });

  // Fetch Data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch students
        const studentsSnapshot = await getDocs(collection(db, 'students'));
        const studentsData = studentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Fetch teachers
        const teachersSnapshot = await getDocs(collection(db, 'teachers'));
        const teachersData = teachersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setPeople({
          students: studentsData,
          teachers: teachersData
        });
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleAddPerson = (personWithId) => {
    const newPeople = { ...people };
    newPeople[activeTab] = [...newPeople[activeTab], personWithId];
    setPeople(newPeople);
  };


  const handleEditPerson = async (updatedPerson) => {
    try {
      const collectionName = activeTab; // 'students' or 'teachers'
      const personRef = doc(db, collectionName, updatedPerson.id);
      await updateDoc(personRef, updatedPerson);
      
      // Update local state
      const newPeople = { ...people };
      newPeople[activeTab] = newPeople[activeTab].map(person => 
        person.id === updatedPerson.id ? updatedPerson : person
      );
      setPeople(newPeople);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleDeletePerson = async (id) => {
    try {
      const collectionName = activeTab;
      await deleteDoc(doc(db, collectionName, id));
      
      // Update local state
      const newPeople = { ...people };
      newPeople[activeTab] = newPeople[activeTab].filter(person => person.id !== id);
      setPeople(newPeople);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }
  
  return (
    <div className="directory-container">
      <DirectoryHeader 
        onAddClick={() => {
          setEditingPerson(null);
          setIsModalOpen(true);
        }}
      />
      
      <DirectoryTabs 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      
      <DirectoryPersonList 
        people={people[activeTab]} 
        onEdit={(person) => {
          setEditingPerson(person);
          setIsModalOpen(true);
        }}
        onDelete={handleDeletePerson}
      />
      
      <DirectoryAddPerson 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={editingPerson ? handleEditPerson : handleAddPerson}
        personType={activeTab.slice(0, -1)} // removes the 's' (students -> student)
        initialData={editingPerson}
      />
    </div>
  );
};

export default Directory;