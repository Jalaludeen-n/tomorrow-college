import React from "react";
import Open from "../../icons/Open.svg";
import Close from "../../icons/Close.svg";
import style from "../../styles/components/Layout.module.scss";

const Closed = ({ onClick, text, right }) => {
  return (
    <div className={style.closed}>
      <div class={`${style.flex_bottom_center} ${style.text_center}`}>
        <img
          onClick={onClick}
          className={`align-self-start ${style.closeButton}`}
          src={right ? Close : Open}
          alt='Back Icon'
          width='100'
          height='80'
        />
      </div>
      <div
        className={` ${style.vertical_text} ${style.navText} ${style.flex_centered} ${style.text_center}`}>
        {text}
      </div>
    </div>
  );
};

export default Closed;
