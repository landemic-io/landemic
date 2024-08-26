import React, { Component } from 'react'
import { Link, MediumLink } from "../../shared";
import Logo from "../Logo";
import './styles.scss'

class Header extends Component {

	selectCode(ev) {
		ev.preventDefault();
		this.props.selectCode(this.topCode);
	}

	render() {

/* 
<div id="alert">
	    	We are currently experience higher-than-normal activity. Thank you for your patience.
	    </div>
*/

		return (
	    <div>
	  <div className='header'>

	    <Logo />

	    <div id="dash">
	    	Claim That Land. Name Your Price.{/* <br/>抓住那片土地。 说出你的价格。*/}
	    </div>

	    <div id="menu">

		    <MediumLink
		      title={'How it Works'} className="overview"
		    />

		    <Link
		      link={'https://twitter.com/landemic/'}
		      title={'𝕏'} className="twitter"
		    />

		    <Link
		      link={'https://t.me/landemic/'}
		      title={'Telegram'} className="telegram"
		    />

	    </div>

	  </div></div>
		);
	}
}

export default Header;
