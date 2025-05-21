import React from 'react';
import "../styles/Directory.css";

const DirectoryHeader = ({ onAddClick }) => {
  return (
    <div className="directory-header">
      <h1>Thomas Jefferson Elementary Directory</h1>
      <button 
        className="btn btn-primary"
        onClick={onAddClick}
      >
        Add New
      </button>
    </div>
  );
};

export default DirectoryHeader;