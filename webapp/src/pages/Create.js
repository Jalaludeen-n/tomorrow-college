import React, { useState, useReducer } from "react";
import "./../styles/page/create.scss";
import { Container, Row, Form, Col, Button } from "react-bootstrap";
import FormOne from "../components/admin/addGame";
import PDFInstructionsForm from "../components/admin/addGame/PDFInstructionsForm";
import { initialState, newGameReducer } from "../components/helper/reducer";
import { sendDataToAirtable } from "../components/services/airtable";

const Create = () => {
  const storedState =
    JSON.parse(localStorage.getItem("formState")) || initialState;
  const [state, dispatch] = useReducer(newGameReducer, storedState);
  const [dublicateValue, setDublicateValue] = useState(false);
  const [isNext, setIsNext] = useState(false); // Add state for submit button text
  const [pdf, setPDFIns] = useState([null]);
  const [roleInputs, setRoleInputs] = useState([
    <Form.Control key={0} type='text' placeholder='Role name here' />,
  ]);

  const handlePDFInstruction = (level, role, file, roleIndex) => {
    const array = pdf;
    const uniqueFilename = generateUniqueFilename(role, level, ".pdf");
    const modifiedFile = new File([file], uniqueFilename, {
      type: "application/pdf",
    });
    const index = roleIndex * storedState.roleValues.length + level;
    array[index - 1] = modifiedFile;
    setPDFIns(array);
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

  const formatDataForAirtable = (levels) => {
    const formData = new FormData();

    formData.append(
      `data`,
      JSON.stringify({
        GameName: state.gameName,
        NumberOfRounds: state.rounds,
        GoogleSheet: state.excel,
        ResultsSubbmision: state.result,
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

    formData.append("roles", JSON.stringify(state.roleValues));

    return formData;
  };

  const handleCheckboxChange = (value, actionType) => {
    dispatch({
      type: actionType,
      payload: !value,
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
    console.log(dublicate);
    dispatch({
      type: "SET_ROLE_VALUES",
      payload: { index, role, dublicate, submit },
    });
  };
  const next = async () => {
    if (isNext) {
      const formattedData = formatDataForAirtable();
      try {
        await sendDataToAirtable(formattedData);
        localStorage.removeItem("formState");
        window.location.href = "/list";
      } catch (error) {
        console.error("Error sending data to Airtable:", error);
      }
    } else {
      localStorage.setItem("formState", JSON.stringify(state));
      setIsNext(!isNext);
    }
  };

  const cancle = () => {
    if (isNext) {
      setIsNext(!isNext);
    } else {
      window.location.href = "/";
    }
  };

  const handleAddRoleClick = () => {
    const roleValues = state.roleValues;
    const lastInputValue = roleValues[roleValues.length - 1];
    if (
      lastInputValue !== "" &&
      !roleValues.slice(0, roleValues.length - 1).includes(lastInputValue)
    ) {
      const newRoleInputs = [
        ...roleInputs,
        <Form.Control
          key={roleInputs.length}
          type='text'
          placeholder='New Role'
        />,
      ];
      setRoleInputs(newRoleInputs);
      setDublicateValue(false);
    } else {
      setDublicateValue(true);
    }
  };

  return (
    <Container>
      <Row>Create Game</Row>
      <Row>Basic information</Row>
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
          handlePDFInstruction={handlePDFInstruction}
          handleInputChange={handleInputChange}
          storedState={state}
        />
      )}
      <Row className='justify-content-end'>
        <Col md={3} className='text-right justify-content-end'>
          <Button variant='primary' onClick={next}>
            {!isNext ? "Next" : "Submit"}
          </Button>{" "}
          <Button variant='secondary' onClick={cancle}>
            {!isNext ? "Cancel" : "Go Back"}
          </Button>
        </Col>
      </Row>
    </Container>
  );
};
export default Create;
