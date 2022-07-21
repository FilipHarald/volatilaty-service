import * as v1 from "./v1";
import * as v2 from "./v2";
// TODO: should be utilizing TS
const v3 = require('calculator-v3');

console.log(v3.hello());

export {
  v1,
  v2,
  v3,
};
