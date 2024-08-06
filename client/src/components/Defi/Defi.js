import React from 'react';
import './styles.scss';
import Drawer from "../Drawer";
import {Field, Form} from "react-final-form";


const onSubmit = () => {}

const Defi = () => (
  <Drawer back='/'>

    <table className='buy-info-table'>
      <tbody>
      <tr>
        <td>Code:</td>
        <td>
          <a
            className="pluslink"
            href={`https://plus.codes/87G7PXCH+`}
            target="_blank"
            rel="noopener noreferrer"
          >87G7PXCH+</a>
        </td>
      </tr>
      <tr>
        <td>Last sale price:</td>
        <td>1 SOL</td>
      </tr>

      <tr>
        <td>Owner:</td>
        <td>#DC37C7</td>
      </tr>
      </tbody>
    </table>

    <table id='solana-offer'>
      <tbody>
        <tr><td colSpan='2'><p>Make offer to earn rewards</p></td></tr>
        <tr><td><label>
            Offer:
          </label></td><td>
            <Form onSubmit={onSubmit} render={({handleSubmit, pristine, invalid}) => (
              <Field
                name='price'
                component='input'
                placeholder="2 SOL"
              />
            )} />
          </td></tr>
        <tr><td colSpan='2'>
          <div id="buttons">
            <button>
              <div>Make Offer</div>
            </button>
          </div>
        </td></tr>
        <tr><td colSpan='2' id='rewards'>
        <p>Reward: 17.5% APY</p>
        <p>7.5% base reward</p>
        <p>10% founder reward</p>              
        </td></tr>              
      </tbody>
    </table>  </Drawer>
);

export default Defi;
