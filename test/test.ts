import _ from "lodash";
import { expect } from 'chai';
import { Level2Update } from "ccxws";

import { calculate, update } from '../src/volatility-calculator';

import { l2Updates } from './assets';

describe('Volatility calculation', () => {

  describe('correctness', () => {
    const books = [
      [200, 19960, 20000, 19960],
      [132, 19990, 20110, 20050],
      [66, 20050, 20060, 20055],
      [1, 20000, 20010, 20005],
    ];
    it('should calculate correctly', () => {
      expect(calculate(books)).equal(0.36147860256782666);
    });
  });

  describe('speed', () => {
    it('should be reasonably fast', () => {
      const start = process.hrtime();

      _.each(l2Updates, upd => {
        const vol = update(upd as unknown as Level2Update);
      });

      const [secondsDiff, nanosecondsDiff] = process.hrtime(start);
      expect(secondsDiff).equal(0);
      expect(nanosecondsDiff).below(1_000_000);
    });
  });
});
