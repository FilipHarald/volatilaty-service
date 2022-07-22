import _ from "lodash";
import { Level2Update } from "ccxws";
import {MIDPRICE_INDEX, TIMESTAMP_INDEX} from "../constants";

class v1 {
  prevBooks;

  constructor() {
    this.prevBooks = [];
  };

  updateBooks(l2Update: Level2Update) {
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
    const lastIndexWithinWindow = _.findLastIndex(this.prevBooks, prevBook => prevBook[TIMESTAMP_INDEX] > outdatedThreshold);

    this.prevBooks = [
      book,
      ...this.prevBooks.slice(0, lastIndexWithinWindow + 1),
    ];
  };

  calculate(orders: number[][]) {
    const allButLastOrder = orders.slice(0, orders.length-1);
    return _.reduce(allButLastOrder, (acc, currOrder, index) => {
      return acc + (
        Math.abs(currOrder[MIDPRICE_INDEX] - orders[index + 1][MIDPRICE_INDEX])
        / currOrder[MIDPRICE_INDEX]
        / (currOrder[TIMESTAMP_INDEX] - orders[index + 1][TIMESTAMP_INDEX])
      );
    }, 0) / (orders.length - 1) * 10_000;
  };

  update(l2Update: Level2Update) {
    this.updateBooks(l2Update);
    return {
      version: '1',
      prevBooksSize: this.prevBooks.length,
      volatility: this.calculate(this.prevBooks) || 0
    }
  };
}

export default v1;
