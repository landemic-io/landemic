
import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import {DrizzleContext} from 'drizzle-react';
import './index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import createStore from "./drizzleStore";
import CheckMetamask from "./components/CheckMetamask";
// import InstallMetamask from "./components/InstallMetamask";

// require('dotenv').config({path:__dirname+'./../../.env'})
// console.log(__dirname+'./../../.env')
// console.log(process.env)

function getRoot() {

  // this method is deprecated by MetaMask
  // https://docs.metamask.io/guide/ethereum-provider.html
  var web3 = window.web3;

  // if (!web3)
  //   return <InstallMetamask />

  if (web3 && web3.currentProvider.networkVersion && parseInt(web3.currentProvider.networkVersion) !== 1 && process.env.NODE_ENV === "production")
    return <CheckMetamask msg={<span>Please switch MetaMask<br/>to Mainnet</span>} />

  return (<Router>
        <DrizzleContext.Provider drizzle={createStore()}>
          <CheckMetamask msg={<span>Reload if you don't see MetaMask pop up</span>} />
          <App/>
        </DrizzleContext.Provider>
      </Router>);
}

window.addEventListener('load', function () {
  ReactDOM.render(getRoot(),document.getElementById('root'));
})

serviceWorker.unregister();
