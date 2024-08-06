import React from 'react';
import './styles.scss';
import Expand from "./components/Expand";
import Collapse from "./components/Collapse";

const FullScreenButton = ({ onClick, isFullScreen }) => (
  <button
    onClick={(ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      onClick();
      return false;
    }}
    className='full-screen-button'
  >
    {isFullScreen ? <Collapse /> : <Expand />}
  </button>
);

export default FullScreenButton;
