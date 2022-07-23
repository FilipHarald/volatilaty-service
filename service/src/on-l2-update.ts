import { Level2Update } from "ccxws";
import { v3 } from "./volatility-calculator";
import * as db from "./db";
import {METRIC_BOOKS_SIZE, METRIC_EXECUTION_TIME, METRIC_VOLATILITY} from "./constants";
import _ from "lodash";

const v3Calculator = new v3();

let calcs;

const initCalculators = (markets: {id: string; base: string; quote: string;}[], calcVersions) => {
  calcs = _.reduce(markets, (acc, m) => {
    acc[m.id] = _.map(calcVersions, calcV => new calcV());
    return acc;
  }, {});
};

const logAndWrite = (version: string, volatility: number, executionTime: number, prevBooksSize: number, market: {id: string; base: string; quote: string;}) => {
    console.log(`
  version:        ${version}
  market id:      ${market.id}
  book size:      ${prevBooksSize}
  volatility:     ${volatility}
  execution time: ${executionTime}`);
    const tags = [
      ['version', version],
      ['market-id', market.id],
    ];
    db.write(METRIC_VOLATILITY, volatility, tags);
    if (market.id === "BTCUSDT") {
      db.write(METRIC_BOOKS_SIZE, prevBooksSize, tags);
      db.write(METRIC_EXECUTION_TIME, executionTime, tags);
    }
};

const update = (l2update: Level2Update, calculator, market: {id: string; base: string; quote: string;}) => {
  const start = process.hrtime();
  const { version, volatility, prevBooksSize } = calculator.update(l2update);
  if (!!version) {
    const [,nanosecondsDiff] = process.hrtime(start);
    const executionTime = nanosecondsDiff / 1_000_000;
    logAndWrite(version, volatility, executionTime, prevBooksSize, market);
  }
};

const updateAsync = async (l2update: Level2Update, calculator, market: {id: string; base: string; quote: string;}) => {
  const start = process.hrtime();
  const { version, volatility, prevBooksSize } = await calculator.update(l2update);
  if (!!version) {
    const [,nanosecondsDiff] = process.hrtime(start);
    const executionTime = nanosecondsDiff / 1_000_000;
    logAndWrite(version, volatility, executionTime, prevBooksSize, market);
  }
};

const onL2Update = (l2update: Level2Update, market: {id: string; base: string; quote: string;}) => {
  console.log(`------------------\n${Date.now()}`);
  if (market.id === "BTCUSDT") {
    updateAsync(l2update, v3Calculator, market);
  }
  _.forEach(calcs[market.id], c => update(l2update, c, market));
};

export {
  initCalculators,
  onL2Update,
}
