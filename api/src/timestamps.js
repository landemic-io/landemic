/**
 * Updates timestamps on "Recent Tiles" feature
 */

'use strict';

const path = require('path')
const fs = require('fs')
const shared = require('./shared')
const log = shared.log

const landemic = new shared.landemic()

const timestampFile = 'data/block2timestamp.json'
const writeTimestamps = () => {
	shared.write(timestampFile, JSON.stringify(block2timestamp))
}

let block2timestamp = JSON.parse(shared.read(timestampFile))

log(Object.keys(block2timestamp).length + " past timestamps")

const events = JSON.parse(shared.read('data/events.json'))

log(events.length + " past events")

let blocks2get = {}

for (let i = 0; i < events.length; i++) {
	const blockNum = events[i][3]

	if (!block2timestamp[blockNum] && !blocks2get[blockNum]) {
		blocks2get[blockNum] = 1
	}
}

blocks2get = Object.keys(blocks2get)

log(`${blocks2get.length} blocks to process`)

// This should probably be re-written to follow `codes.js`. However unless you're doing
// a full sync, it shouldn't be many timestamps to fetch
// 
// eth_getBlockByNumber is 16 CU
// see `codes.js` for more Alchemy docs
const BATCH_SIZE = 16

const fetchAllTimestamps = async() => {

	await shared.sleep(1000)		

	let blocksProcessed = 0
	let blocksProcessing = 0

	let batchCount = Math.floor(blocks2get.length / BATCH_SIZE) + 1

	for (let batchNum = 0; batchNum < batchCount; batchNum++) {
	    let batch = new landemic.web3.BatchRequest()
		for (let i = batchNum * BATCH_SIZE; i < blocks2get.length && i < (batchNum + 1) * BATCH_SIZE; i++) {
			blocksProcessing++
			const blockNum = blocks2get[i]

			batch.add(landemic.web3.eth.getBlock.request(blockNum, false, (err, data) => {
				if (err) {
					console.log(err)
				} else {
					block2timestamp[blockNum] = data.timestamp
					blocksProcessed++
				}
			}))

		}
	    batch.execute()

	    while(1) {
			log(blocksProcessed + " blocks processed")
			if (blocksProcessed === blocksProcessing)
				break
			await shared.sleep(1000)		
		}
	}
	writeTimestamps()
}

fetchAllTimestamps()