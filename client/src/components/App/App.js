import React, { PureComponent } from 'react';
import { Route } from 'react-router-dom';

import './styles.scss'
import OpenLocationCodeExt from '../../open-location-code-ext.js'
import Body from '../Body'
import { LoadingScreen } from '../../LoadingScreen';
import Rules from '../Rules';
import Header from '../Header';
import Helper from '../../shared'

class App extends PureComponent {
  selectedAddress = undefined;
  currentCenter = undefined;

  constructor(props) {
    super(props);
    this.state = {
      shifted: false,
      selectedCodes: [],
      stackId: null,
      grabCodesStack: null,
      olc: new OpenLocationCodeExt(),
      defaultMultiple: null,
      transactionStackOngoing: {},
      myTilesAmount: 0,
      dataJSON: {},
    }
  }

  componentDidMount() {
    this.loadMetaData()
    this.mountAccountChangeTracker();

    const script = document.createElement("script");
    // script.src = 'https://hello.landemic.io/app.js'; /* simpleanalytics.com bypass */
    script.async = true;
    script.defer = true;

    document.body.appendChild(script);

  }

  componentDidUpdate() {
    this.mountAccountChangeTracker();
  }

  setCurrentCenter = (coords) => {
    this.currentCenter = coords;
  }

  mountAccountChangeTracker = () => {
    const { web3 } = this.props;

    if (!web3.currentProvider.publicConfigStore) { return; }
    if (this.selectedAddress) { return; }

    this.selectedAddress = web3.currentProvider.selectedAddress;

    web3.currentProvider.publicConfigStore.on('update', ({ selectedAddress }) => {
      if (this.selectedAddress !== selectedAddress) {
        if (!this.currentCenter) { return window.location.reload(); }
        window.location = `${window.location.origin}?lat=${this.currentCenter.lat}&lng=${this.currentCenter.lng}`;
      }
    })
  };

  loadMetaData = async () => {
    const { Landemic } = this.props;
    if (Landemic) {
      const defaultMultiple = await Landemic.methods._defaultMultiple().call()
      this.setState({ defaultMultiple })
    }
  }

  dataLoaded() {
    const dataJSON = this.state.dataJSON
    return dataJSON['tiles'] && dataJSON['notifications'] && dataJSON['ethUsd'] && dataJSON['stats']
  }

  addToDataJSON(data) {
    let newDataJSON={}
    Object.assign(newDataJSON, this.state.dataJSON, data)      
    this.setState({dataJSON: newDataJSON})
  }

  componentWillMount() {
    const { pathname } = this.props.location
    if (pathname.includes('/buy/')) {
      let codes = pathname.replace('/buy/', '').replace('/change-price', '')

      if (codes.includes(','))
        codes = codes.split(',')
      else
        codes = [codes]

      this.setState({ selectedCodes: codes })
    }

    fetch('./contract-data.json')
    .then(response => response.json())
    .then(data => {
      this.addToDataJSON(data)
    })

    fetch('./ethUsd.json')
    .then(response => response.json())
    .then(data => {
      console.log('Updated ' + Helper.timeSince(new Date(data['updated'])) + ' ago')
      this.addToDataJSON({ethUsd: data})
    })

    .catch(error => console.error(error))
  }

