import React from "react";
import style from "../../../styles/components/navbar/Right.module.scss"; // Use the SCSS Module import
import { Row } from "react-bootstrap";

const Welcome = ({
  level,
  role,
  resultsSubmission = "Each member does their own submission",
}) => {
  return (
    <div className={style.welcome_container}>
      <Row className={`${style.welcomeName} `}>Decisions for Round {level}</Row>
      <Row className={`${style.welcomeRole} `}>
        Your role is {role}.
        {resultsSubmission == "Each member does their own submission"
          ? ` As ${role} you will need to submit your own decisions.`
          : resultsSubmission == "Each group member can submit group answer"
          ? "Anyone can submit for the group. Please discuss with the group before submiting."
          : "The CEO of your team will submit the decisions for your group."}
      </Row>
    </div>
  );
};

export default Welcome;
