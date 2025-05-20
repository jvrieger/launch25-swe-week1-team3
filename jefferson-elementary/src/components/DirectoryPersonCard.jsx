import React from 'react';
import "../styles/Directory.css";

const DirectoryPersonCard = ({ person, onEdit, onDelete }) => {
  return (
    <div className="person-card">
      <div className="person-info">
        <h3>{person.name}</h3>
        {person.type === 'student' ? (
          <>
            <p>Grade: {person.grade}</p>
            <p>Birth Date: {person.birthDate}</p>
          </>
        ) : (
          <>
            <p>Subject: {person.subject}</p>
          </>
        )}
        <p>Contact: {person.contact}</p>
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