
/**
 * HelloNEAR Class
 */
export class HelloNEAR {
  
  /**
   * contructor
   * @param {*} param0 
   */
  constructor({ contractId, walletToUse }) {
    this.contractId = contractId;
    this.wallet = walletToUse;    
  }

  /**
   * getGreeting function
   * @returns greeting
   */
  async getGreeting() {
    return await this.wallet.viewMethod({ 
      contractId: this.contractId, 
      method: 'get_greeting' 
    });
  }

  /**
   * setGreeting function
   * @param {*} greeting new greeting
   * @returns 
   */
  async setGreeting(greeting) {
    return await this.wallet.callMethod({ 
      contractId: this.contractId, 
      method: 'set_greeting', 
      args: { 
        message: greeting 
      } 
    });
  }
}