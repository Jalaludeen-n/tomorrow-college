import React, { useState } from 'react';

const RolePDFUpload = ({ levels, setLevels, pdfCount,onFormDataChange }) => {
  const handleAddLevel = () => {
    setLevels([...levels, { role: '', pdfs: Array.from({ length: pdfCount }, () => null) }]);
  };
  const formData = new FormData();

  const handleRoleChange = (index, value) => {
    const newLevels = [...levels];
    newLevels[index].role = value;
    setLevels(newLevels);
  };

  const handlePDFChange = (levelIndex, pdfIndex, file) => {
    const newLevels = [...levels];
    newLevels[levelIndex].pdfs[pdfIndex] = new Blob([file], { type: "application/pdf" });
    setLevels(newLevels); 
  };
  
  return (
    <div className="role-pdf-upload">
      {levels.map((level, levelIndex) => (
        <div key={levelIndex} className="level">
          <input
            type="text"
            value={level.role}
            onChange={(e) => handleRoleChange(levelIndex, e.target.value)}
            placeholder={`Role for Level ${levelIndex + 1}`}
          />
          {level.pdfs.map((pdf, pdfIndex) => (
            <input
              key={pdfIndex}
              type="file"
              accept=".pdf"
              onChange={(e) => handlePDFChange(levelIndex, pdfIndex, e.target.files[0])}
            />
          ))}
        </div>
      ))}
      <button className="add-level-button" onClick={handleAddLevel}>
        Add Level
      </button>
    </div>
  );
};

export default RolePDFUpload;
