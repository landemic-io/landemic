import React, { Component } from 'react'
import './styles.scss'

class StatsTable extends Component {

	constructor(props) {
		super(props);

		this.perPage = 15

		this.state = {
			collapsed: true,
			page: 0
		};

	}

	clickLess = (e) => {
		e.preventDefault();
		if (this.state.page === 0)
			this.setState({collapsed: true})
		else
			this.setState({page: this.state.page - 1})
	}

	clickMore = (e) => {
		e.preventDefault();
		if (this.state.collapsed === true) {
			this.setState({collapsed: false})
		} else {
			let page = this.state.page + 1

			if (this.perPage * page > this.props.bodyRows.length)
				page = 0

			this.setState({page: page})
		}
	}

	render() {

		const {bodyRows, showFirst} = this.props

		const paginate = bodyRows.length > showFirst

		return(
			<table className="stats-table">
				<thead>
					{this.props.headerRow}
				</thead>
				<tbody>
					{this.state.collapsed ? bodyRows.slice(0,showFirst) : bodyRows.slice(this.state.page * this.perPage, this.state.page * this.perPage + this.perPage)}
				</tbody>

				<tfoot><tr><td className="disclosures" colSpan="2">{paginate ? <button className="minorStyle" onClick={(e) => this.clickMore(e)}>more</button> : null }{!this.state.collapsed ? <button className="minorStyle" onClick={this.clickLess}>less</button> : ""}</td></tr>
				</tfoot>
			</table>
		)
	}
}

export default StatsTable;
