import React from "react";
import Open from "../../icons/Open new.svg";
import Close from "../../icons/Back.svg";
import style from "../../styles/components/Layout.module.scss";

const Closed = ({ onClick, text, right }) => {
  return (
    <div className={style.closed}>
      <div class={`${style.flex_bottom_center} ${style.text_center}`}>
        <img
          onClick={onClick}
          className={`align-self-start ${style.closeButton} pointer`}
          src={right ? Close : Open}
          alt='Back Icon'
          width='50'
          height='80'
        />
      </div>
      <div
        className={` ${style.vertical_text} ${style.navText} ${
          style.flex_centered
        } ${style.text_center} ${right ? style.right_closed_container : ""}`}>
        {text}
      </div>
    </div>
  );
};

export default Closed;
