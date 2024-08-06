import React from 'react';
import { Link } from "react-router-dom";
import { CloseIcon } from "../Icons";
import './styles.scss';

const Drawer = ({ back, onClick, children }) => (
  <div className='drawer'>
    {back && <Link to={back} onClick={onClick} className='drawer-back'><CloseIcon/></Link>}
    {children}
  </div>
);

export default Drawer;
