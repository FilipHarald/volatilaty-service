import {expect} from 'chai';
import {calculate} from '../src/volatility-calculator';

describe('Volatility calculation', () => {
  describe('correctness', () => {
    it('should be correct', () => {
      expect(calculate(1)).equal(1);
    });
  });
});
