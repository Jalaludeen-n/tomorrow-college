import React, { useState, useEffect } from "react";
import "../styles/components/admin/index.scss";
import RolePDFUpload from "../components/admin/roles";
import { sendDataToAirtable } from "../components/services/airtable";
import SuccessPopup from "../components/admin/SuccessPopup";

const Create = () => {
  // State for the first half of the form
  const [gameName, setGameName] = useState("");
  const [numRounds, setNumRounds] = useState(0);
  const [excelLink, setExcelLink] = useState("");
  const [resultsSubmission, setResultsSubmission] = useState("");
  const [scoreVisibility, setScoreVisibility] = useState("");
  const [allowAutoSelection, setAllowAutoSelection] = useState(false);
  const [individualInstructions, setIndividualInstructions] = useState(false);
  const [formData, setFormData] = useState(new FormData());
  const [individualPdf, setIndividualPdf] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [levels, setLevels] = useState([]);

  const handleFormDataChange = (newFormData) => {
    setFormData(...newFormData);
  };

  const handleSubmit = async () => {
    const formattedData = formatDataForAirtable(levels);

    try {
      await sendDataToAirtable(formattedData); // Send data to Airtable
      console.log("Data successfully sent to Airtable");
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Error sending data to Airtable:", error);
    }
  };

  useEffect(() => {
    if (showSuccessPopup) {
      const redirectTimeout = setTimeout(() => {
        window.location.href = "/"; // Redirect to the home page after a delay
      }, 5000); // Delay in milliseconds (5 seconds)
      return () => {
        clearTimeout(redirectTimeout);
      };
    }
  }, [showSuccessPopup]);

  // Format your data according to Airtable schema
  const formatDataForAirtable = (levels) => {
    const formData = new FormData();

    formData.append(
      `data`,
      JSON.stringify({
        GameName: gameName,
        NumberOfRounds: numRounds,
        GoogleSheet: excelLink,
        ResultsSubbmision: resultsSubmission,
        ScoreVisibility: scoreVisibility,
        RoleSelection: allowAutoSelection,
        IndividualInstructions: individualInstructions,
      }),
    );

    // Create FormData and append each data entry separately

    levels.forEach((level) => {
      if (!individualInstructions) {
        formData.append("pdf", individualPdf);
      } else {
        level.pdfs.forEach((pdf) => {
          formData.append("pdf", pdf);
        });
      }
      const role = {
        role: level.role,
        checked: level.checked,
      };
      formData.append("roles", JSON.stringify(role));
    });

    return formData;
  };

  // Dropdown options
  const resultsSubbmision = [
    { value: "", label: "Results subbmision" },
    {
      value: "Each member does  their own subbmision",
      label: "Each member does  their own subbmision",
    },
    {
      value: "Each group member can submit  group answer",
      label: "Each group member can submit  group answer",
    },
    {
      value: "Only one peson can submit group answer",
      label: "Only one peson can submit group answer",
    },
  ];
  const scoreVisibilityForPlayers = [
    { value: "", label: "Score visibility for players" },
    { value: "See others score", label: "See others score" },
    { value: "See score per round", label: "See score per round" },
    { value: "See score only in the end", label: "See score only in the end" },
  ];

  // Event handlers
  const handleDropdownChange = (event, setStateFunction) => {
    setStateFunction(event.target.value);
  };

  const handleCheckboxChange = (setStateFunction) => {
    setStateFunction((prevState) => !prevState);
  };
  const handlePDFChange = (file) => {
    const modifiedFile = new File([file], "individualPdf.pdf", {
      type: "application/pdf",
    });
    setIndividualPdf(modifiedFile);
  };

  return (
    <>
      <div className='container'>
        <div className='half'>
          <h2>Game Settings</h2>
          <div className='input-group'>
            <label>Game Name:</label>
            <input
              type='text'
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
            />
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
            <input
              type='text'
              value={excelLink}
              onChange={(e) => setExcelLink(e.target.value)}
            />
          </div>
          <div className='input-group'>
            <label>Results Submission:</label>
            <select
              value={resultsSubmission}
              onChange={(e) => handleDropdownChange(e, setResultsSubmission)}>
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
              onChange={(e) => handleDropdownChange(e, setScoreVisibility)}>
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
          {!individualInstructions && (
            <div className='checkbox-group'>
              <input
                type='file'
                accept='.pdf'
                onChange={(e) => handlePDFChange(e.target.files[0])}
              />
            </div>
          )}
        </div>
        <div className='half'>
          <RolePDFUpload
            levels={levels}
            setLevels={setLevels}
            pdfCount={numRounds}
            resultsSubmission={resultsSubmission}
            individualInstructions={individualInstructions}
          />
        </div>
      </div>
      <button onClick={handleSubmit}> submit</button>
      {showSuccessPopup && (
        <SuccessPopup
          name={gameName}
          onClose={() => setShowSuccessPopup(false)}
        />
      )}
    </>
  );
};

export default Create;
