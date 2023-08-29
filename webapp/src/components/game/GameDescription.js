const GameDescription = ({ pdfData }) => {
  return (
    <div className='pdf-container'>
      <iframe
        src={`data:application/pdf;base64,${pdfData}`}
        title='PDF'
        style={{
          width: "100%",
          height: "60vh",
          border: "none",
          zoom: "100%",
        }}
      />
    </div>
  );
};

export default GameDescription;
