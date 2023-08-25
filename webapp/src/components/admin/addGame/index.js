import React, { useEffect } from "react";
import "../../../styles/page/create.scss";
import { Row, Col, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import optionsData from "./../../../options.json";
const Index = ({
  handleDropdownChange,
  state,
  handlePDFChange,
  handleCheckboxChange,
  roleInputs,
  handleInputChange,
  handleAddRoleClick,
  
}) => {
  const { resultsSubbmision, scoreVisibilityForPlayers } = optionsData;

  useEffect(() => {}, []);

  return (
    <>
      <Row>
        <Col>
          <Form.Label>Game name</Form.Label>
          <Form.Control
            type='text'
            value={state.gameName}
            placeholder='Game name here'
            onChange={(e) => handleDropdownChange(e, "SET_GAME_NAME")}
          />
        </Col>
        <Col>
          <Form.Label>Number of rounds</Form.Label>
          <Form.Control
            type='number'
            placeholder='Ex 2'
            value={state.rounds}
            onChange={(e) => handleDropdownChange(e, "SET_NUM_ROUNDS")}
          />
        </Col>
        <Col>
          <Form.Label>Link to excel</Form.Label>
          <Form.Control
            type='text'
            placeholder='htttp://'
            value={state.excel}
            onChange={(e) => handleDropdownChange(e, "SET_EXCEL")}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Label>Game instruction</Form.Label>
          <div className='checkbox-group'>
            <input
              type='file'
              accept='.pdf'
              onChange={(e) =>
                handlePDFChange(e.target.files[0], "SET_GAME_INSTRUCTIONS")
              }
            />
          </div>
        </Col>
        <Col>
          <div className='custom-dropdown'>
            <label htmlFor='dropdown'>Submission results</label>
            <select
              id='dropdown'
              value={state.result}
              onChange={(e) => handleDropdownChange(e, "SET_RESULT")}>
              <option value=''>Choose</option>
              {resultsSubbmision.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </Col>
        <Col>
          <div className='custom-dropdown'>
            <label htmlFor='dropdown'>Score visibility</label>
            <select
              id='dropdown'
              value={state.scoreVisibility}
              onChange={(e) => handleDropdownChange(e, "SET_SCORE_VISIBILITY")}>
              <option value=''>Choose</option>
              {scoreVisibilityForPlayers.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>Game roles</Col>
      </Row>
      <Row>
        <Col>
          <div className='form-check'>
            <input
              type='checkbox'
              className='form-check-input'
              id='checkbox1'
              checked={state.allowAutoSelection}
              onChange={() =>
                handleCheckboxChange(
                  state.allowAutoSelection,
                  "SET_ALLOW_AUTO_SELECTION",
                )
              }
            />
            <label className='form-check-label' htmlFor='checkbox1'>
              Allow for auto selection role
            </label>
          </div>
        </Col>
        <Col>
          <div className='form-check'>
            <input
              type='checkbox'
              className='form-check-input'
              id='checkbox2'
              checked={state.individualInstructions}
              onChange={() =>
                handleCheckboxChange(
                  state.individualInstructions,
                  "SET_INDIVIDUAL_INSTRUCTIONS",
                )
              }
            />
            <label className='form-check-label' htmlFor='checkbox2'>
              Individual instructions per round
            </label>
          </div>
        </Col>
      </Row>
      {roleInputs.map((input, index) => (
        <Row key={index}>
          <Col md={3}>
            <Form.Control
              type='text'
              placeholder='Role name here'
              value={input.role}
              onChange={(e) =>
                handleInputChange(index, e.target.value, false, false)
              }
            />
          </Col>
          {index === roleInputs.length - 1 && (
            <Col md={3} className='d-flex align-items-end'>
              <Button
                style={{ backgroundColor: "white", color: "black" }}
                onClick={handleAddRoleClick}>
                Add another role
                <FontAwesomeIcon
                  icon={faPlus}
                  style={{ color: "black", padding: "0px 4px" }}
                />
              </Button>
            </Col>
          )}
        </Row>
      ))}
    </>
  );
};
export default Index;
