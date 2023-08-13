import React from "react";
import "../../styles/components/admin/success-popup.scss";

const SuccessPopup = ({ onClose, name }) => {
  return (
    <div className='success-popup'>
      <div className='popup-content'>
        <h2>Game Created Successfully</h2>
        <p>{name} game has been created successfully.</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default SuccessPopup;
