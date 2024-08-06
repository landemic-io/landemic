/**
 * Used to calculate USD for "Top Tiles"
 */
'use strict';

const shared = require('./shared')
const log = shared.log

const rp = require('request-promise');
const requestOptions = {
    method: 'GET',
    uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
    qs: {
        'symbol': 'ETH',
        'convert': 'USD'
    },
    headers: {
        'X-CMC_PRO_API_KEY': 'b9087e5d-b72a-43fb-8b4d-b3d42f1236e6'
    },
    json: true,
    gzip: true
};

rp(requestOptions).then(response => {
    // console.log('API call response:', response);
    const ethusd = response.data.ETH.quote.USD.price
    log(ethusd)
    let file = 'data/ethToUsd.txt'
    shared.write(file,ethusd.toString())    
}).catch((err) => {
    log("Couldn't get ethereum price: " + err.message)
    process.exit(1)
});