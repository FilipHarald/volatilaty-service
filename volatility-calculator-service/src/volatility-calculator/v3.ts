import {Level2Update} from "ccxws";

// TODO: should be utilizing TS
const v3 = require('calculator-v3');

const test = v3.test;

const updateBooks = v3.updateBooks;

const calculate = v3.calculate;

const update = (l2Update: Level2Update) => {
  return v3.update(
    l2Update.timestampMs as Number,
    l2Update.bids,
    l2Update.asks,
  );
}

export {
  test,
  updateBooks,
  calculate,
  update,
};
