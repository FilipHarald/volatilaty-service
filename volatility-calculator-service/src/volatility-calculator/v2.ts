import _ from "lodash";
import { Level2Update } from "ccxws";
import {MIDPRICE_INDEX, TIMESTAMP_INDEX} from "../constants";

// NOTE: this version was made to avoid fluctuations in the initial calculations. The fluctuation turned out to be a bug in how the rolling window was handled. Therefore, the only difference from v1 is that it is delayed 200 ms.

let prevBooks = [];
let firstBookTimestamp: number;

const updateBooks = (l2Update: Level2Update) => {
  const bestBid = Number(
    _.findLast(l2Update.bids, b => Number(b.size) > 0)
  ?.price);
  const bestAsk = Number(
    _.find(l2Update.asks, a => Number(a.size) > 0)
  ?.price);

  // TODO: maybe do something else?
  if (!bestAsk || !bestBid) return;

  const book = [
    l2Update.timestampMs,
    bestBid,
    bestAsk,
    (bestBid + bestAsk) / 2,
  ];

  const outdatedThreshold = l2Update.timestampMs - 200;

  const lastIndexWithinWindow = _.findLastIndex(prevBooks, prevBook => prevBook[TIMESTAMP_INDEX] > outdatedThreshold);

  prevBooks = [
    book,
  ...prevBooks.slice(0, lastIndexWithinWindow + 1),
  ];
};

const calculate = (orders: number[][]) => {
  const allButLastOrder = orders.slice(0, orders.length-1);
  return _.reduce(allButLastOrder, (acc, currOrder, index) => {
    return acc + (
      Math.abs(currOrder[MIDPRICE_INDEX] - orders[index + 1][MIDPRICE_INDEX])
      / currOrder[MIDPRICE_INDEX]
      / (currOrder[TIMESTAMP_INDEX] - orders[index + 1][TIMESTAMP_INDEX])
    );
  }, 0) / (orders.length - 1) * 10_000;
};

const update = (l2Update: Level2Update) => {
  updateBooks(l2Update);
  firstBookTimestamp = firstBookTimestamp || l2Update.timestampMs;
  if (firstBookTimestamp + 200 < l2Update.timestampMs) { // to avoid fluctuation in first calculations
    return {
      version: '2',
      volatility: calculate(prevBooks) || 0
    }
  }
  return {
    version: '2',
    volatility: null
  }
};

export {
  updateBooks,
  calculate,
  update,
};
