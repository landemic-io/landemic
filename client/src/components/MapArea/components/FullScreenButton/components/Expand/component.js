import React from 'react';

const Expand = () => (
  <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="14" height="14" viewBox="0 0 14 14">
    <defs>
      <rect id="b" width="28" height="28" rx="2"/>
      <filter id="a" width="167%" height="167%" x="-22.8%" y="-22.8%" filterUnits="objectBoundingBox">
        <feMorphology in="SourceAlpha" operator="dilate" radius=".375" result="shadowSpreadOuter1"/>
        <feOffset dx="3" dy="3" in="shadowSpreadOuter1" result="shadowOffsetOuter1"/>
        <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="2.5"/>
        <feComposite in="shadowBlurOuter1" in2="SourceAlpha" operator="out" result="shadowBlurOuter1"/>
        <feColorMatrix in="shadowBlurOuter1" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.0303158967 0"/>
      </filter>
      <path id="c" d="M2.38 12.444h2.092a.583.583 0 0 1 0 1.167h-3.5a.583.583 0 0 1-.583-.583v-3.5a.583.583 0 1 1 1.167 0v2.091l3.087-3.087a.583.583 0 1 1 .825.825l-3.087 3.087zm9.24-10.888H9.527a.583.583 0 1 1 0-1.167h3.5c.322 0 .583.261.583.583v3.5a.583.583 0 1 1-1.167 0V2.381L9.357 5.468a.583.583 0 1 1-.825-.825l3.087-3.087z"/>
      <path id="d" d="M2.38 12.444h2.092a.583.583 0 0 1 0 1.167h-3.5a.583.583 0 0 1-.583-.583v-3.5a.583.583 0 1 1 1.167 0v2.091l3.087-3.087a.583.583 0 1 1 .825.825l-3.087 3.087zm9.24-10.888H9.527a.583.583 0 1 1 0-1.167h3.5c.322 0 .583.261.583.583v3.5a.583.583 0 1 1-1.167 0V2.381L9.357 5.468a.583.583 0 1 1-.825-.825l3.087-3.087z"/>
    </defs>
    <g fill="none" fillRule="evenodd">
      <g fill="#000" fillRule="nonzero" transform="translate(0 0)">
        <use xlinkHref="#c"/>
        <use transform="rotate(90 7 7)" xlinkHref="#d"/>
      </g>
    </g>
  </svg>
);

export default Expand;
