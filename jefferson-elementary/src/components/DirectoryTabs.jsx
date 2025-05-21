import React from 'react';
import "../styles/Directory.css";

const DirectoryTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="directory-tabs">
      <button
        className={`tab ${activeTab === 'students' ? 'active' : ''}`}
        onClick={() => onTabChange('students')}
      >
        Students
      </button>
      <button
        className={`tab ${activeTab === 'teachers' ? 'active' : ''}`}
        onClick={() => onTabChange('teachers')}
      >
        Teachers
      </button>
    </div>
  );
};

export default DirectoryTabs;