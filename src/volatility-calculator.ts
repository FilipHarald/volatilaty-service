const TIMESTAMP_INDEX = 0;
const MIDPRICE_INDEX = 3;

const calculate = (orders: number[][]) => {
  return orders.slice(0, orders.length-1).reduce((acc, currOrder, index) => {
    return acc + (
      Math.abs(currOrder[MIDPRICE_INDEX] - orders[index + 1][MIDPRICE_INDEX])
      / currOrder[MIDPRICE_INDEX]
      / (currOrder[TIMESTAMP_INDEX] - orders[index + 1][TIMESTAMP_INDEX])
    );
  }, 0) / (orders.length - 1) * 10_000;
};

export {
  calculate
}
