// Navbar.js
import React from "react";
import Welcome from "./Welcome";
import Close from "../../icons/Close.svg";

const NavbarLeft = ({ onClick }) => {
  return (
    <div>
      <button onClick={onClick} className='toggle-button'>
        <img src={Close} alt='Back Icon' width='16' height='16' />
      </button>
      <Welcome name='Anna' />
    </div>
  );
};

export default NavbarLeft;
