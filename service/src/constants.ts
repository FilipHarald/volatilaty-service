const TIMESTAMP_INDEX = 0;
const MIDPRICE_INDEX = 3;

const METRIC_EXECUTION_TIME = 'execution-time';
const METRIC_VOLATILITY = 'volatility';
const METRIC_BOOKS_SIZE = 'books-size';

const MARKETS = [
  {
    id: "BTCUSDT",
    base: "BTC",
    quote: "USDT"
  },
  {
    id: "BNBUSDT",
    base: "BNB",
    quote: "USDT"
  },
  {
    id: "ETHUSDT",
    base: "ETH",
    quote: "USDT"
  },
  {
    id: "BCHUSDT",
    base: "BCH",
    quote: "USDT"
  },
  {
    id: "XRPUSDT",
    base: "XRP",
    quote: "USDT"
  },
  {
    id: "EOSUSDT",
    base: "EOS",
    quote: "USDT"
  },
  {
    id: "LTCUSDT",
    base: "LTC",
    quote: "USDT"
  },
  {
    id: "TRXUSDT",
    base: "TRX",
    quote: "USDT"
  },
];

export {
  TIMESTAMP_INDEX,
  MIDPRICE_INDEX,
  METRIC_EXECUTION_TIME,
  METRIC_VOLATILITY,
  METRIC_BOOKS_SIZE,
  MARKETS,
};