  grabCodes = async(landNames, weis) => {

    // current workaround for window.web3 being deprecated
    // we can use local web3 safely because our web3 calls don't ask any client
    // information
    var web3 = require('web3');
    const { accounts, Landemic, BulkProxy } = this.props;
    // const { accounts, Landemic, BulkProxy, web3 } = this.props;

    if (landNames.length > 1) {

      let sumWeis = new web3.utils.BN(0)
      weis.map((wei) => { sumWeis = sumWeis.add(new web3.utils.BN(wei)); return null} )

      landNames = landNames.map(web3.utils.asciiToHex)
      const stackId = BulkProxy.methods["grabCodesSafe"].cacheSend(
        landNames, weis,
        { from: accounts[0], value: sumWeis, maxPriorityFeePerGas: null, maxFeePerGas: null }
        // { from: accounts[0], value: sumWeis, gasPrice: result }
        // per: https://stackoverflow.com/questions/68926306/avoid-this-gas-fee-has-been-suggested-by-message-in-metamask-using-web3
      )
      this.setTransactionStackOngoing(landNames.join(","), stackId);
    } else {
      const tokenId = web3.utils.asciiToHex(landNames[0])
      const stackId = Landemic.methods["grabCode"].cacheSend(
        tokenId,
        { from: accounts[0], value: weis[0], maxPriorityFeePerGas: null, maxFeePerGas: null }
        // { from: accounts[0], value: weis[0], gasPrice: result }
      )
      this.setTransactionStackOngoing(landNames.join(","), stackId);
    }

    // this whole thing is commented out since we don't suggest a gas price anymore

/*
    web3.eth.getGasPrice((e, result) => {

      // result: string

      // toBN: 'Will safely convert any given value (including BigNumber.js instances) into a BN.js instance, for handling big numbers in JavaScript.'
      result = web3.utils.toBN(result)

      console.log(web3.version)

      // BN.js instances can't handle decimals
      if (result % 2 === 1)
        result = result.add(new web3.utils.BN(1))
      result *= 1.5

      if (landNames.length > 1) {

        let sumWeis = new web3.utils.BN(0)
        weis.map((wei) => { sumWeis = sumWeis.add(new web3.utils.BN(wei)); return null} )

        landNames = landNames.map(web3.utils.asciiToHex)
        const stackId = BulkProxy.methods["grabCodesSafe"].cacheSend(
          landNames, weis,
          { from: accounts[0], value: sumWeis, maxPriorityFeePerGas: null, maxFeePerGas: null }
          // { from: accounts[0], value: sumWeis, gasPrice: result }
        )
        this.setTransactionStackOngoing(landNames.join(","), stackId);
      } else {
        const tokenId = web3.utils.asciiToHex(landNames[0])
        const stackId = Landemic.methods["grabCode"].cacheSend(
          tokenId,
          { from: accounts[0], value: weis[0], maxPriorityFeePerGas: null, maxFeePerGas: null }
          // { from: accounts[0], value: weis[0], gasPrice: result }
        )
        this.setTransactionStackOngoing(landNames.join(","), stackId);

      }
    }) */   
  }

  setTransactionStackOngoing = (landName, stackId) => {
    this.setState(state => ({
      transactionStackOngoing: {
        ...state.transactionStackOngoing,
        [landName]: stackId
      },
    }))
    if (this.props.location.pathname.includes('change-price')) {
      this.props.history.goBack()
    }
  };

  onClose = (e) => {
    e.preventDefault()
    this.setState({ selectedCodes: [] })
    this.props.history.push('/')
  }

  setSelectedCodes = (codes) => {
    this.setState({ selectedCodes: codes });
  };

  setMyTilesAmount = (amount) => {
    this.setState({ myTilesAmount: amount });
  };

  render() {
    const { accounts, contract, transactionStack } = this.props;
    const { transactionStackOngoing, defaultMultiple, selectedCodes } = this.state;


    if (!this.dataLoaded())
      return <LoadingScreen />

    return (
      <div className="App">
        <Header selectCodes={this.setSelectedCodes} />

        <Route path='/rules' component={Rules} />

        <div className="content">

          <Body
            selectedCodes={selectedCodes}
            events={this.props.contract.events}
            account={accounts[0]}
            setCurrentCenter={this.setCurrentCenter}
            transactionStackOngoing={transactionStackOngoing}
            transactionStack={transactionStack}
            contract={contract}
            defaultMultiple={defaultMultiple}
            grabCodes={this.grabCodes}
            setTransactionStackOngoing={this.setTransactionStackOngoing}
            onClose={this.onClose}
            setSelectedCodes={this.setSelectedCodes}
            myTilesAmount={this.state.myTilesAmount}
            setMyTilesAmount={this.setMyTilesAmount}
            dataJSON={this.state.dataJSON}
          />

        </div>
      </div>
    )
  }
}

export default App;
