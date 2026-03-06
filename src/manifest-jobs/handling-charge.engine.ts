import { Injectable, BadRequestException } from '@nestjs/common';
import { PrincipalChargeService } from '../principal-charges/principal-charge.service';
import { PrincipalChargeType } from '../principal-charges/principal-charge-type.entity';

export interface HandlingChargeResult {
  handCharge: number;
  currencyRate: number;
  totalHandCharge: number;
  breakdown: { chargeType: string; calcMode: string; subCharge: number }[];
}

@Injectable()
export class HandlingChargeEngine {
  constructor(private principalChargeService: PrincipalChargeService) {}

  async compute(principalId: string, cbm: number, manager: any): Promise<HandlingChargeResult> {
    const setup = await this.principalChargeService.findSetupForCalculation(principalId, manager);
    if (!setup) throw new BadRequestException('No handling charge setup found for this principal');
    if (!setup.currency.isActive) throw new BadRequestException('Currency for this principal is not active');

    // Sort by sortOrder, cap at 10 per doc section 2.4.1
    const chargeTypes = [...setup.chargeTypes]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .slice(0, 10);

    const breakdown: HandlingChargeResult['breakdown'] = [];
    let handCharge = 0;

    for (const ct of chargeTypes) {
      const sub = this.computeSub(ct, cbm);
      breakdown.push({ chargeType: ct.chargeType, calcMode: ct.calcMode, subCharge: sub });
      handCharge += sub;
    }

    const currencyRate = setup.currency.rate;
    const totalHandCharge = handCharge * currencyRate;

    return { handCharge, currencyRate, totalHandCharge, breakdown };
  }

  /** Per doc section 2.4.2: MIN_MAX, MAX, FIXED logic */
  private computeSub(ct: PrincipalChargeType, cbm: number): number {
    if (ct.calcMode === 'FIXED') {
      return ct.fixedValue ?? 0;
    }
    if (ct.calcMode === 'MAX') {
      return ct.maxValue ?? 0;
    }
    // MIN_MAX: if min*cbm < max, use max; else use min*cbm
    const minTimesCbm = (ct.minValue ?? 0) * cbm;
    const max = ct.maxValue ?? 0;
    return minTimesCbm < max ? max : minTimesCbm;
  }
}
