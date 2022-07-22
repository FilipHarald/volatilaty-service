import _ from "lodash";
import { BinanceFuturesUsdtmClient as Client} from "ccxws";
import * as db from "./db";
import * as messageProccessor from "./on-l2-update";
import {MARKETS} from "./constants";
import {v1} from "./volatility-calculator";

const client = new Client();
client.on("l2update", messageProccessor.onL2Update);

const start = async () => {
  console.log('starting...');
  await db.init();
  messageProccessor.initCalculators(MARKETS, [v1]);
  _.forEach(MARKETS, market => client.subscribeLevel2Updates(market))
};

start();
