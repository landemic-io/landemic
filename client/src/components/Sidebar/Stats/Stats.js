import React, { Component } from 'react'
import './styles.scss'
import Helper from '../../../shared'
import StatsTable from './StatsTable'

class Stats extends Component {

	constructor(props) {
		super(props);
		const statsJSON = this.props.dataJSON['stats']
		this.gems = statsJSON['gems'].slice(1) // trim header and copy
		
		this.kings = statsJSON['kings'].slice(1)
		this.xfers = statsJSON['transfers'].slice(1)
	}

	handleClick = (e, code) => {
		e.preventDefault();
		this.props.selectCode(code);
	};

	render() {
		const gemRows = this.gems.map((gem) => {
			let code = gem[0]
			let eth = gem[1]
			let usd = Helper.ethAsUsd(this.props.dataJSON, eth)
            /*eslint-disable-next-line*/
			return <tr key={code}><td><a href='' onClick={(e) => this.handleClick(e, code)}>{code}</a></td><td>{usd}</td></tr>
		});

		const kingRows = this.kings.map((king,i) => {
			let user = '#' + king[0].slice(-6)
			let count = king[1]
			return <tr key={user}><td>{user.toUpperCase()}</td><td>{count}</td><td className="tileColor" style={{backgroundColor: user}}></td></tr>
		});

		const updateRows = this.xfers.map((xfer,i) => {
			let [code,timestamp] = xfer
			let dateTime = new Date(timestamp * 1000)

            /*eslint-disable-next-line*/
			return <tr key={i}><td><a href='' onClick={(e) => this.handleClick(e, code)}>{code}</a></td><td>{Helper.timeSince(dateTime)}</td></tr>			
		});

	
		return(
			<div id="stats">
				<StatsTable bodyRows={gemRows} showFirst={1} headerRow={<tr><th>Top Tiles</th></tr>} />

				<StatsTable bodyRows={updateRows} showFirst={5} headerRow={<tr><th>Recent Tiles</th></tr>} />

				<StatsTable bodyRows={kingRows} showFirst={10} headerRow={<tr><th>Top Owners</th></tr>} />

			</div>
		)
	}
}

export default Stats;
