import { BinanceFuturesUsdtmClient as Client, Level2Update } from "ccxws";
import * as calculator from "./volatility-calculator";
import * as db from "./db";
import {METRIC_BOOKS_SIZE, METRIC_EXECUTION_TIME, METRIC_VOLATILITY} from "./constants";

const market = {
  id: "BTCUSDT",
  base: "BTC",
  quote: "USDT",
};

const client = new Client();

const logAndWrite = (version: string, volatility: number, executionTime: number, prevBooksSize: number) => {
    console.log(`
  version:        ${version}
  bookSize:       ${prevBooksSize}
  volatility:     ${volatility}
  execution time: ${executionTime}`);
    const tags = [
      ['version', version]
    ];
    db.write(METRIC_VOLATILITY, volatility, tags);
    db.write(METRIC_EXECUTION_TIME, executionTime, tags);
    db.write(METRIC_BOOKS_SIZE, prevBooksSize, tags);
};

const onL2Update = (l2update: Level2Update, calculator) => {
  const start = process.hrtime();
  const { version, volatility, prevBooksSize } = calculator.update(l2update);
  if (!!version) {
    const [,nanosecondsDiff] = process.hrtime(start);
    const executionTime = nanosecondsDiff / 1_000_000;
    logAndWrite(version, volatility, executionTime, prevBooksSize);
  }
};

const onL2UpdateAsync = async (l2update: Level2Update, calculator: {test?: any; updateBooks?: any; calculate?: any; update: any;}) => {
  const start = process.hrtime();
  const { version, volatility, prevBooksSize } = await calculator.update(l2update);
  if (!!version) {
    const [,nanosecondsDiff] = process.hrtime(start);
    const executionTime = nanosecondsDiff / 1_000_000;
    logAndWrite(version, volatility, executionTime, prevBooksSize);
  }
};

client.on("l2update", (l2update: Level2Update) => {
  console.log(`------------------\n${Date.now()}`);
  onL2Update(l2update, calculator.v1);
  onL2Update(l2update, calculator.v2);
  onL2UpdateAsync(l2update, calculator.v3);
});

const start = async () => {
  console.log('starting...');
  await db.init();
  client.subscribeLevel2Updates(market);
};

start();
