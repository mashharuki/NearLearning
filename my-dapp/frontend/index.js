// React
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// NEAR
import { HelloNEAR } from './near-interface';
import { Wallet } from './near-wallet';

const wallet = new Wallet({ createAccessKeyFor: process.env.CONTRACT_NAME })
const helloNEAR = new HelloNEAR({ contractId: process.env.CONTRACT_NAME, walletToUse: wallet });

// Setup on page load
window.onload = async () => {
  const isSignedIn = await wallet.startUp()
 
  ReactDOM.render(
    <App 
      isSignedIn={isSignedIn} 
      helloNEAR={helloNEAR} 
      wallet={wallet}
    />,
    document.getElementById('root')
  );
}