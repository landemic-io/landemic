import React from 'react';
import Popup from "../Popup";

const Rules = () => (
  <Popup back='/'>
    <h2>What is Landemic?</h2>
    <p>
      Landemic is a non-fungible crypto token based on the ownership of digital land.
    </p>
    <p>
      When you buy a Landemic Token, you are buying Google Plus Codes (E.G., 87G8P2C2+)
      that represent rectangles of land on Earth. Your codes entitle you to a space on
      the Landemic Map, where you can buy and sell tiles and see the economy unfold using a
      {' '}
      <a target="_blank" rel="noopener noreferrer" href="https://metamask.io/">MetaMask</a>
      {' '}
      account.
    </p>
    <p>
      Landemic tokens are ERC-721-compatible contracts on Ethereum.
      You can view the
      {' '}
      <a target="_blank" rel="noopener noreferrer" href="https://medium.com/r/?url=https%3A%2F%2Fetherscan.com%2F">Landemic contract here.</a>
      {' '}
    </p>

    <h2>
      How much does a tile of land (Landemic token) cost?
    </h2>

    <p>
      <b>$0.25*</b> —
      The Initial Price of tiles that haven’t been claimed and are up for sale.
      The prices are denominated in Ether. You become a tile owner when you purchase it.
    </p>

    <p>
      Tile owners can set a Resale Multiple** — a multiplier which determines the
      resale pricing for Landemic tiles. The default is 10 times the last price it was
      purchased for on Landemic, but a tile owner can set any price between 100X and 0.1X.
    </p>

    <h2>
      Profit Distribution
    </h2>
    <p>
      <b>75%</b> goes to the previous owner.
    </p>
    <p>
      <b>20%</b> goes to the owners of neighboring tiles.
      If the four touching tiles are not owned by anyone,
      then this amount goes to the previous owner
    </p>
    <p>
      <b>5%</b> goes to the developers for maintaining the marketplace and bringing customers to it.
    </p>
    <p>
      All the rewards are automatically transferred as Ether to a user’s MetaMask accounts.
    </p>

    <h2>
      More about Landemic
    </h2>
    <ul>
      <li>
        <a target="_blank" rel="noopener noreferrer" href="https://medium.com/@landemic/f34c6b7770e8">Technical whitepaper.</a>
      </li>
      <li>
        <a target="_blank" rel="noopener noreferrer" href="https://medium.com/@landemic/f9293a346a46">Non-technical overview.</a>
      </li>
    </ul>

    <h2>
      Contact us
    </h2>
    <p>
      Telegram: <a target="_blank" rel="noopener noreferrer" href="https://t.me/landemic">https://t.me/landemic</a> <br/>
      Facebook: <a target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/landemic.io">https://www.facebook.com/landemic.io</a> <br/>
      Twitter: <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/landemic">https://twitter.com/landemic</a>
    </p>

    <hr/>
    * — The initial tile price is 0.0021 ETH which is ~$0.25. We reserve the right to change this initial price in the future based on market demand or the price fluctuations of Ether.
    <br/>
    ** — The multiple does not take into account purchase prices on 3rd-party marketplaces. The highest multiple is 100 times, and the lowest is one-tenth.

  </Popup>
);

export default Rules;
