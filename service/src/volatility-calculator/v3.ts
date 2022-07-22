import {Level2Update} from "ccxws";

const calcV3 = require('calculator-v3');

const updateBooks = calcV3.updateBooks;
const calculate = calcV3.calculate;
const update = async (l2Update: Level2Update) => {
  try {
    return await calcV3.update(
      l2Update.timestampMs,
      l2Update.bids,
      l2Update.asks,
    );
  } catch (err) {
    return {
      version: '3',
      volatility: null
    }
  }
}

export {
  updateBooks,
  calculate,
  update,
};
