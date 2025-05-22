import React, { useEffect, useState } from 'react';
import "../styles/Directory.css";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";


const gradeLevelMap = {
  0: 'Kindergarten',
  1: '1st Grade',
  2: '2nd Grade',
  3: '3rd Grade',
  4: '4th Grade',
  5: '5th Grade'
};

const DirectoryPersonCard = ({ person, onEdit, onDelete }) => {
  const [classMap, setClassMap] = useState({});

  // to use classId to get classDescription to display
  useEffect(() => {
    const fetchClasses = async () => {
      const snapshot = await getDocs(collection(db, "classes"));
      const map = {};
      snapshot.forEach(doc => {
        const data = doc.data();
        map[doc.id] = data.subject; 
      });
      setClassMap(map);
    };
    fetchClasses();
  }, []);

  const getClassDescriptions = (ids) => {
    if (!Array.isArray(ids)) return ids;
    return ids.map(id => classMap[id] || id).join(', ');
  };

  return (
    <div className="person-card">
      <div className="person-info">
        {person.type === 'student' ? (
          <>
            <h3>{person.first_name} {person.last_name}</h3>
            <p>Birth Date: {person.birthday}</p>
            <p>Grade Level: {gradeLevelMap[person.gradeLevel]}</p>
            <p>Classes: {getClassDescriptions(person.classes)}</p>
          </>
        ) : (
          <>
            <h3>{person.name}</h3>
            <p>Classes: {Array.isArray(person.classes) ? person.classes.join(', ') : person.classes}</p>
          </>
        )}
      </div>
      <div className="person-actions">
        <button 
          className="btn btn-edit"
          onClick={() => onEdit(person)}
        >
          Edit
        </button>
        <button 
          className="btn btn-delete"
          onClick={() => onDelete(person.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DirectoryPersonCard;