import {expect} from 'chai';
import {calculate} from '../src/volatility-calculator';

describe('Volatility calculation', () => {
  describe('volatility metric', () => {
    const orders = [
      [200, 19960, 20000, 19960],
      [132, 19990, 20110, 20050],
      [66, 20050, 20060, 20055],
      [1, 20000, 20010, 20005],
    ];
    it('should be correct', () => {
      expect(calculate(orders)).equal(0.36147860256782666);
    });
  });
});
