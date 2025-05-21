import React from 'react';
import DirectoryPersonCard from './DirectoryPersonCard';
import "../styles/Directory.css";

const DirectoryPersonList = ({ people, onEdit, onDelete }) => {
  return (
    <div className="person-list">
      {people.length === 0 ? (
        <p className="empty-message">No records found</p>
      ) : (
        people.map(person => (
          <DirectoryPersonCard
            key={person.id}
            person={person}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
};

export default DirectoryPersonList;