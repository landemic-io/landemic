import React, { Component } from 'react'
import { MediumLink } from '../../shared'
import '../InstallMetamask/styles.scss';

class CheckMetamask extends Component {

	render() {
		return (
			<div className='CheckMetamask'>
				<h2>
				  {this.props.msg}
				</h2>
				<MediumLink
				  title={'Learn more about Landemic'}
				  className={'PopupLink'}
				/>
			</div>
		);
	}

}

export default CheckMetamask;