/**
 * Syncs events.json with latest events from the contract
 * 
 * `timestamps.js` and `codes.json` then use these events to make further requests
 */

'use strict';

const path = require('path')
const fs = require('fs')
const shared = require('./shared')
const log = shared.log

const landemic = new shared.landemic()

let deployed;

const pastEvents = JSON.parse(shared.read('data/events.json'))

let fromBlock = 0

let pastEventsLookup = {}

pastEvents.map((event) => {
	const block = event[3]
	if (block > fromBlock)
		fromBlock = block
	pastEventsLookup[JSON.stringify(event)] = 1
	return null
})

log(pastEvents.length + " past events")

const isNewEvent = (event) => {
	if (pastEventsLookup[JSON.stringify(event)])
		return false
	return true
}

let newEvents = []

log (`fetching from block ${fromBlock}`)

// fromBlock = 8701821

let toBlock = 'latest'

// toBlock = 8721821

landemic.contract.deployed().then((instance) => {
  deployed = instance;

  return instance.getPastEvents("allEvents",{fromBlock: fromBlock, toBlock: toBlock})
  
  // a little less than 10,000 events:
  // return instance.getPastEvents("allEvents",{fromBlock: fromBlock, toBlock: 8696381}) 

}).then(function(result) {

	log(result.length + " new raw events")

	for (let i = 0; i < result.length; i++) {
		let event = result[i]
		const blockNum = event['blockNumber']
		const args = event['args']
		// some events have no tokenIds, such as "setApprovalForAll"
		if (args['tokenId']) {
			const code = shared.bn2code(args['tokenId'])
			event = [code, args['from'], args['to'], blockNum]
			if (isNewEvent(event,pastEvents))
				newEvents.push([code, args['from'], args['to'], blockNum])
		}
	}

	log(newEvents.length + " new saved events")

	const allEvents = pastEvents.concat(newEvents)

	log(allEvents.length + " total events")

	shared.write('data/events.json',JSON.stringify(allEvents))	

}).catch((e) => {
	log("Error getPastEvents: " + e)
	process.exit(1)
});
