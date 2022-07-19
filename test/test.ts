import {expect} from 'chai';
import {calculate} from '../src/volatility-calculator';

describe('Volatility calculation', () => {
    const fewOrders = [
      [200, 19960, 20000, 19960],
      [132, 19990, 20110, 20050],
      [66, 20050, 20060, 20055],
      [1, 20000, 20010, 20005],
    ];
  describe('correctness', () => {
    it('should be correct', () => {
      expect(calculate(fewOrders)).equal(0.36147860256782666);
    });
  });
  describe('speed', () => {
    it('should be fast enough', () => {
      const start = process.hrtime();
      calculate(fewOrders);
      const [secondsDiff, nanosecondsDiff] = process.hrtime(start);
      expect(secondsDiff).equal(0);
      expect(nanosecondsDiff).below(1_000_000);
    });
    it('should be blazingly fast', () => {
      // TODO
    });
  });
});
