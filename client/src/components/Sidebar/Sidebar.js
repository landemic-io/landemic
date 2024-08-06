import React, { Component } from 'react'
import MyTiles from './MyTiles'
import Stats from './Stats'
import './styles.scss'

class Sidebar extends Component {

	constructor(props) {
		super(props);
		this.state = {
			selected: "stats"
		};
	}

	selectTab(name) {
		this.setState({ selected: name })
	}

	render() {
		let myTiles =
			<MyTiles
		        tiles={this.props.myTiles}
		        account={this.props.account}
		        selectCode={this.props.selectCode}
		        loading={this.props.loading}
		        transactionStackOngoing={this.props.transactionStackOngoing}
		        transactions={this.props.transactions}
		        transactionStack={this.props.transactionStack}
		        myTilesAmount={this.props.myTilesAmount}
				dataJSON={this.props.dataJSON}
			/>

		let stats = <Stats selectCode={this.props.selectCode} dataJSON={this.props.dataJSON} />

		let selected = this.state.selected
		let selectedDiv = (selected === "stats") ? stats : myTiles;
		return(
			<div id="sidebar">
				<div id="sidebar-tabs">
					<button onClick={() => this.selectTab("stats")} className={selected === "stats" ? "selected" : ""}>Charts</button>
					<button onClick={() => this.selectTab("mytiles")} className={selected === "mytiles" ? "selected" : ""}>My Tiles ({this.props.myTilesAmount})</button>
				</div>

    			<div id="sidebar-body">
    				{selectedDiv}
    			</div>
    		</div>
    	)
	}

}

export default Sidebar;