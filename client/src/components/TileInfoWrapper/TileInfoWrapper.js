import React, {PureComponent} from 'react'
import { Switch, Route, withRouter } from "react-router-dom";
import TileInfo from "./TileInfo";
import ChangePrice from './ChangePrice';
import './styles.scss';
import {withDrizzle} from "../withDrizzle";
import CodeMetadata from "../../CodeMetadata"

class TileInfoWrapper extends PureComponent {

  state = {
    metadataForToken: {},
  }

  fetch = async () => {
    const {codes, web3, Landemic} = this.props;

    let batch = new web3.BatchRequest()

    let newMetadataForToken = {}
    const codeCount = codes.length

    codes.map((code) => {

      /* metadataForToken = (_lastPrice(tokenId), ownerOf(tokenId), multipleOf(tokenId), price) */

      batch.add(Landemic.methods.metadataForToken(web3.utils.asciiToHex(code)).call.request({from: '0x0000000000000000000000000000000000000000'}, (something, result) => {

        if (result)
          newMetadataForToken[code] = new CodeMetadata(result)

        if (Object.keys(newMetadataForToken).length === codeCount)
          this.setState({ metadataForToken: newMetadataForToken })

        return null
      }))
      return null
    })

    // Updating on demand, no need to refresh the state of previously clicked tiles.
    batch.execute()
    
    // const metadataForToken = await Landemic.methods["metadataForToken"](tokenId).call()
  }

  componentDidMount = () => {
    this.fetch()
  }

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    if (JSON.stringify(prevProps.codes) !== JSON.stringify(this.props.codes)) {
      this.setState({ metadataForToken: {} })
      this.fetch()
    }
    // Price might have changed. TODO: add event for price change.
    if (!prevProps.contract.synced && this.props.contract.synced) {
      this.fetch()
    }
    if (prevProps.transaction && this.props.transaction && (prevProps.transaction.status !== this.props.transaction.status)) {
      this.fetch();
    }
  }

  // This is a bit of a mess, trying to combine single selected tiles with multi-selected tile use-cases
  // - phil@landemic.io 9/28/2019
  render() {
    const { codes, match, history, grabCodes, account, Landemic, transaction, setTransactionStackOngoing, defaultMultiple, dataJSON } = this.props
    if (!Landemic) { return null; }
    const { metadataForToken } = this.state

    return (
      <Switch>
        <Route exact path={match.url} render={({ match }) => (
          <TileInfo
            onClose={this.props.onClose}
            defaultMultipleDivided={defaultMultiple / 10}
            grabCodes={grabCodes}
            codes={codes}
            metadatas={metadataForToken}
            match={match}
            transaction={transaction}
            account={account}
            dataJSON={dataJSON}
          />
        )} />        
        <Route path={`${match.url}/change-price`} render={() => (
          <ChangePrice
            onClose={this.props.onClose}
            codes={codes}
            metadatas={metadataForToken}
            account={account}
            defaultMultiple={defaultMultiple}
            history={history}
            setTransactionStackOngoing={setTransactionStackOngoing}
          />
        )} />
      </Switch>
    )
  }
}

export default withRouter(withDrizzle()(TileInfoWrapper));
