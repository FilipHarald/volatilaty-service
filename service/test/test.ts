import _ from "lodash";
import { Level2Update } from "ccxws";
import { expect } from 'chai';

import { v1, v3 } from '../src/volatility-calculator';

import { l2Updates } from './assets';

describe('Volatility calculation', () => {

  describe('correctness', () => {
    const books = [
      [200, 19960, 20000, 19960],
      [132, 19990, 20110, 20050],
      [66, 20050, 20060, 20055],
      [1, 20000, 20010, 20005],
    ];
    describe('v1', () => {
      const calc = new v1();
      it('should calculate correctly', () => {
        expect(calc.calculate(books)).equal(0.36147860256782666);
      });
      it('should return correct version', async () => {
        expect(
          calc.update(l2Updates[0] as unknown as Level2Update).version
        ).equal('1');
      });
      it('should return correct volatility with rolling window', async () => {
        const calc0 = new v1();
        calc0.update(l2Updates[0] as unknown as Level2Update).volatility;
        calc0.update(l2Updates[1] as unknown as Level2Update).volatility;
        calc0.update(l2Updates[2] as unknown as Level2Update).volatility;
        calc0.update(l2Updates[3] as unknown as Level2Update).volatility;
        expect(
          calc0.update(l2Updates[4] as unknown as Level2Update).volatility
        ).equal(0.17699841196990795);
        expect(
          calc0.update(l2Updates[5] as unknown as Level2Update).volatility
        ).equal(0.16003151392510687);
      });
      it('should not be affected by other instances', async () => {
        const calc1 = new v1();
        const calc2 = new v1();
        calc1.update(l2Updates[0] as unknown as Level2Update)
        calc2.update(l2Updates[1] as unknown as Level2Update)
        expect(
          calc1.update(l2Updates[2] as unknown as Level2Update).volatility
        ).equal(0.32359404151289345);
      });
    });
    describe('v3', () => {
      const calc = new v3();
      // TODO: change rust-code to export calculate-functoin
      it.skip('should calculate correctly', () => {
        expect(calc.calculate(books)).equal(0.36147860256782666);
      });
      it('should return correct version', async () => {
        expect(
          (await calc.update(l2Updates[0] as unknown as Level2Update)).version
        ).equal('3');
      });
      it('should return correct volatility with rolling window', async () => {
        const calc0 = new v3();
        (await calc0.update(l2Updates[0] as unknown as Level2Update)).volatility;
        (await calc0.update(l2Updates[1] as unknown as Level2Update)).volatility;
        (await calc0.update(l2Updates[2] as unknown as Level2Update)).volatility;
        (await calc0.update(l2Updates[3] as unknown as Level2Update)).volatility;
        expect(
          (await calc0.update(l2Updates[4] as unknown as Level2Update)).volatility
        ).equal(0.17699841196990795);
        expect(
          (await calc0.update(l2Updates[5] as unknown as Level2Update)).volatility
        ).equal(0.16003151392510687);
      });
      it.skip('should not be affected by other instances', async () => {
        // TODO: fix so that each instance will have it's own memory
        const calc2 = new v3();
        const calc3 = new v3();
        await calc2.update(l2Updates[0] as unknown as Level2Update)
        await calc3.update(l2Updates[1] as unknown as Level2Update)
        expect(
          (await calc2.update(l2Updates[2] as unknown as Level2Update)).volatility
        ).equal(0.32359404151289345);
      });
    });
  });

  describe('speed', () => {
    describe('v1', () => {
      const calc = new v1();
      it('should be reasonably fast', () => {
        const start = process.hrtime();

        _.each(l2Updates, upd => {
          calc.update(upd as unknown as Level2Update);
        });

        const [secondsDiff, nanosecondsDiff] = process.hrtime(start);
        expect(secondsDiff).equal(0);
        expect(nanosecondsDiff / l2Updates.length).below(1_000_000);
      });
      it('should be blazingly fast', () => {
        const start = process.hrtime();

        _.each(l2Updates, upd => {
          calc.update(upd as unknown as Level2Update);
        });

        const [secondsDiff, nanosecondsDiff] = process.hrtime(start);
        expect(secondsDiff).equal(0);
        expect(nanosecondsDiff).below(1_000_000);
      });
    });
    describe('v3', () => {
      const calc = new v3();
      it('should be reasonably fast', () => {
        const start = process.hrtime();

        _.each(l2Updates, upd => {
          calc.update(upd as unknown as Level2Update);
        });

        const [secondsDiff, nanosecondsDiff] = process.hrtime(start);
        expect(secondsDiff).equal(0);
        expect(nanosecondsDiff / l2Updates.length).below(1_000_000);
      });
      it('should be blazingly fast', () => {
        const start = process.hrtime();

        _.each(l2Updates, upd => {
          calc.update(upd as unknown as Level2Update);
        });

        const [secondsDiff, nanosecondsDiff] = process.hrtime(start);
        expect(secondsDiff).equal(0);
        expect(nanosecondsDiff).below(1_000_000);
      });
    });
  });
});
