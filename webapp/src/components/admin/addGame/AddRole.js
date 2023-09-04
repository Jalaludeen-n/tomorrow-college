// ChildComponent.js
import React from "react";
import { Row, Col, Form, Button, Container } from "react-bootstrap";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function AddRole({ roleInputs, handleAddRoleClick, handleInputChange, roles }) {
  return (
    <>
      {roleInputs.map((input, index) => (
        <Row key={index}>
          <Col md={3}>
            <Form.Control
              key={index}
              type='text'
              placeholder='Role name here'
              value={(roles[index] && roles[index].role) || ""}
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
}

export default AddRole;
