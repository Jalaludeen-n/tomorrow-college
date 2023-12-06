import styles from "../../styles/page/GameDetails.module.scss";
import React, { useEffect, useRef } from "react";

const GameDescription = ({ pdfData, header, show }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (pdfData) {
      const iframe = iframeRef.current;
      const iframeDocument =
        iframe.contentDocument || iframe.contentWindow.document;
      const elementToHide = iframeDocument.querySelector(".toolbarViewerRight");
      if (elementToHide) {
        elementToHide.style.display = "none";
      }
    }
  }, [pdfData]);

  return (
    <div className={`${styles.pdfContainer}`}>
      {show && (
        <div className={`${styles.descriptionHeadline}`}>
          <div className={`${styles.descriptionTitle}`}>{header}</div>
        </div>
      )}
      {pdfData && (
        <iframe
          ref={iframeRef}
          className={`${styles.description}`}
          src={`data:application/pdf;base64,${pdfData}`}
          title='PDF'
          style={{
            width: "100%",
            height: "80vh",
          }}
        />
      )}
    </div>
  );
};

export default GameDescription;
