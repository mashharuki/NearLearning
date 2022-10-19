// near api js
import { providers } from 'near-api-js';
// wallet selector UI
import '@near-wallet-selector/modal-ui/styles.css';
import { setupModal } from '@near-wallet-selector/modal-ui';
import LedgerIconUrl from '@near-wallet-selector/ledger/assets/ledger-icon.png';
import MyNearIconUrl from '@near-wallet-selector/my-near-wallet/assets/my-near-wallet-icon.png';

// wallet selector options
import { setupWalletSelector } from '@near-wallet-selector/core';
import { setupLedger } from '@near-wallet-selector/ledger';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';

const THIRTY_TGAS = '30000000000000';
const NO_DEPOSIT = '0';

/**
 * Wallet Class
 */
export class Wallet {

  walletSelector;
  wallet;
  network;
  createAccessKeyFor;

  /**
   * constructor
   * @param {*} param0 
   */
  constructor({ createAccessKeyFor = undefined, network = 'testnet' }) {
    this.createAccessKeyFor = createAccessKeyFor
    this.network = 'testnet'
  }

  /**
   * startUp function
   */
  async startUp() {
    this.walletSelector = await setupWalletSelector({
      network: this.network,
      modules: [setupMyNearWallet({ iconUrl: MyNearIconUrl }),
      setupLedger({ iconUrl: LedgerIconUrl })],
    });
    // check status
    const isSignedIn = this.walletSelector.isSignedIn();

    if (isSignedIn) {
      this.wallet = await this.walletSelector.wallet();
      this.accountId = this.walletSelector.store.getState().accounts[0].accountId;
    }

    return isSignedIn;
  }

  /**
   * Sign-in method
   */
  signIn() {
    const description = 'Please select a wallet to sign in.';
    const modal = setupModal(this.walletSelector, { contractId: this.createAccessKeyFor, description });
    modal.show();
  }

  /**
   * Sign-out method
   */
  signOut() {
    // signOut
    this.wallet.signOut();
    this.wallet = this.accountId = this.createAccessKeyFor = null;
    window.location.replace(window.location.origin + window.location.pathname);
  }

  /**
   * viewMethod function
   * @param {*} param0 contract ID & method name & args
   * @returns 
   */
  async viewMethod({ contractId, method, args = {} }) {
    const { network } = this.walletSelector.options;
    // get provider
    const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });
    // call function
    let res = await provider.query({
      request_type: 'call_function',
      account_id: contractId,
      method_name: method,
      args_base64: Buffer.from(JSON.stringify(args)).toString('base64'),
      finality: 'optimistic',
    });

    return JSON.parse(Buffer.from(res.result).toString());
  }

  /**
   * callMethod function
   * @param {*} param0 contract ID & method name & args
   * @returns 
   */
  async callMethod({ contractId, method, args = {}, gas = THIRTY_TGAS, deposit = NO_DEPOSIT }) {
    
    // Sign a transaction with the "FunctionCall" action
    return await this.wallet.signAndSendTransaction({
      signerId: this.accountId,
      receiverId: contractId,
      actions: [
        {
          type: 'FunctionCall',
          params: {
            methodName: method,
            args,
            gas,
            deposit,
          },
        },
      ],
    });
  }

  /**
   * Get transaction result from the network
   * @param {*} txhash 
   * @returns 
   */
  async getTransactionResult(txhash) {
    const { network } = this.walletSelector.options;
    // get provider
    const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });

    // get tx info
    const transaction = await provider.txStatus(txhash, 'unnused');
    // get tx
    return providers.getTransactionLastResult(transaction);
  }
}