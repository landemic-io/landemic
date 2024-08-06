import React, { PureComponent } from 'react';
import './styles.scss';
import Helper from '../../../../shared';
import CodeMetadata from '../../../../CodeMetadata';

class MyTile extends PureComponent {
  state = {
    price: undefined
  };

  componentDidMount() {
    this.getPrice(this.props.tile.code);
  }

  async getPrice(code) {
    const { Landemic, web3 } = this.props;
    const tokenId = web3.utils.asciiToHex(code);
    const metadata = new CodeMetadata(await Landemic.methods["metadataForToken"](tokenId).call());
    const price = parseFloat(web3.utils.fromWei(metadata.price))

    this.setState({ price: price.toFixed(5) });
  }

  handleClick = (ev) => {
    ev.preventDefault();
    this.props.selectCode(this.props.tile.code);
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!this.props.ongoingTransaction) { return; }
    if (this.props.ongoingTransaction.status === 'pending') { return; }
    if (prevProps.ongoingTransaction.status === this.props.ongoingTransaction.status) { return; }
    this.getPrice(this.props.tile.code);
  }

  render() {
    const { tile, dataJSON } = this.props;
    const { price } = this.state;

    return (
      /*eslint-disable-next-line*/
      <tr key={tile.code}><td><a href='' onClick={this.handleClick}>{tile.code}</a></td><td>{Helper.ethAsUsd(dataJSON, price)}</td></tr>
    );
  }
}

export default MyTile;
