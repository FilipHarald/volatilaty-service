import { BinanceFuturesUsdtmClient as Client } from "ccxws";
import * as calculator from "./volatility-calculator";
import * as db from "./db";

const market = {
  id: "BTCUSDT",
  base: "BTC",
  quote: "USDT",
};

const client = new Client();

client.on("l2update", l2update => {

  const start = process.hrtime();
  const { version, volatility } = calculator.update(l2update);
  const [,nanosecondsDiff] = process.hrtime(start);
  console.log(`
timestamp:      ${Date.now()}
volatility:     ${volatility}
execution time: ${(nanosecondsDiff) / 1_000_000}`);
  const tags = [
    ['version', version]
  ];
  db.writeVolatilityMetric(volatility, tags);
});

const start = async () => {
  console.log('starting...');
  await db.init();
  client.subscribeLevel2Updates(market);
};

start();
