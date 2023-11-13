import React, { useEffect } from "react";
import style from "../../../styles/components/navbar/Right.module.scss"; // Use the SCSS Module import
import { Row } from "react-bootstrap";
import { isObjectEmpty } from "../../helper/utils";
import { fetchQustions } from "../../services/decision";

const Decision = ({ data }) => {
  const fetchLevelDetailsAndSet = async (data) => {
    const formData = {
      level: data.level,
      sheetID: data.GoogleSheetID,
    };

    const res = await fetchQustions(formData);
    console.log(res);
  };

  useEffect(() => {
    if (!isObjectEmpty(data)) {
      fetchLevelDetailsAndSet(data);
    }
  }, [data]);
  return (
    <div className={style.decision_container}>
      <Row className={`${style.decision_header} `}>Decisions</Row>
      <Row className={`${style.welcomeRole} `}>Your role is {data.role} </Row>
    </div>
  );
};

export default Decision;
