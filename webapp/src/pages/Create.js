import React, { useState, useReducer, useEffect, useContext } from "react";
import styles from "./../styles/page/Create.module.scss";
import { Container, Row, Form, Col, Button } from "react-bootstrap";
import FormOne from "../components/admin/addGame";
import PDFInstructionsForm from "../components/admin/addGame/PDFInstructionsForm";
import { initialState, newGameReducer } from "../components/helper/reducer";
import { sendGameData } from "../components/services/airtable";
import { useNavigate } from "react-router-dom";
import Loader from "../pages/Loader";
import { AdminAuthContext } from "../components/auth/AdminAuth";
const Create = () => {
  const { isLoggedIn } = useContext(AdminAuthContext);
  const navigate = useNavigate(); // Initialize the navigate function
  const [state, dispatch] = useReducer(newGameReducer, initialState);
  const [dublicateValue, setDublicateValue] = useState(false);
  const [isNext, setIsNext] = useState(false); // Add state for submit button text
  const [pdf, setPDFIns] = useState([null]);
  const [rolePdf, setRolePDFIns] = useState([null]);
  const [loader, setLoader] = useState(false);
  const [roleInputs, setRoleInputs] = useState([
    { role: "" }, // Initial state with an empty role
  ]);

  const [role, setRole] = useState("");

  const handlePDFInstruction = (level, role, file, roleIndex) => {
    let array = pdf;
    const uniqueFilename = generateUniqueFilename(role, level, ".pdf");
    const modifiedFile = new File([file], uniqueFilename, {
      type: "application/pdf",
    });
    const index = roleIndex * state.roleValues.length + level;
    array[index - 1] = modifiedFile;
    setPDFIns(array);
    dispatch({
      type: "SET_DUMMY",
      payload: roleIndex * state.roleValues.length + level,
    });
  };
  const handleRolePDFInstruction = (level, role, file) => {
    let array = rolePdf;
    const uniqueFilename = generateUniqueFilename(role, level, ".pdf");
    const modifiedFile = new File([file], uniqueFilename, {
      type: "application/pdf",
    });
    array[level] = modifiedFile;
    setRolePDFIns(array);
    dispatch({
      type: "SET_DUMMY",
      payload: level,
    });
  };

  const generateUniqueFilename = (role, pdfIndex, extension) => {
    return `${state.gameName}_${role}_Level${pdfIndex}${extension}`;
  };

  const handleDropdownChange = (e, actionType) => {
    dispatch({
      type: actionType,
      payload: e.target.value,
    });
  };

  const formatDataForAirtable = () => {
    const formData = new FormData();

    formData.append(
      `data`,
      JSON.stringify({
        GameName: state.gameName,
        NumberOfRounds: state.rounds,
        GoogleSheet: state.excel,
        resultsSubmission: state.result,
        ScoreVisibility: state.scoreVisibility,
        RoleSelection: state.allowAutoSelection,
        IndividualInstructions: state.individualInstructions,
      }),
    );

    formData.append(`pdf`, pdf);

    pdf.forEach((pdf) => {
      formData.append("pdf", pdf);
    });
    formData.append("pdf", state.gameInstructions);
    formData.append("pdf", state.levelInstruction);

    formData.append("roles", JSON.stringify(state.roleValues));

    return formData;
  };

  const handleCheckboxChange = (value, actionType) => {
    dispatch({
      type: actionType,
      payload: !value,
    });
  };
  const handleLevelPDF = (file, actionType) => {
    const modifiedFile = new File(
      [file],
      `${state.gameName}_LevelInstruction.pdf`,
      {
        type: "application/pdf",
      },
    );
    dispatch({
      type: actionType,
      payload: modifiedFile,
    });
  };
  const handlePDFChange = (file, actionType) => {
    const modifiedFile = new File(
      [file],
      `${state.gameName}_GameInstruction.pdf`,
      {
        type: "application/pdf",
      },
    );
    dispatch({
      type: actionType,
      payload: modifiedFile,
    });
  };

  const handleInputChange = (index, role, dublicate, submit) => {
    dispatch({
      type: "SET_ROLE_VALUES",
      payload: { index, role, dublicate, submit },
    });
  };
  const next = async (event) => {
    event.preventDefault();
    if (isNext) {
      const formattedData = formatDataForAirtable();
      try {
        setLoader(true);
        await sendGameData(formattedData);
        navigate("/list");
      } catch (error) {
        console.error("Error sending data to Airtable:", error);
      }
    } else {
      const {
        gameName,
        rounds,
        excel,
        gameInstructions,
        result,
        scoreVisibility,
        roleValues,
      } = state;

      const isValid =
        gameName.trim() !== "" &&
        roleValues.length > 1 &&
        excel.trim() !== "" &&
        gameInstructions !== null &&
        result !== "" &&
        scoreVisibility !== "" &&
        rounds != 0;

      if (isValid) {
        setIsNext(!isNext);
      } else {
        alert("Form is not valid. Please fill in all required fields.");
      }
    }
  };

  const cancel = () => {
    if (isNext) {
      setIsNext(!isNext);
    } else {
      navigate("/dashboard");
    }
  };

  const handleAddRoleClick = () => {
    const roleValues = state.roleValues;
    const lastInputValue = roleValues[roleValues.length - 1];
    if (
      lastInputValue !== "" &&
      !roleValues.slice(0, roleValues.length - 1).includes(lastInputValue)
    ) {
      const newRoleInputs = [...roleInputs, { role: "" }];
      setRoleInputs(newRoleInputs);
      setDublicateValue(false);
    } else {
      setDublicateValue(true);
    }
  };
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/admin");
    }
  }, []);

  return (
    <>
      {!loader ? (
        <Container>
          <Form>
            <Row className={`justify-content-center mt-5 ${styles.pageTitle}`}>
              <h2>New game</h2>
            </Row>
            <Row className={`justify-content-center ${styles.sectionTitle}`}>
              {!isNext ? (
                <div className=''>Basic Information</div>
              ) : (
                <div
                  style={{
                    display: !state.individualInstructions ? "none" : "flex",
                  }}>
                  <Col md={3}>Game roles</Col>
                  <Col md={3}>Role briefing</Col>
                  <Col>Instructions</Col>
                </div>
              )}
            </Row>
            {!isNext ? (
              <FormOne
                state={state}
                handleDropdownChange={handleDropdownChange}
                handlePDFChange={handlePDFChange}
                handleCheckboxChange={handleCheckboxChange}
                roleInputs={roleInputs}
                handleInputChange={handleInputChange}
                handleAddRoleClick={handleAddRoleClick}
              />
            ) : (
              <PDFInstructionsForm
                handleRolePDFInstruction={handleRolePDFInstruction}
                handlePDFInstruction={handlePDFInstruction}
                handleInputChange={handleInputChange}
                storedState={state}
                setRole={setRole}
                pdf={pdf}
                rolePdf={rolePdf}
                handleLevelPDF={handleLevelPDF}
              />
            )}
            <div className={`fixed-bottom pb-5`}>
              <Row className='justify-content-end'>
                <Col md={3} className='text-right'>
                  <button onClick={cancel} className={styles.cancelButton}>
                    {!isNext ? "Cancel" : "Go Back"}
                  </button>
                  <button onClick={next} className={styles.nextButton}>
                    {!isNext ? "Next" : "Submit"}
                  </button>{" "}
                </Col>
              </Row>
            </div>
          </Form>
        </Container>
      ) : (
        <Loader />
      )}
    </>
  );
};
export default Create;
