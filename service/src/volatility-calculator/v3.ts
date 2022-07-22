import {Level2Update} from "ccxws";

class v3 {
  calcV3;

  constructor() {
    this.calcV3 = require('calculator-v3');
  }

  updateBooks(...args) {
    return this.calcV3.updateBooks(...args);
  }
  calculate(...args) {
    return this.calcV3.calculate(...args);
  }
  async update(l2Update: Level2Update) {
    try {
      return await this.calcV3.update(
        l2Update.timestampMs,
        l2Update.bids,
        l2Update.asks,
      );
    } catch (err) {
      console.error(err);
      return {
        version: '3',
        volatility: null
      }
    }
  }
}

export default v3;
