import { Level2Update } from "ccxws";
import * as calculator from "./volatility-calculator";
import * as db from "./db";
import {METRIC_BOOKS_SIZE, METRIC_EXECUTION_TIME, METRIC_VOLATILITY} from "./constants";

const logAndWrite = (version: string, volatility: number, executionTime: number, prevBooksSize: number, market: {id: string; base: string; quote: string;}) => {
    console.log(`
  version:        ${version}
  bookSize:       ${prevBooksSize}
  volatility:     ${volatility}
  execution time: ${executionTime}`);
    const versionTag = ['version', version];
    const metricTags = [
      versionTag,
      ['market-id', market.id],
      ['market-base', market.base],
      ['market-quote', market.quote],
    ];
    db.write(METRIC_VOLATILITY, volatility, metricTags);
    db.write(METRIC_EXECUTION_TIME, executionTime, [versionTag]);
    db.write(METRIC_BOOKS_SIZE, prevBooksSize, [versionTag]);
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
  // TODO: calculators should be init from index.ts for easier configuration. Even better to have as env-vars...
  update(l2update, calculator.v1, market);
  updateAsync(l2update, calculator.v3, market);
};

export default onL2Update;
