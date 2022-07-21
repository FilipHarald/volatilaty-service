import { BinanceFuturesUsdtmClient as Client } from "ccxws";
import * as calculator from "./volatility-calculator";
import * as db from "./db";
import {METRIC_EXECUTION_TIME, METRIC_VOLATILITY} from "./constants";

const market = {
  id: "BTCUSDT",
  base: "BTC",
  quote: "USDT",
};

const client = new Client();

const onL2Update = (l2update, calculator) => {
  const start = process.hrtime();
  const { version, volatility } = calculator.update(l2update);
  if (!!version) {
    const [,nanosecondsDiff] = process.hrtime(start);
    const executionTime = nanosecondsDiff / 1_000_000;
    console.log(`
  timestamp:      ${Date.now()}
  volatility:     ${volatility}
  execution time: ${executionTime}`);
    const tags = [
      ['version', version]
    ];
    db.write(METRIC_VOLATILITY, volatility, tags);
    db.write(METRIC_EXECUTION_TIME, executionTime, tags);
  }
};

client.on("l2update", l2update => {
  onL2Update(l2update, calculator.v1);
  onL2Update(l2update, calculator.v2);
});

const start = async () => {
  console.log('starting...');
  await db.init();
  client.subscribeLevel2Updates(market);
};

start();
