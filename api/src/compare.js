'use strict';

const fs = require('fs')
const shared = require('./shared')
const path = require('path')

const log = shared.log

const argv = process.argv

if (argv.length < 3)
	log(`usage: node ${path.basename(__filename)} 

const oldCodes = JSON.parse(fs.readFileSync(__dir + '/data/codes-mainnet.json'))
const newCodes = JSON.parse(fs.readFileSync(__dir + '/data/codes.json'))

if (newCodes.length > oldCodes.length) {
	log(`newCodes.length (${newCodes.length}) > oldCodes.length (${oldCodes.length})`)
	return
}

let newCode2Data = {}

newCodes.map( (row) => newCode2Data[row[0]] = [row[1],row[2]] )

let notPresent = []
for (let i = 0; i < oldCodes.length; i++) {
	const [code, account, price] = oldCodes[i]
	const newCodeData = newCode2Data[code]
	if (newCodeData) {
		if (newAccount != account || newPrice != price)
			log(`${code} is different`)
			return
	} else {
		notPresent.push([code,account,price])
	}
	// [oldAccount, oldPrice] = oldCodeData
	// if (oldAccount != account || oldPrice != price)
	// 	log(`mismatch node write ${code} ${account} ${price}`)		
}

if (notPresent.length > 0 &&
	log(JSON.stringify(notPresent)
} else {
	log("match successful")
}

