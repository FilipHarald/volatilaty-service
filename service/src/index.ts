import _ from "lodash";
import { BinanceFuturesUsdtmClient as Client} from "ccxws";
import * as db from "./db";
import onL2Update from "./on-l2-update";
import {MARKETS} from "./constants";

const client = new Client();
client.on("l2update", onL2Update);

const start = async () => {
  console.log('starting...');
  await db.init();
  _.forEach(MARKETS, market => client.subscribeLevel2Updates(market))
};

start();
