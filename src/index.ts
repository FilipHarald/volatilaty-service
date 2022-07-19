import { BinanceFuturesUsdtmClient as Client } from "ccxws";
import * as calculator from "./volatility-calculator";

const market = {
  id: "BTCUSDT",
  base: "BTC",
  quote: "USDT",
};

const client = new Client();

client.on("l2update", l2update => {

//  const l = {
//    ...l2update,
//    asks: l2update.asks.slice(0, 10),
//    bids: l2update.bids.slice(0, 10)
//  };
//  console.log(l);

  const start = process.hrtime();
  const volatility = calculator.update(l2update);
  const [secondsDiff, nanosecondsDiff] = process.hrtime(start);
  console.log(`
timestamp:      ${Date.now()}
volatility:     ${volatility}
execution time: ${(nanosecondsDiff) / 1_000_000}`);
});

console.log('starting...');

client.subscribeLevel2Updates(market);
