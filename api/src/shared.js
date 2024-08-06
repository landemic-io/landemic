'use strict';

require('dotenv').config({path:__dirname+'/../../.env'})

const contractModule = require('truffle-contract')
const web3module = require('web3')
const path = require('path')
const fs = require('fs')

// const mainnetProvider = new web3module.providers.HttpProvider("https://mainnet.infura.io/v3/0b06e79247de4421a2e203bf087df5e1");

exports.landemic = class {
	constructor(network) {
		if (!network)
			network = 'mainnet'
		
		let mainnet = network == 'mainnet'

		const mainnetAbi = require(__dirname + '/../contracts/Landemic-mainnet.json')
		const localAbi = require(__dirname + '/../contracts/Landemic-local.json')
		
		const mainnetProvider = new web3module.providers.HttpProvider(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`);
		const localProvider = new web3module.providers.HttpProvider("http://localhost:8545");

		const abi = mainnet ? mainnetAbi : localAbi
		const provider = mainnet ? mainnetProvider : localProvider

		this.network = network
		this.web3 = new web3module(provider)

		this.contract = contractModule(abi)
		this.contract.setProvider(provider);

	}

}

exports.write = (fileRelativeToProject, data) => {
	const file = fileRelativeToProject
	fs.writeFileSync(__dirname + "/../" + file,data)
	exports.log(file)
}

exports.read = (fileRelativeToProject) => {
	const file = fileRelativeToProject
	const absPath = __dirname + "/../" + file
	if (fs.existsSync(absPath))
		return fs.readFileSync(absPath, 'utf8')
	return "[]"
}
exports.log = (...args) => console.log(...args);
exports.sleep = (ms) => {return new Promise(resolve => setTimeout(resolve, ms))};
exports.hex2ascii = (n) => {return web3module.utils.hexToAscii(n)};
exports.ascii2hex = (n) => {return web3module.utils.fromAscii(n)};
exports.bn2hex = (n) => {return web3module.utils.toHex(n)};
exports.bn = (n) => {return new web3module.utils.BN(n)};
exports.bn2code = (n) => {return exports.hex2ascii(this.bn2hex(n))};
exports.wei2eth = (n) => {return web3module.utils.fromWei(n) };
