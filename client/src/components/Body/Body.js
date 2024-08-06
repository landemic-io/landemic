import React, { Component } from 'react'
import MapArea from '../MapArea'
import Tile from '../../Tile.js'
import {withDrizzle} from "../withDrizzle";
import './styles.scss';
import OpenLocationCodeExt from "../../open-location-code-ext";

const delay = (msec) => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), msec)
    })
}

const retry = async (promiseFunc) => {
    try {
        return await promiseFunc()
    } catch(e) {
        console.log("retrying: " + e)        
        await delay(1000)
        return retry(promiseFunc)
    }
}

export class Body extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tiles: [],
            myTiles: undefined,
            eventsProcessed: 0,
            loading: true,
            olc: new OpenLocationCodeExt(),
        }
        this.updateQueue = null
    }

    pushToQueue = (func) => {
        if (this.updateQueue == null)
            this.updateQueue = func()
        else
            this.updateQueue = this.updateQueue.then(() => func())
    }

    fetchAllOwned = async () => {
        const { Landemic, web3 } = this.props
        
        // 1. Read TilesJSON cache (from the cache)
        // 2. Catch up once (using MetaMask)
        // 3. Listen for new events (from MetaMask)

        const allOwned = await retry(async () => {

            const deployed = new web3.eth.Contract(Landemic.abi, Landemic.address);

            const tilesJSON = this.props.dataJSON['tiles']

            const result = await deployed.getPastEvents("allEvents",{fromBlock: tilesJSON['tiles']['lastBlock'], toBlock: 'latest'})
            // breaks with 10,000+ events

            let lastOwners = {}

            tilesJSON['tiles'].map((tile) => {
                lastOwners[tile[0]] = tile[1]
                return null;
            })

            result.map((row) => {
                // some events have no tokenIds, such as "setApprovalForAll"
                if (row.returnValues.tokenId !== undefined)
                    lastOwners[this.tokenIdToAscii(row.returnValues.tokenId)] = row.returnValues.to;
                return null
            })

            let ownersArray = []
            let codesArray = []
            Object.keys(lastOwners).map((key) => {
                codesArray.push(key)
                ownersArray.push(lastOwners[key])
                return null
            })

            return [codesArray, ownersArray]
        })
        this.updateMap(allOwned[0], allOwned[1])
    }


    tokenIdToAscii(tokenId) {
        const { web3: { utils } } = this.props
        return utils.hexToAscii(utils.numberToHex(tokenId))
    }

    updateMap(tokenIds, owners, prevOwners = null) {
        const { account } = this.props
        const tiles = this.state.tiles
        const myTiles = this.state.myTiles ? [...this.state.myTiles] : [];
        const ownerAddress = account ? account.toString() : '';
        for (let i = 0; i < tokenIds.length; i++) {
            try {
                const area = this.state.olc.decode(tokenIds[i])
                const color = "#" + owners[i].slice(-6)

                const tile = {
                    code: tokenIds[i],
                    tile: new Tile(area, color)
                }
                tiles.push(tile)

                if (owners[i].toLowerCase() === ownerAddress.toLowerCase()) {
                    myTiles.push(tile);
                }
            } catch(e) {
                console.log(e)
            }
        }
        this.props.setMyTilesAmount(myTiles.length);
        this.setState({tiles, myTiles, eventsProcessed: tiles.length, loading: false})
    }

    componentDidMount() {
        this.updateQueue = this.fetchAllOwned()
    }

    shouldComponentUpdate(nextProps, nextState) {
        const events = nextProps.events
        if (events.length !== this.props.events.length) {
            const newEvents = events.slice(this.props.events.length)
            const tokens = newEvents.map(event => this.tokenIdToAscii(event.returnValues.tokenId))
            const owners = newEvents.map(event => event.returnValues.to)
            const prevOwners = newEvents.map(event => event.returnValues.from)
            this.pushToQueue(() => this.updateMap(tokens, owners, prevOwners))
        }
        if (this.state.eventsProcessed !== nextState.eventsProcessed) {
            return true
        }
        if (this.props.selectedCodes !== nextProps.selectedCodes) {
            return true
        }
        if (this.state.loading && !nextState.loading) {
            return true
        }

        if (!Object.is(this.props.transactionStackOngoing, nextProps.transactionStackOngoing)) {
            return true
        }
        if (!Object.is(this.props.transactionStack, nextProps.transactionStack)) {
            return true
        }

        return false
    }

    render() {
        return (
          <MapArea
            olc={this.state.olc}
            selectedCodes={this.props.selectedCodes}
            setCurrentCenter={this.props.setCurrentCenter}
            tiles={this.state.tiles}
            myTiles={this.state.myTiles}
            account={this.props.account}
            transactionStackOngoing={this.props.transactionStackOngoing}
            transactionStack={this.props.transactionStack}
            contract={this.props.contract}
            defaultMultiple={this.props.defaultMultiple}
            grabCodes={this.props.grabCodes}
            setTransactionStackOngoing={this.props.setTransactionStackOngoing}
            onClose={this.props.onClose}
            setSelectedCodes={this.props.setSelectedCodes}
            myTilesAmount={this.props.myTilesAmount}
            dataJSON={this.props.dataJSON}
          />
        )
    }
}
export default withDrizzle()(Body);
