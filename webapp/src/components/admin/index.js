import React, { useState } from 'react';
import '../../styles/components/admin/index.scss';
import RolePDFUpload from './roles';
import sendDataToAirtable from '../services/airtable';

const Index = () => {
  // State for the first half of the form
  const [gameName, setGameName] = useState('');
  const [numRounds, setNumRounds] = useState('');
  const [excelLink, setExcelLink] = useState('');
  const [resultsSubmission, setResultsSubmission] = useState('');
  const [scoreVisibility, setScoreVisibility] = useState('');
  const [allowAutoSelection, setAllowAutoSelection] = useState(false);
  const [individualInstructions, setIndividualInstructions] = useState(false);
  const [formData, setFormData] = useState(new FormData());

  const [levels, setLevels] = useState([]);
  const pdfCount = 3; // Define the pdfCount as needed

  const handleFormDataChange = (newFormData) => {
    setFormData(...newFormData);
   
  };



  const handleSubmit = async () => {
    const formattedData = formatDataForAirtable(levels); // Format your data
    console.log(formattedData)

    // try {
    //   await sendDataToAirtable(formattedData); // Send data to Airtable
    //   console.log('Data successfully sent to Airtable');
    // } catch (error) {
    //   console.error('Error sending data to Airtable:', error);
    // }
  };

  // Format your data according to Airtable schema
  const formatDataForAirtable = (levels) => {
    // Format levels data as needed
  
    const formattedData = levels.flatMap((level) =>
  level.pdfs.map((pdf,index) => ({
    fields:{
    GameID: "1234",
    Role: level.role,
    LevelDescription: pdf,
    Level: index+1,
    }
  }))
);

    return formattedData;
  };

  // Dropdown options
  const resultsSubbmision = [
    { value: '', label: 'Results subbmision' },
    { value: 'Each member does  their own subbmision', label: 'Each member does  their own subbmision' },
    { value: 'Each group member can submit  group answer', label: 'Each group member can submit  group answer' },
    { value: 'Only one peson can submit group answer', label: 'Only one peson can submit group answer' },
  ];
  const scoreVisibilityForPlayers = [
    { value: '', label: 'Score visibility for players' },
    { value: 'See others score', label: 'See others score' },
    { value: 'See score per round', label: 'See score per round' },
    { value: 'See score only in the end', label: 'See score only in the end' },
  ];


  // Event handlers
  const handleDropdownChange = (event, setStateFunction) => {
    setStateFunction(event.target.value);
  };

  const handleCheckboxChange = (setStateFunction) => {
    setStateFunction((prevState) => !prevState);
  };

  return (
    <>
    <div className='container'>
    <div className='half'>
      <h2>Game Settings</h2>
      <div className='input-group'>
        <label>Game Name:</label>
        <input type='text' value={gameName} onChange={(e) => setGameName(e.target.value)} />
      </div>
      <div className='input-group'>
        <label>Number of Rounds:</label>
        <input
          type='number'
          value={numRounds}
          onChange={(e) => setNumRounds(e.target.value)}
        />
      </div>
      <div className='input-group'>
        <label>Link to Excel:</label>
        <input type='text' value={excelLink} onChange={(e) => setExcelLink(e.target.value)} />
      </div>
      <div className='input-group'>
        <label>Results Submission:</label>
        <select
          value={resultsSubmission}
          onChange={(e) => handleDropdownChange(e, setResultsSubmission)}
        >
          {resultsSubbmision.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className='input-group'>
        <label>Score Visibility for Players:</label>
        <select
          value={scoreVisibility}
          onChange={(e) => handleDropdownChange(e, setScoreVisibility)}
        >
          {scoreVisibilityForPlayers.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className='checkbox-group'>
        <input
          type='checkbox'
          checked={allowAutoSelection}
          onChange={() => handleCheckboxChange(setAllowAutoSelection)}
        />
        <label>Allow for auto selection role</label>
      </div>
      <div className='checkbox-group'>
        <input
          type='checkbox'
          checked={individualInstructions}
          onChange={() => handleCheckboxChange(setIndividualInstructions)}
        />
        <label>Individual instructions per round</label>
      </div>
    </div>
    <div className='half'>
    <RolePDFUpload levels={levels} setLevels={setLevels} pdfCount={pdfCount} onFormDataChange={handleFormDataChange}/>
         
      </div>

  </div>
        <button onClick={handleSubmit}> submit</button>
        </>

);
};

export default Index;
