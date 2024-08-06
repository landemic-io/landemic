import React from 'react';
import { Link } from "react-router-dom";
import { CloseIcon } from "../Icons";

const Popup = ({ back, children }) => (
  <div className='Popup'>
    <Link className="Popup-background" to={back} />
    <div className='PopupWrapper'>
      {back && (
        <Link to={back} className='PopupBack'>
          <CloseIcon/>
        </Link>
      )}
      <div className='PopupContent'>
        {children}
      </div>
    </div>
  </div>
);

export default Popup;
