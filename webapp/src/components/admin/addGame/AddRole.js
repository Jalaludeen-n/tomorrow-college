// ChildComponent.js
import React from "react";
import { Row, Col, Form, Button, Container } from "react-bootstrap";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../../../styles/page/Create.module.scss";

function AddRole({ roleInputs, handleAddRoleClick, handleInputChange, roles }) {
  return (
    <div className={styles.scrollableContainesr}>
      <div className={styles.inputContainesr}>
        {roleInputs.map((input, index) => (
          <Row key={index} className='pb-2'>
            <Col md={3}>
              <div className={styles.AddRoleHeadline}>Role name</div>
              <Form.Control
                key={index}
                type='text'
                label='Role name'
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
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    border: "1px solid #000",
                  }}
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
      </div>
    </div>
  );
}

export default AddRole;
