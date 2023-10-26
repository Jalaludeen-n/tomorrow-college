import React from "react";
import styles from "../../../styles/page/Create.module.scss";
import { Row, Col, Form, Container } from "react-bootstrap";
import optionsData from "./../../../options.json";
import UploadIcon from "./../../../icons/Vector.svg";
import AddRole from "./AddRole";
const Index = ({
  handleDropdownChange,
  state,
  handlePDFChange,
  handleCheckboxChange,
  roleInputs,
  handleInputChange,
  handleAddRoleClick,
}) => {
  const { resultsSubmission, scoreVisibilityForPlayers } = optionsData;

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
                  {resultsSubmission.map((option) => (
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
        <Col md={6} className={styles.sectionTitle}>
          Roles selection
        </Col>
        <Col className={styles.sectionTitle}>Individual instructions</Col>
      </Row>
      <Row className='d-flex align-items-center'>
        <Col md={6}>
          <div className={styles.RoleHeadline}>
            Choose the roles should be auto selected or choose by players{" "}
          </div>
          <Form.Group
            controlId='group1'
            className={styles.checkboxGroup}
            label='Allow for auto selection role'>
            <Form.Check
              inline
              label='Allow to pick the roles'
              name='group1'
              type='radio'
              className={styles.group}
              checked={state.allowAutoSelection === true}
              onChange={() =>
                handleCheckboxChange(false, "SET_ALLOW_AUTO_SELECTION")
              }
            />
            <Form.Check
              inline
              label='Auto select roles'
              name='group1'
              type='radio'
              className={styles.group}
              checked={state.allowAutoSelection === false}
              onChange={() =>
                handleCheckboxChange(true, "SET_ALLOW_AUTO_SELECTION")
              }
            />
          </Form.Group>
        </Col>
        <Col className=''>
          <div className={styles.RoleHeadline}>
            Select if roles should have individual instrauctions per each round
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
      <Row>
        <Col className={styles.sectionTitle}>Game roles</Col>
      </Row>
      <AddRole
        roleInputs={roleInputs}
        handleInputChange={handleInputChange}
        handleAddRoleClick={handleAddRoleClick}
        roles={state.roleValues}
      />
    </Container>
  );
};
export default Index;
