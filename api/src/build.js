'use strict';
const fs = require('fs')
const shared = require('./shared')
const log = shared.log

const block2timestamp = JSON.parse(shared.read('data/block2timestamp.json'))

let dataJSON = {}

let buildStats = () => {

	let codes = JSON.parse(shared.read('data/codes.json'))

	let kings = {}
	let gems = []
	
	codes.map((codeRow) => {
		let code = codeRow[0]
		let address = codeRow[1]
		let price = shared.wei2eth(shared.bn(codeRow[2]))
		
		gems.push([code,price])
		
		if (!kings[address])
			kings[address] = 0
		kings[address]++
	})

	gems = gems.sort((a,b) => b[1] - a[1])
	
	let kingsSorted = []
	Object.keys(kings).map((king) => {
		let count = kings[king]
		// if (count > 1)
       	kingsSorted.push( [ king, kings[king] ] )
	})

    kingsSorted.sort((a,b) => b[1] - a[1])

	// ex: [["87G7PX9W+","0x0000000000000000000000000000000000000000","0xECd0E78F62DD5C7b441e6aCfEe843D357aC126f5",1561419146]
    let transfers = JSON.parse(shared.read('data/events.json'))

    transfers.sort((a,b) => b[3] - a[3])

    transfers = transfers.slice(0,1000)
    transfers = transfers.map((xfer) => [xfer[0],block2timestamp[xfer[3]]])

    let newUsers = JSON.parse(shared.read('data/events.json'))

    newUsers.sort((a,b) => a[3] - b[3])
    let newUserSeen = {}

    newUsers = newUsers.filter((row) => {
    	const to = row[2]
    	if (newUserSeen[to]) {
    		return false
    	} else {
    		newUserSeen[to] = true
    		return true
    	}
    })

    newUsers = newUsers.map((row) => { return [row[3],row[2]] })
    newUsers.sort((a,b) => b[0] - a[0])

    let stats = {}

	stats.gems = [['Code','ETH']].concat(gems)
	stats.kings = [['Owner','Count']].concat(kingsSorted)
	stats.transfers = [['Code','UNIX timestamp']].concat(transfers)
	stats.newUsers = [['First Visit','User']].concat(newUsers)
    
	// shared.write('build/stats.json', JSON.stringify(stats))	
	dataJSON['stats'] = stats
}

const buildEthUsd = () => {
	const ethUsd = shared.read('data/ethToUsd.txt','utf8')
	const data = { value: ethUsd }

	data['updated'] = Date.now()
	shared.write('build/ethUsd.json',JSON.stringify(data))
	// dataJSON['ethUsd'] = data
}

const buildNotifications = () => {

    let transfers = JSON.parse(shared.read('data/events.json'))
    transfers.sort((a,b) => b[3] - a[3])

    let ownerHistory = {}

    let data = []

	transfers.map((xfer) => {
		const code = xfer[0]
		const from = xfer[1]
		const to = xfer[2]
		const timestamp = block2timestamp[xfer[3]]
		if (to === "0x0000000000000000000000000000000000000000")
			data.push([timestamp,from,'resale',code])
	})

	dataJSON['notifications'] = data
	// shared.write('build/notifications.json',JSON.stringify(data))
}

const buildTiles = () => {
	let transfers = JSON.parse(shared.read('data/events.json'))

	// ascending
	transfers.sort((a,b) => a[3] - b[3])
	const lastBlock = transfers[transfers.length - 1][3]

	let tiles = JSON.parse(shared.read('data/codes.json'))

	tiles = tiles.map((tile) => {
		return [tile[0],tile[1]]
	})

	dataJSON['tiles'] = {tiles: tiles, lastBlock: lastBlock}
	// shared.write('build/tiles.json',JSON.stringify({tiles: tiles, lastBlock: lastBlock}))	
}

const dir = __dirname + "/../build"

if (!fs.existsSync(dir))
	fs.mkdirSync(dir)


buildStats()
buildEthUsd()
buildNotifications()
buildTiles()

shared.write('build/contract-data.json',JSON.stringify(dataJSON, null, 2))