import React, {PureComponent} from 'react';
import {Link} from "react-router-dom";
import {Form, Field} from "react-final-form";
import './styles.scss';
import {FailIcon, SuccessIcon} from "../../Icons";
import Drawer from "../../Drawer";
import {withDrizzle} from "../../withDrizzle";

class ChangePrice extends PureComponent {

  handleSubmit = (values) => {
    const { web3, Landemic, account, codes, metadatas } = this.props;
    
    // shouldn't get here because the "Change Price" button won't even come up if the metadatas aren't loaded
    if (!metadatas)
      return null

    const code = codes[0]
    const tokenId = web3.utils.asciiToHex(code)
    const metadata = metadatas[code]

    const price = values.price
    const lastPrice = new web3.utils.BN(metadata.lastPrice)

    const multiple = (price / (parseFloat(web3.utils.fromWei(lastPrice.div(new web3.utils.BN(10)))))).toFixed(0)
    const stackId = Landemic.methods["setMultiple"].cacheSend(tokenId, multiple, { from: account });
    this.props.setTransactionStackOngoing(tokenId, stackId);
    // this.props.history.push('/');
  };

  render() {

    const {codes, metadatas, web3} = this.props;
    if (!metadatas) { return null; }

    const code = codes[0]
    const metadata = metadatas[code]
    if (!metadata)
      return null

    const lastPriceBN = new web3.utils.BN(metadata.lastPrice);
    const minValidPrice = parseFloat(web3.utils.fromWei(lastPriceBN.div(new web3.utils.BN(10))))
    const maxValidPrice = parseFloat(web3.utils.fromWei(lastPriceBN.mul(new web3.utils.BN(100))))

    const priceInRange = (currentPrice) => {

      if (currentPrice < minValidPrice) { return `Price has to be greater than ${minValidPrice}`; }
      if (currentPrice > maxValidPrice) { return `Price has to be lower than ${maxValidPrice}`; }

      return undefined;
    };

    return (
      <Drawer back='/' onClick={this.props.onClose}>
        <Form
          onSubmit={this.handleSubmit}
          render={({handleSubmit, pristine, invalid, errors }) => (
            <form className='change-price-form' onSubmit={handleSubmit}>

              <div>
                <label>
                  Price:
                </label>

                <Field
                  name='price'
                  component='input'
                  placeholder="ETH"
                  validate={priceInRange}
                />

                {!pristine
                  ? invalid
                    ? <FailIcon/>
                    : <SuccessIcon/>
                  : null
                }
              </div>

              <p className={invalid ? 'invalid' : ''}>
                Price has to be greater than {minValidPrice.toString()}
                <br/>
                Price has to be lower than {maxValidPrice.toString()}
              </p>

              <div className='change-price-form-buttons'>
                <button type="submit" disabled={pristine || invalid}>Save</button>
                <Link to={`/buy/${code}`}>Cancel</Link>
              </div>

            </form>
          )}
        />
      </Drawer>
    )
  }
}

export default withDrizzle()(ChangePrice);
