class CodeMetadata {
	constructor(chainData) {
		// these are all strings
		// common operations:
		// new web3.utils.BN()
		// web3.utils.fromWei(..)
		// see https://github.com/indutny/bn.js/
		this.owner = chainData[1]
		this.lastPrice = chainData[0]
		this.multiple = chainData[2]
		this.price = chainData[3]
	}
}

export default CodeMetadata

