import { Injectable, BadRequestException } from '@nestjs/common';
import { RentCharge } from './entities/rent-charge.entity';

export interface RentChargeBreakdownItem {
  dayFrom: number;
  dayTo: number;
  daysApplied: number;
  unitCharge: number;
  charge: number;
}

export interface RentChargeResult {
  totalDays: number;
  rentCharge: number;
  breakdown: RentChargeBreakdownItem[];
}

@Injectable()
export class RentChargeEngine {
  /**
   * Calculates warehouse rent charge by distributing totalDays across
   * configured brackets, sorted by dayFrom ascending.
   *
   * Algorithm (from WAREHOUSE_MODEL_ANALYSIS.md §7):
   *   for each bracket:
   *     applicableEnd   = min(bracket.dayTo, totalDays)
   *     applicableStart = max(bracket.dayFrom, 1)
   *     daysInRange     = applicableEnd - applicableStart + 1
   *     charge         += daysInRange * unitCharge  (if daysInRange > 0)
   */
  compute(
    unstuffDate: Date,
    deliveryDate: Date,
    brackets: RentCharge[],
  ): RentChargeResult {
    const totalDays = this.daysBetween(unstuffDate, deliveryDate);

    if (totalDays < 0)
      throw new BadRequestException(
        'Delivery date must be after unstuffing date',
      );

    if (brackets.length === 0)
      throw new BadRequestException('No rent charge brackets configured');

    const sorted = [...brackets].sort((a, b) => a.dayFrom - b.dayFrom);
    const breakdown: RentChargeBreakdownItem[] = [];
    let rentCharge = 0;

    for (const bracket of sorted) {
      if (totalDays < bracket.dayFrom) continue;

      const applicableStart = Math.max(bracket.dayFrom, 1);
      const applicableEnd = Math.min(bracket.dayTo, totalDays);
      const daysApplied = applicableEnd - applicableStart + 1;

      if (daysApplied <= 0) continue;

      const charge = Math.round(daysApplied * bracket.unitCharge * 100) / 100;
      rentCharge += charge;

      breakdown.push({
        dayFrom: bracket.dayFrom,
        dayTo: bracket.dayTo,
        daysApplied,
        unitCharge: bracket.unitCharge,
        charge,
      });
    }

    return {
      totalDays,
      rentCharge: Math.round(rentCharge * 100) / 100,
      breakdown,
    };
  }

  private daysBetween(from: Date, to: Date): number {
    const msPerDay = 1000 * 60 * 60 * 24;
    const fromMs = new Date(from).setHours(0, 0, 0, 0);
    const toMs = new Date(to).setHours(0, 0, 0, 0);
    return Math.round((toMs - fromMs) / msPerDay);
  }
}
