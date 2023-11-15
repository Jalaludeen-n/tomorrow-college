import styles from "../../styles/page/GameDetails.module.scss";
import { Document, Page } from "react-pdf";
import React, { useState } from "react";
// import { PDFViewer } from "pdf-viewer-reactjs"; // Import PDFViewer
// import "pdf-viewer-reactjs/dist/index.css"; // Import the CSS (make sure it's available in your project)

const GameDescription = ({ pdfData, header, show }) => {
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
          height: "84vh",
        }}
      />
    </div>
  );
};

export default GameDescription;
