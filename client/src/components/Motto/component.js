import React from 'react';
import { Link } from "react-router-dom";
import './styles.scss';

const Motto = () => (
  <div className='motto'>
    Claim your piece of the Blockchain land rush.
    Google is backing an alternative to latitude and longitude,
    that turns locations into IP addresses.
    This is an obvious piece to turn into the Blockchain.
    {' '}
    <Link to='/rules'>Learn more</Link>
  </div>
);

export default Motto;
