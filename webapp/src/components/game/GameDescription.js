import styles from "../../styles/page/GameDetails.module.scss";
import { Document, Page } from "react-pdf";

const GameDescription = ({ pdfData, header }) => {
  return (
    <div className={`${styles.pdfContainer}`}>
      <div className={`${styles.descriptionHeadline}`}>
        <div className={`${styles.descriptionTitle}`}>{header}</div>
      </div>
      <iframe
        className={`${styles.description}`}
        src={`data:application/pdf;base64,${pdfData}`}
        title='PDF'
        style={{
          width: "100%",
          height: "71vh",
          border: "none",
          zoom: "10%",
          frameBorder: "0",
        }}
      />
    </div>
  );
};

export default GameDescription;
