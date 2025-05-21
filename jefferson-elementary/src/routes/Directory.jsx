import React, { useState } from 'react';
import DirectoryHeader from '../components/DirectoryHeader';
import DirectoryTabs from '../components/DirectoryTabs';
import DirectoryPersonList from '../components/DirectoryPersonList';
import DirectoryAddPerson from '../components/DirectoryAddPerson';
import "../styles/Directory.css";

const Directory = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);

  // Sample data - will be replaced with Firebase data later
  const [people, setPeople] = useState({
    students: [
      {
        id: 1,
        first_name: 'Emma',
        last_name: 'Johnson',
        type: 'student',
        gradeLevel: 3,
        birthday: "2004-04-21",
        classes: ["Math", "Science"]
      },
      // more students...
    ],
    teachers: [
      {
        id: 101,
        name: 'Mr. Smith',
        type: 'teacher',
        classes: ["Math", "English"]
      },
      // more teachers...
    ]
  });

  const handleAddPerson = (person) => { 
    const newPeople = {...people};
    newPeople[activeTab] = [...newPeople[activeTab], person];
    setPeople(newPeople);
  };

  const handleEditPerson = (updatedPerson) => {
    const newPeople = {...people};
    newPeople[activeTab] = newPeople[activeTab].map(person => 
      person.id === updatedPerson.id ? updatedPerson : person
    );
    setPeople(newPeople);
  };

  const handleDeletePerson = (id) => {
    const newPeople = {...people};
    newPeople[activeTab] = newPeople[activeTab].filter(person => person.id !== id);
    setPeople(newPeople);
  };

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