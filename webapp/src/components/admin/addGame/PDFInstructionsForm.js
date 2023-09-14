import React, { useEffect, useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import UploadIcon from "../../../icons/Vector.svg";
import styles from "../../../styles/page/Create.module.scss";

const PDFInstructionsForm = ({
  handlePDFInstruction,
  handleInputChange,
  storedState,
  role,
  setRole,
  pdf,
  handleLevelPDF,
}) => {
  const handleChange = (e) => {
    setRole(e.target.value);
    const selectedIndex = e.target.selectedIndex;
    const selectedValue = e.target.options[selectedIndex].value;
    const selectedDublicate =
      e.target.options[selectedIndex].getAttribute("data-duplicate");
    const isDublicate = selectedDublicate === "true";

    handleInputChange(selectedIndex - 1, selectedValue, isDublicate, true);
  };
  return (
    <>
      {storedState.individualInstructions ? (
        <>
          {storedState.roleValues.map((value, index) => (
            <Row key={index} className='mb-3'>
              <Col
                md={1}
                className='d-flex align-items-end justify-content-center'>
                {index + 1}
              </Col>
              <Col md={2}>
                <Form.Label>Role Name</Form.Label>
                <Form.Control type='text' value={value.role} readOnly />
              </Col>
              {Array.from(
                { length: parseInt(storedState.rounds) },
                (_, roundIndex) => (
                  <>
                    {roundIndex > 0 && roundIndex % 4 === 0 && (
                      <Col
                        md={3}
                        key={`col-${
                          index * storedState.roleValues.length + roundIndex
                        }`}></Col>
                    )}
                    <Col md={2} key={`col-${roundIndex}`}>
                      <Form.Label>Round {roundIndex + 1}</Form.Label>
                      <div className={`input-group ${styles.inputGroup}`}>
                        <input
                          type='text'
                          className='form-control'
                          placeholder='Select a PDF file'
                          value={
                            pdf[
                              index * storedState.roleValues.length + roundIndex
                            ]?.name ?? ""
                          }
                          aria-describedby='inputGroupFileAddon'
                          readOnly
                          key={`input-${
                            index * storedState.roleValues.length + roundIndex
                          }`}
                        />
                        <label
                          className={`btn btn-outline-secondary ${styles.uploadBtn}`}>
                          <img
                            src={UploadIcon}
                            alt='Upload Icon'
                            width='16'
                            height='16'
                          />
                          <input
                            type='file'
                            accept='.pdf'
                            onChange={(e) =>
                              handlePDFInstruction(
                                roundIndex + 1,
                                value.role,
                                e.target.files[0],
                                index,
                              )
                            }
                            style={{ display: "none" }}
                          />
                        </label>
                      </div>
                    </Col>
                  </>
                ),
              )}
            </Row>
          ))}
        </>
      ) : (
        <>
          <Row className='mb-3'>
            <Col className={styles.sectionTitle}>Instruction</Col>
          </Row>
          <Row className='mb-3'>
            <Col className={styles.label}>
              Add an instruction for all the levels and roles. This instruction
              will be displayed to the players for all the rounds.
            </Col>
          </Row>
          <Row className='mb-5'>
            <div
              className={`input-group ${styles.inputGroup}`}
              style={{
                width: "350px",
              }}>
              <input
                type='text'
                className='form-control'
                placeholder='Select a PDF file'
                value={
                  storedState.levelInstruction &&
                  storedState.levelInstruction.name
                    ? storedState.levelInstruction.name
                    : ""
                }
                aria-describedby='inputGroupFileAddon'
                readOnly
              />
              <label
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
                  id='inputLevelFile'
                  accept='.pdf'
                  onChange={(e) =>
                    handleLevelPDF(e.target.files[0], "SET_LEVEL_INSTRUCTIONS")
                  }
                  style={{ display: "none" }}
                />
              </label>
            </div>
          </Row>
        </>
      )}

      <Row className='mb-1'>
        <Col className={styles.sectionTitle}>Roles duplicate</Col>
      </Row>
      <Row className='mb-3'>
        <Col className={`${styles.label} mb-3`}>
          Selected roles can be duplicate if number of players is greater than
          role number
        </Col>
      </Row>
      <Row className='mb-3'>
        {storedState.roleValues.map((value, index) => (
          <Col md={3} key={index}>
            <Form.Group controlId='checkbox4'>
              <Form.Check
                type='checkbox'
                label={value.role}
                checked={value.dublicate}
                onChange={() =>
                  handleInputChange(
                    index,
                    value.role,
                    !value.dublicate,
                    value.submit,
                  )
                } // Adjust the handler function
              />
            </Form.Group>
          </Col>
        ))}
      </Row>
      {storedState.result == "Only one peson can submit group answer" && (
        <>
          <Row>
            <Col className={styles.sectionTitle}>Submission</Col>
          </Row>
          <Row className='mt-3'>
            <Col md={6}>
              <div className={`custom-dropdown ${styles.customDropdown}`}>
                <Form.Label>
                  Choose the role which only submit the result
                </Form.Label>
                <select
                  id='roleSelect'
                  className='form-select'
                  disabled={role === ""}
                  value={role} // Use your selected role state
                  onChange={handleChange}>
                  <option value=''>Select a role</option>
                  {storedState.roleValues.map((value, index) => (
                    <option
                      key={index}
                      value={value.role}
                      data-duplicate={value.dublicate}
                      data-submit={value.submit}>
                      {value.role}
                    </option>
                  ))}
                </select>
              </div>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default PDFInstructionsForm;

{
  /* <Col md={5} className='justify-content-end'>
  <div className='form-check'>
    <input
      type='checkbox'
      className='form-check-input'
      id={`checkbox1-${index}`}
      checked={value.submit}
      onChange={() =>
        handleInputChange(index, value.role, value.dublicate, !value.submit)
      }
    />
    <label className='form-check-label' htmlFor={`checkbox1-${index}`}>
      This role can only submit the group result
    </label>
  </div>
  <div className='form-check'>
    <input
      type='checkbox'
      className='form-check-input'
      checked={value.dublicate}
      onChange={() =>
        handleInputChange(index, value.role, !value.dublicate, value.submit)
      }
      id={`checkbox2-${index}`}
    />
    <label className='form-check-label' htmlFor={`checkbox2-${index}`}>
      This role can be duplicate
    </label>
  </div>
</Col>; */
}
