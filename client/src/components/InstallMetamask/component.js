import React from 'react'
import { Link } from '../../shared'
import CheckMetamask from '../CheckMetamask';
import './styles.scss';

const InstallMetamask = () => (
    <CheckMetamask msg={<span>Install <Link link={'https://metamask.io/'} title={'MetaMask'}/> <br/> to play Landemic</span>} />
);

export default InstallMetamask;
