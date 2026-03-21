import { RentChargeEngine } from './rent-charge.engine';
import { RentCharge } from './entities/rent-charge.entity';

const brackets = (): RentCharge[] =>
  [
    { dayFrom: 1, dayTo: 7, unitCharge: 0 },
    { dayFrom: 8, dayTo: 14, unitCharge: 11.64 },
    { dayFrom: 15, dayTo: 1000, unitCharge: 23.27 },
  ] as RentCharge[];

const d = (s: string) => new Date(s);

describe('RentChargeEngine', () => {
  let engine: RentChargeEngine;

  beforeEach(() => {
    engine = new RentChargeEngine();
  });

  // ─── compute (normal rent) ────────────────────────────────────────────────

  describe('compute', () => {
    it('produces the §1.1 example: 42 days → GHC 733.04', () => {
      // 06 Feb 2026 → 19 Mar 2026 = 42 days
      const result = engine.compute(d('2026-02-06'), d('2026-03-19'), brackets());

      expect(result.totalDays).toBe(42);
      expect(result.rentCharge).toBe(733.04);
      expect(result.breakdown).toHaveLength(3);

      const [free, mid, high] = result.breakdown;
      expect(free).toMatchObject({ daysApplied: 7, unitCharge: 0, charge: 0 });
      expect(mid).toMatchObject({ daysApplied: 7, unitCharge: 11.64, charge: 81.48 });
      expect(high).toMatchObject({ daysApplied: 28, unitCharge: 23.27, charge: 651.56 });
    });

    it('charges nothing for days 1–7 (free bracket)', () => {
      const result = engine.compute(d('2026-01-01'), d('2026-01-07'), brackets());
      expect(result.totalDays).toBe(7);
      expect(result.rentCharge).toBe(0);
    });

    it('charges only the mid bracket for exactly 14 days', () => {
      const result = engine.compute(d('2026-01-01'), d('2026-01-14'), brackets());
      expect(result.totalDays).toBe(14);
      // 7 free + 7 × 11.64 = 81.48
      expect(result.rentCharge).toBe(81.48);
    });

    it('throws when delivery is before unstuffing', () => {
      expect(() =>
        engine.compute(d('2026-03-19'), d('2026-02-06'), brackets()),
      ).toThrow('Delivery date must be after unstuffing date');
    });

    it('throws when no brackets configured', () => {
      expect(() =>
        engine.compute(d('2026-01-01'), d('2026-01-10'), []),
      ).toThrow('No rent charge brackets configured');
    });

    it('sorts brackets regardless of input order', () => {
      const shuffled = [...brackets()].reverse();
      const result = engine.compute(d('2026-02-06'), d('2026-03-19'), shuffled);
      expect(result.rentCharge).toBe(733.04);
    });
  });

  // ─── computeAdditional ───────────────────────────────────────────────────

  describe('computeAdditional', () => {
    it('produces the §1.4 example: 1 extra day after 42 → GHC 23.27', () => {
      // unstuff = delivery = 20 Mar 2026 → 1 day
      const result = engine.computeAdditional(
        d('2026-03-20'),
        d('2026-03-20'),
        brackets(),
        42,
      );

      expect(result.totalDays).toBe(1);
      expect(result.rentCharge).toBe(23.27);
      expect(result.breakdown[0]).toMatchObject({
        dayFrom: 15,
        dayTo: 1000,
        daysApplied: 1,
        unitCharge: 23.27,
        charge: 23.27,
      });
    });

    it('uses mid bracket when previousDays = 7 (next day is 8)', () => {
      const result = engine.computeAdditional(
        d('2026-01-01'),
        d('2026-01-03'), // 3 new days
        brackets(),
        7,
      );
      expect(result.totalDays).toBe(3);
      expect(result.rentCharge).toBe(3 * 11.64);
      expect(result.breakdown[0].unitCharge).toBe(11.64);
    });

    it('falls back to last bracket when previousDays exceeds all ranges', () => {
      const result = engine.computeAdditional(
        d('2026-01-01'),
        d('2026-01-02'), // 2 new days
        brackets(),
        2000, // beyond dayTo 1000
      );
      expect(result.breakdown[0].unitCharge).toBe(23.27);
    });

    it('throws when delivery is before unstuffing', () => {
      expect(() =>
        engine.computeAdditional(d('2026-03-20'), d('2026-03-19'), brackets(), 42),
      ).toThrow('Delivery date must be after unstuffing date');
    });

    it('throws when no brackets configured', () => {
      expect(() =>
        engine.computeAdditional(d('2026-01-01'), d('2026-01-02'), [], 42),
      ).toThrow('No rent charge brackets configured');
    });
  });

  // ─── rent tariff derivation (§1.2) ───────────────────────────────────────

  describe('rent tariff (CBM / Weight)', () => {
    it('CBM: 4 × 733.04 = 2932.16', () => {
      const { rentCharge } = engine.compute(d('2026-02-06'), d('2026-03-19'), brackets());
      expect(Math.round(4 * rentCharge * 100) / 100).toBe(2932.16);
    });

    it('Weight: 10 × 733.04 = 7330.40', () => {
      const { rentCharge } = engine.compute(d('2026-02-06'), d('2026-03-19'), brackets());
      expect(Math.round(10 * rentCharge * 100) / 100).toBe(7330.4);
    });

    it('Additional CBM: 4 × 23.27 = 93.08 (§1.4)', () => {
      const { rentCharge } = engine.computeAdditional(
        d('2026-03-20'),
        d('2026-03-20'),
        brackets(),
        42,
      );
      expect(Math.round(4 * rentCharge * 100) / 100).toBe(93.08);
    });
  });
});
