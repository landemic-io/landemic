import React from 'react';

const Preloader = ({ fill = '#000000' }) => (
  <svg
    version="1.1"
    id="L4"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 100 100"
    enableBackground="new 0 0 0 0"
    xmlSpace="preserve"
    width='20px'
    height='20px'
  >
  <circle fill={fill} stroke="none" cx="6" cy="90" r="6">
    <animate
      attributeName="opacity"
      dur="1s"
      values="0;1;0"
      repeatCount="indefinite"
      begin="0.1"/>
  </circle>
    <circle fill={fill} stroke="none" cx="26" cy="90" r="6">
    <animate
      attributeName="opacity"
      dur="1s"
      values="0;1;0"
      repeatCount="indefinite"
      begin="0.2"/>
  </circle>
    <circle fill={fill} stroke="none" cx="46" cy="90" r="6">
    <animate
      attributeName="opacity"
      dur="1s"
      values="0;1;0"
      repeatCount="indefinite"
      begin="0.3"/>
  </circle>
</svg>
);

export default Preloader;
