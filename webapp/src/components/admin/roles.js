import React, { useState } from "react";

const RolePDFUpload = ({
  levels,
  setLevels,
  pdfCount,
  resultsSubmission,
  individualInstructions,
}) => {
  const handleAddLevel = () => {
    setLevels([
      ...levels,
      {
        role: "",
        pdfs: Array.from({ length: pdfCount }, () => null),
        checked: false,
      },
    ]);
  };
  const formData = new FormData();

  const handleRoleChange = (index, value) => {
    const newLevels = [...levels];
    newLevels[index].role = value;
    setLevels(newLevels);
  };

  const handlePDFChange = (levelIndex, pdfIndex, file) => {
    const newLevels = [...levels];
    const uniqueFilename = generateUniqueFilename(
      newLevels[levelIndex].role,
      pdfIndex,
      ".pdf",
    );
    const modifiedFile = new File([file], uniqueFilename, {
      type: "application/pdf",
    });
    newLevels[levelIndex].pdfs[pdfIndex] = modifiedFile;
    setLevels(newLevels);
  };

  const handleCheckboxChange = (index, value) => {
    const newLevels = [...levels];
    newLevels[index].checked = value;
    setLevels(newLevels);
  };
  const generateUniqueFilename = (role, pdfIndex, originalFilename) => {
    const sanitizedRole = role.replace(/\s+/g, "_"); // Replace spaces with underscores
    const extension = originalFilename.split(".").pop();
    return `${sanitizedRole}_Level${pdfIndex + 1}.${extension}`;
  };

  return (
    <div className='role-pdf-upload'>
      {pdfCount > 0 &&
        levels.map((level, levelIndex) => (
          <div key={levelIndex} className='level'>
            <input
              type='text'
              value={level.role}
              onChange={(e) => handleRoleChange(levelIndex, e.target.value)}
              placeholder={`Role`}
            />
            {individualInstructions &&
              level.pdfs.map((pdf, pdfIndex) => (
                <input
                  key={pdfIndex}
                  type='file'
                  accept='.pdf'
                  onChange={(e) =>
                    handlePDFChange(levelIndex, pdfIndex, e.target.files[0])
                  }
                />
              ))}
            {resultsSubmission == "Only one person can submit group answer" && (
              <div className='checkbox-group'>
                <input
                  type='checkbox'
                  checked={level.checked}
                  onChange={(e) =>
                    handleCheckboxChange(levelIndex, e.target.checked)
                  }
                />
                <label>This role can only submit the group result</label>
              </div>
            )}
          </div>
        ))}
      <button className='add-level-button' onClick={handleAddLevel}>
        Add Role
      </button>
    </div>
  );
};

export default RolePDFUpload;
