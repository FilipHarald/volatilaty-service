import _ from "lodash";
import { Level2Update } from "ccxws";
import {MIDPRICE_INDEX, TIMESTAMP_INDEX} from "../constants";

let prevBooks = [];

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
  return {
    version: '1',
    volatility: calculate(prevBooks) || 0
  }
};

export {
  updateBooks,
  calculate,
  update,
};
