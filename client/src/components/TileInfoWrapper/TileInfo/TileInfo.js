import React, { Component } from 'react';
import {Link} from "react-router-dom";
import Drawer from "../../Drawer";
import './styles.scss';
import Preloader from "../../Preloader";
import Helper from "../../../shared";
import {withDrizzle} from "../../withDrizzle";

class TileInfo extends Component {
  handleBuyClick = () => {
    const { grabCodes, codes, metadatas, isMetamaskEnabled } = this.props;

    if (!isMetamaskEnabled) {
      return window.open('https://metamask.io/', '_blank', 'noopener');
    }
    if (this.dataIsLoaded())
      grabCodes(codes, codes.map((code) => metadatas[code].price))
  };

  landIsYours = address => {
    const { account } = this.props;
    return account && address === account.toString()
  }

  dataIsLoaded = () => {
    const { codes, metadatas } = this.props

    for (let i = 0; i < codes.length; i++)
      if (!metadatas[codes[i]])
        return false

    return true
  }

  iOwnNone = () => {
    const {account, metadatas} = this.props
    const metadataOwners = Object.values(metadatas).map((metadata) => metadata.owner)
    for (let i = 0; i < metadataOwners.length; i++) {
      if (metadataOwners[i] === account)
        return false
    }
    return true
  }

  render() {
    const {onClose, defaultMultipleDivided, metadatas, codes, match, transaction, web3, dataJSON} = this.props;

    const bulk = codes.length > 1
    const plural = bulk ? "s" : ""

    let ownerDisplay = null
    let defaultPrice = null
    let price = null

    if (bulk) {
      let sumWeis = new web3.utils.BN(0)
      Object.values(metadatas).map((metadata) => { sumWeis = sumWeis.add(new web3.utils.BN(metadata.price)); return null} )
      price = parseFloat(web3.utils.fromWei(sumWeis)).toFixed(6)
    } else {

      const code = codes[0]
      if (metadatas[code]) {
        const metadata = metadatas[code]

        if (this.landIsYours(metadata.owner))
          ownerDisplay = "You"
        else if (metadata.owner === "0x0000000000000000000000000000000000000000")
          ownerDisplay = "None"
        else
          ownerDisplay = ("#" + metadata.owner.slice(-6)).toUpperCase();

        price = parseFloat(web3.utils.fromWei(new web3.utils.BN(metadata.price))).toFixed(6)
        defaultPrice = parseFloat(web3.utils.fromWei(new web3.utils.BN(metadata.lastPrice).mul(new web3.utils.BN(defaultMultipleDivided)))).toFixed(6)
      }
    }

    let priceJSX = null

    if (this.dataIsLoaded()) {
      if (bulk || defaultPrice !== price) {
        priceJSX = (
          <tr>
            <td>Price:</td>
            <td>{Helper.ethAndUsd(dataJSON, price)}</td>
          </tr>
        )
      } else if (defaultPrice) {
        priceJSX = (
            <tr>
              <td>Default price:</td>
              <td>{Helper.ethAndUsd(dataJSON, defaultPrice)}</td>
            </tr>
        )
      }
    }

    return (
      <Drawer back='/' onClick={onClose}>
        <table className='buy-info-table'>
          <tbody>
          <tr>
            <td>Code{plural}:</td>
            <td>
              <a
                className="pluslink"
                href={`https://plus.codes/${codes[0]}`}
                target="_blank"
                rel="noopener noreferrer"
              >{codes[0]}</a>{bulk ? ` ${codes.length - 1} more` : ""}
            </td>
          </tr>
          {priceJSX}
          { !bulk ? (
              <tr>
                <td>Owner:</td>
                <td>{ownerDisplay}</td>
              </tr>
            ) : null
          }
          </tbody>
        </table>

        {transaction && transaction.status === 'pending' ? (
          <p className='buy-info-pending'>Mining transaction for this tile <Preloader fill='#ee7904' /></p>
        ) : (
          <div id="buttons">
            {this.dataIsLoaded() ? (
              this.iOwnNone() ? (
                <button onClick={(ev) => {ev.preventDefault(); this.handleBuyClick()}}>
                    <div><div>Add to Cart</div>
                    <div className="button-footnote">(MetaMask)</div></div>
                  </button>
              ) : (
                bulk ? (
                  ""
                ) : (
                  <Link to={`${match.url}/change-price`}>Change Price</Link>
                )
              )
            ) : (
              null
            )}
          </div>
        )}
      </Drawer>
    );
  }
}

export default withDrizzle()(TileInfo);
