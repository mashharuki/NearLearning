// React
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// NEAR
import { HelloNEAR } from './assets/js/near/near-interface';
import { Wallet } from './assets/js/near/near-wallet';

// get wallet object
const wallet = new Wallet({ createAccessKeyFor: process.env.CONTRACT_NAME });
// get helloNEAR Contract Object
const helloNEAR = new HelloNEAR({ contractId: process.env.CONTRACT_NAME, walletToUse: wallet });

// Setup on page load
window.onload = async () => {
  // call startUp function
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