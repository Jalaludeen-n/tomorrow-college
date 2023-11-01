import React from "react";
import Open from "../../icons/Open.svg";
// import Close from "../icons/Close.svg";
import style from "../../styles/components/Layout.module.scss";

const Closed = ({ onClick }) => {
  return (
    // <div className={`d-flex ${style.closed}`}>
    //   <img
    //     onClick={onClick}
    //     className={`align-self-start ${style.closeButton} img-fluid`}
    //     src={Open}
    //     alt='Back Icon'
    //     width='50'
    //     height='20'
    //   />
    //   <div
    //     className={`text-center flex-column ${style.vertical_text} ${style.navText}`}>
    //     <div className='d-flex justify-content-center align-items-center h-100'>
    //       Game details
    //     </div>
    //   </div>
    // </div>

    <div className={style.closed}>
      <div class={`${style.flex_bottom_center} ${style.text_center}`}>
        <img
          onClick={onClick}
          className={`align-self-start ${style.closeButton} img-fluid`}
          src={Open}
          alt='Back Icon'
          width='50'
          height='20'
        />
      </div>
      <div
        className={` ${style.vertical_text} ${style.navText} ${style.flex_centered} ${style.text_center}`}>
        Game details
      </div>
    </div>
  );
};

export default Closed;
