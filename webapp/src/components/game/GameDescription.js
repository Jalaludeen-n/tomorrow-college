import styles from "../../styles/page/GameDetails.module.scss";
import React, { useEffect } from "react";

const GameDescription = ({ pdfData, header, show }) => {
  useEffect(() => {
    if (pdfData === null) {
      window.location.reload(); // Refresh the page if pdfData is null
    }
  }, []);
  return (
    <div className={`${styles.pdfContainer}`}>
      {show && (
        <div className={`${styles.descriptionHeadline}`}>
          <div className={`${styles.descriptionTitle}`}>{header}</div>
        </div>
      )}
      <iframe
        className={`${styles.description}`}
        src={`data:application/pdf;base64,${pdfData}`}
        title='PDF'
        style={{
          width: "100%",
          height: "80vh",
        }}
      />
    </div>
  );
};

export default GameDescription;
