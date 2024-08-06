/**
 * Updates "Top Tiles" and "Top Owners"
 * 
 * Both require full lists of owners and tiles in order to sort by price and count
 */

'use strict';

const path = require('path')
const fs = require('fs')
const shared = require('./shared')
const log = shared.log

const landemic = new shared.landemic()

let code2price = {}
let codes = []
let deployed;

const mergePricesAndCodes = () => {
	let priceCount = Object.keys(code2price).length
	let newCodes = []
    let codeCount = codes.length
	for(let i = 0; i < codeCount; i++) {
		let code = codes[i][0]
		let owner = codes[i][1]
		let price = code2price[code]
		newCodes.push([code,owner,price])
	}
    codes = newCodes
	shared.write("data/codes.json",JSON.stringify(codes))
}

const fetchAllOwned = async () => {
    const instance = await landemic.contract.deployed()
    const deployed = instance

    const events = JSON.parse(shared.read('data/events.json'))

    let lastOwners = {}

    events.map((row) => {
        const [code,sender,owner] = row
        lastOwners[code] = owner
    })

    let lastOwnersArray = Object.keys(lastOwners).map((code) => [code,lastOwners[code]])

    let codeCount = lastOwnersArray.length

    log(codeCount + " codes");

    // https://docs.alchemy.com/reference/compute-unit-costs
    // eth_call costs 26 CU
    //
    // https://docs.alchemy.com/reference/throughput
    // the free tier is 330 CUPS
    // but it has Alchemy has "Elastic Throughput" which supplies much more

    const BATCH_SIZE = 1000
    let priceQ = []
    let errorCount = 0

    for (let i = 0; i < codeCount; i++) {
        const code = lastOwnersArray[i][0]
        const owner = lastOwnersArray[i][1]
        codes.push([code,owner])
        priceQ.push(code)
    }

    // If you need to do a troubleshooting of errors, trace these:
    // node_modules/web3-core-requestmanager/lib/index.js:RequestManager.prototype.sendBatch
    // node_modules/web3-core-requestmanager/lib/batch.js:Batch.prototype.execute

    const processQ = () => {
        const batchCodes = priceQ.splice(0, BATCH_SIZE)

        let batch = new landemic.web3.BatchRequest()

        for (const code of batchCodes) {

            batch.add(deployed.contract.methods.metadataForToken(shared.ascii2hex(code)).call.request({from: '0x0000000000000000000000000000000000000000'}, (err, result) => {
                if (err) {
                    errorCount++
                    priceQ.push(code);
                } else {
                    let price = shared.bn(result['3'])
                    code2price[code] = price.toString(10)
                }
            }))    
        }

        batch.execute()
    }

    while (priceQ.length) {
        processQ()
        const priceLength = Object.keys(code2price).length
        log(`${priceLength} prices acquired (${errorCount} retried)`)
        await shared.sleep(1000)
        // Alchemy suggests another approach: https://docs.alchemy.com/docs/how-to-implement-retries
    }

	mergePricesAndCodes()
}

fetchAllOwned()