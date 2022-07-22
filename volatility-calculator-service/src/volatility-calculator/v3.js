const v3 = require('calculator-v3');

const test = v3.test;

const updateBooks = v3.updateBooks;

const calculate = v3.calculate;

const update = (l2Update) => {
  return v3.update(
    l2Update.timestampMs,
    l2Update.bids,
    l2Update.asks,
  );
}

module.exports = {
  test,
  updateBooks,
  calculate,
  update,
};
