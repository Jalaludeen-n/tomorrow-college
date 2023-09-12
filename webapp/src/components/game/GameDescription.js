import styles from "../../styles/page/GameDetails.module.scss";

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
          height: "58vh",
          border: "none",
          zoom: "100%",
        }}
      />
    </div>
  );
};

export default GameDescription;
