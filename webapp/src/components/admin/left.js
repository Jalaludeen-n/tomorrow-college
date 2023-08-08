// ... (imports and previous code)
import React, { useState } from 'react';
import '../../styles/components/admin/index.scss';

const AdminPageLeft = () => {
    const [gameName, setGameName] = useState('');
    const [numRounds, setNumRounds] = useState('');
    const [excelLink, setExcelLink] = useState('');
    const [resultsSubmission, setResultsSubmission] = useState('');
    const [scoreVisibility, setScoreVisibility] = useState('');
    const [allowAutoSelection, setAllowAutoSelection] = useState(false);
    const [individualInstructions, setIndividualInstructions] = useState(false);
  
    const dropdownOptions = [
      { value: '', label: 'Select an option' },
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ];
  
    const handleDropdownChange = (event, setStateFunction) => {
      setStateFunction(event.target.value);
    };
  
    const handleCheckboxChange = (setStateFunction) => {
      setStateFunction((prevState) => !prevState);
    };
  
    return (
      <div className='admin-container'>
        <div className='form-container'>
          <h2>Game Settings</h2>
          <input
            type='text'
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            placeholder='Game name'
          />
          <input
            type='number'
            value={numRounds}
            onChange={(e) => setNumRounds(e.target.value)}
            placeholder='Number of Rounds'
          />
          <input
            type='text'
            value={excelLink}
            onChange={(e) => setExcelLink(e.target.value)}
            placeholder='Link to Excel'
          />
          <select
            value={resultsSubmission}
            onChange={(e) => handleDropdownChange(e, setResultsSubmission)}
          >
            {dropdownOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={scoreVisibility}
            onChange={(e) => handleDropdownChange(e, setScoreVisibility)}
          >
            {dropdownOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <label>
            <input
              type='checkbox'
              checked={allowAutoSelection}
              onChange={() => handleCheckboxChange(setAllowAutoSelection)}
            />
            Allow for auto selection role
          </label>
          <label>
            <input
              type='checkbox'
              checked={individualInstructions}
              onChange={() => handleCheckboxChange(setIndividualInstructions)}
            />
            Individual instructions per round
          </label>
        </div>
        {/* ... */}
      </div>
    );
  };
  
  export default AdminPageLeft;  