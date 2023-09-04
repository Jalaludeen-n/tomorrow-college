import React, { useEffect } from "react";
import styles from "../../../styles/page/Create.module.scss";
import { Row, Col, Form, Button, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import optionsData from "./../../../options.json";
import UploadIcon from "./../../../icons/Vector.svg";
const Index = ({
  handleDropdownChange,
  state,
  handlePDFChange,
  handleCheckboxChange,
  roleInputs,
  handleInputChange,
  handleAddRoleClick,
  handleLevelPDF,
}) => {
  const { resultsSubbmision, scoreVisibilityForPlayers } = optionsData;


  return (
    <Container className={styles.container}>
      <Row className={`mb-3 flex-grow-1`}>
        <Col>
          <Form.Label className={styles.label}>Game name</Form.Label>
          <Form.Control
            required
            type='text'
            value={state.gameName}
            placeholder='Game name here'
            onChange={(e) => handleDropdownChange(e, "SET_GAME_NAME")}
          />
        </Col>
        <Col>
          <Form.Label className={styles.label}>Number of rounds</Form.Label>
          <Form.Control
            required
            type='number'
            placeholder='Ex 2'
            value={state.rounds}
            onChange={(e) => handleDropdownChange(e, "SET_NUM_ROUNDS")}
          />
        </Col>
        <Col>
          <Form.Label className={styles.label}>Link to excel</Form.Label>
          <Form.Control
            required
            type='text'
            placeholder='htttp://'
            value={state.excel}
            onChange={(e) => handleDropdownChange(e, "SET_EXCEL")}
          />
        </Col>
      </Row>
      <Row className={`mb-3 flex-grow-1`}>
        <Col>
          <div className='mb-3'>
            <Form.Label className={styles.label}>Game instruction</Form.Label>
            <div className={`input-group ${styles.inputGroup}`}>
              <input
                type='text'
                className='form-control'
                placeholder='Select a PDF file'
                value={
                  state.gameInstructions && state.gameInstructions.name
                    ? state.gameInstructions.name
                    : ""
                }
                aria-describedby='inputGroupFileAddon'
                readOnly
              />
              <label
                htmlFor='inputGroupFile'
                className={`btn btn-outline-secondary ${styles.uploadBtn}`}>
                <img
                  src={UploadIcon}
                  alt='Upload Icon'
                  width='16'
                  height='16'
                />
                <input
                  required
                  type='file'
                  id='inputGroupFile'
                  accept='.pdf'
                  disabled={!state.gameName}
                  onChange={(e) =>
                    handlePDFChange(e.target.files[0], "SET_GAME_INSTRUCTIONS")
                  }
                  style={{ display: "none" }}
                />
              </label>
            </div>
          </div>
        </Col>
        <Col>
          <div className={`custom-dropdown ${styles.customDropdown}`}>
            <div className='mb-3'>
              <Form.Label className={styles.label} htmlFor='resultDropdown'>
                Submission results
              </Form.Label>
              <div className={`input-group ${styles.inputGroup}`}>
                <select
                  required
                  id='resultDropdown'
                  className='form-select'
                  value={state.result}
                  onChange={(e) => handleDropdownChange(e, "SET_RESULT")}
                  aria-describedby='inputGroupSelectAddon'>
                  <option value=''>Choose</option>
                  {resultsSubbmision.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </Col>
        <Col>
          <div className={`custom-dropdown ${styles.customDropdown}`}>
            <Form.Group controlId='scoreDropdown'>
              <Form.Label className={styles.label}>Score visibility</Form.Label>
              <Form.Control
                as='select'
                className={`form-select ${styles.inputGroup}`}
                value={state.scoreVisibility}
                required
                onChange={(e) =>
                  handleDropdownChange(e, "SET_SCORE_VISIBILITY")
                }
                aria-describedby='inputGroupSelectAddon'>
                <option value=''>Choose</option>
                {scoreVisibilityForPlayers.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </div>
        </Col>
      </Row>
      <Row>
        <Col className={styles.sectionTitle}>Game roles</Col>
      </Row>
      <Row className='d-flex align-items-center'>
        <Col md={3}>
          <Form.Group controlId='checkbox1' className={styles.checkboxGroup}>
            <Form.Check
              type='checkbox'
              label='Allow for auto selection role'
              checked={state.allowAutoSelection}
              onChange={() =>
                handleCheckboxChange(
                  state.allowAutoSelection,
                  "SET_ALLOW_AUTO_SELECTION",
                )
              }
            />
          </Form.Group>
        </Col>
        <Col md={6} className='d-flex align-items-center'>
          <div
            className={`input-group ${styles.inputGroup}`}
            style={{
              width: "350px",
              display: state.individualInstructions ? "none" : "flex",
            }}>
            <input
              type='text'
              className='form-control'
              placeholder='Select a PDF file'
              value={
                state.levelInstruction && state.levelInstruction.name
                  ? state.levelInstruction.name
                  : ""
              }
              aria-describedby='inputGroupFileAddon'
              readOnly
            />
            <label className={`btn btn-outline-secondary ${styles.uploadBtn}`}>
              <img src={UploadIcon} alt='Upload Icon' width='16' height='16' />
              <input
                required
                type='file'
                id='inputLevelFile'
                accept='.pdf'
                disabled={!state.gameName}
                onChange={(e) =>
                  handleLevelPDF(e.target.files[0], "SET_LEVEL_INSTRUCTIONS")
                }
                style={{ display: "none" }}
              />
            </label>
          </div>
          <Form.Group controlId='checkbox2' className={styles.checkboxGroup}>
            <Form.Check
              type='checkbox'
              label='Individual instructions per round'
              checked={state.individualInstructions}
              onChange={() =>
                handleCheckboxChange(
                  state.individualInstructions,
                  "SET_INDIVIDUAL_INSTRUCTIONS",
                )
              }
            />
          </Form.Group>
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
    </Container>
  );
};
export default Index;
