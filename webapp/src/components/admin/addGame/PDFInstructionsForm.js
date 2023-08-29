import React, { useEffect, useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";

const PDFInstructionsForm = ({
  handlePDFInstruction,
  handleInputChange,
  storedState,
}) => {
  const [md, setMd] = useState(2);

  return (
    <>
      {storedState.roleValues.map((value, index) => (
        <Row key={index}>
          <Col md={1} className='d-flex align-items-end justify-content-center'>
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
                {roundIndex > 0 && roundIndex === 4 && <Col md={3}></Col>}
                <Col md={2} key={roundIndex}>
                  <Form.Label>Round {roundIndex + 1}</Form.Label>
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
                  />
                </Col>
              </>
            ),
          )}
          <Col md={5} className='justify-content-end'>
            <div className='form-check'>
              <input
                type='checkbox'
                className='form-check-input'
                id={`checkbox1-${index}`}
                checked={value.submit}
                onChange={() =>
                  handleInputChange(
                    index,
                    value.role,
                    value.dublicate,
                    !value.submit,
                  )
                }
              />
              <label
                className='form-check-label'
                htmlFor={`checkbox1-${index}`}>
                This role can only submit the group result
              </label>
            </div>
            <div className='form-check'>
              <input
                type='checkbox'
                className='form-check-input'
                checked={value.dublicate}
                onChange={() =>
                  handleInputChange(
                    index,
                    value.role,
                    !value.dublicate,
                    value.submit,
                  )
                }
                id={`checkbox2-${index}`}
              />
              <label
                className='form-check-label'
                htmlFor={`checkbox2-${index}`}>
                This role can be duplicate
              </label>
            </div>
          </Col>
        </Row>
      ))}
    </>
  );
};

export default PDFInstructionsForm;
