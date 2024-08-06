import React from 'react'
import Eth from './components/Eth'

export default class Helper {
	static formatUsd = (number, showDecimals = true) => {
    let formatted = number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
    if (!showDecimals)
      formatted = formatted.replace(/\..*/,'')
		return formatted
	};
  static ethAsUsd = (dataJSON, number, showDecimals = true) => {
    const ethUsd = dataJSON['ethUsd']['value']
    const usd = ethUsd * number
    return '$' + Helper.formatUsd(usd, usd < 100)
  };
  static formatEth = (number) => {
    return <span><Eth />{number}</span>
  };
  static ethAndUsd = (dataJSON, number) => {
    return <span>{Helper.ethAsUsd(dataJSON, number)} ({number})</span>
  };

  static timeSince(date) {

    let seconds = Math.floor((new Date() - date) / 1000);

    let interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
      return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + " months";
    }
    
    interval = Math.floor(seconds / 86400);
    if (interval > 1)
      return interval + " days";
    if (interval === 1)
      return interval + " day";
    
    interval = Math.floor(seconds / 3600);
    if (interval > 1)
      return interval + " hrs";
    if (interval === 1)
      return interval + " hr";
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1)
      return interval + " min";

    return Math.floor(seconds) + " sec";
  }
}

export const Link = ({ link, title, className }) => {
  return <a href={link}
    className={className ? className : null}
    target="_blank"
    rel="noopener noreferrer">{title}</a>
}

export const MediumLink = ({ title, className }) => {
  return <a href="https://medium.com/@landemic/how-landemic-works-6b55d3a2f818"
    className={className ? className : null}
    target="_blank"
    rel="noopener noreferrer">{title}</a>
}