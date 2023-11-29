import React from "react";
import style from "../styles/components/popup.module.scss"; // Add your CSS file for styling

const PopupComponent = ({ onClose, contentComponent }) => {
  return (
    <div className={style.popup_container}>
      <div className={style.popup_content}>
        <button className={style.close_button} onClick={onClose}>
          X
        </button>
        {contentComponent && React.cloneElement(contentComponent)}
      </div>
    </div>
  );
};

export default PopupComponent;
