import React from 'react';
import "../styles/Directory.css";

const gradeLevelMap = {
  0: 'Kindergarten',
  1: '1st Grade',
  2: '2nd Grade',
  3: '3rd Grade',
  4: '4th Grade',
  5: '5th Grade'
};

const DirectoryPersonCard = ({ person, onEdit, onDelete }) => {
  return (
    <div className="person-card">
      <div className="person-info">
        {person.type === 'student' ? (
          <>
            <h3>{person.first_name} {person.last_name}</h3>
            <p>Birth Date: {person.birthday}</p>
            <p>Grade Level: {gradeLevelMap[person.gradeLevel]}</p>
            <p>Classes: {Array.isArray(person.classes) ? person.classes.join(', ') : person.classes}</p>
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