import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { TenantService } from '../tenant/tenant.service';
import { PrincipalChargeSetup } from './principal-charge-setup.entity';
import { PrincipalChargeType } from './principal-charge-type.entity';
import { Principal } from '../principals/principal.entity';
import { Currency } from '../currencies/currency.entity';
import { UpsertPrincipalChargeSetupDto } from './principal-charge.dto';

@Injectable()
export class PrincipalChargeService {
  constructor(private tenantService: TenantService) {}

  async findAll(): Promise<PrincipalChargeSetup[]> {
    return this.tenantService.withManager((manager) =>
      manager.getRepository(PrincipalChargeSetup).find({
        order: { createdAt: 'ASC' },
        relations: ['principal', 'currency', 'chargeTypes'],
      }),
    );
  }

  async findByPrincipal(principalId: string): Promise<PrincipalChargeSetup> {
    return this.tenantService.withManager((manager) =>
      this.fetchByPrincipal(manager, principalId),
    );
  }

  /** Upsert: create or fully replace the charge setup for a principal */
  async upsert(data: UpsertPrincipalChargeSetupDto, userId: string): Promise<PrincipalChargeSetup> {
    return this.tenantService.withManager(async (manager) => {
      const principal = await manager.getRepository(Principal).findOne({ where: { id: data.principalId } });
      if (!principal) throw new NotFoundException('Principal not found');

      const currency = await manager.getRepository(Currency).findOne({ where: { id: data.currencyId } });
      if (!currency) throw new NotFoundException('Currency not found');
      if (!currency.isActive) throw new BadRequestException('Selected currency is not active');

      // Find or create the setup row
      let setup = await manager.getRepository(PrincipalChargeSetup).findOne({
        where: { principalId: data.principalId },
      });

      if (setup) {
        await manager.getRepository(PrincipalChargeSetup).update(setup.id, {
          currencyId: data.currencyId,
          updatedBy: userId,
        });
        // Delete existing charge types and replace
        await manager.getRepository(PrincipalChargeType).softDelete({ setupId: setup.id });
      } else {
        setup = manager.create(PrincipalChargeSetup, {
          principalId: data.principalId,
          currencyId: data.currencyId,
          createdBy: userId,
        });
        setup = await manager.save(setup);
      }

      // Insert new charge types
      const chargeTypes = data.chargeTypes.map((ct, i) =>
        manager.create(PrincipalChargeType, {
          setupId: setup!.id,
          chargeType: ct.chargeType.toUpperCase(),
          calcMode: ct.calcMode,
          minValue: ct.minValue ?? null,
          maxValue: ct.maxValue ?? null,
          fixedValue: ct.fixedValue ?? null,
          sortOrder: ct.sortOrder ?? i,
          createdBy: userId,
        }),
      );
      await manager.save(chargeTypes);

      return this.fetchByPrincipal(manager, data.principalId);
    });
  }

  async delete(principalId: string): Promise<void> {
    await this.tenantService.withManager(async (manager) => {
      const setup = await manager.getRepository(PrincipalChargeSetup).findOne({ where: { principalId } });
      if (!setup) throw new NotFoundException('Charge setup not found for this principal');
      await manager.getRepository(PrincipalChargeType).softDelete({ setupId: setup.id });
      await manager.getRepository(PrincipalChargeSetup).softDelete(setup.id);
    });
  }

  /** Used internally by the calculation engine */
  async findSetupForCalculation(principalId: string, manager: any): Promise<PrincipalChargeSetup | null> {
    return manager.getRepository(PrincipalChargeSetup).findOne({
      where: { principalId },
      relations: ['currency', 'chargeTypes'],
      order: { chargeTypes: { sortOrder: 'ASC' } },
    });
  }

  private async fetchByPrincipal(manager: any, principalId: string): Promise<PrincipalChargeSetup> {
    const setup = await manager.getRepository(PrincipalChargeSetup).findOne({
      where: { principalId },
      relations: ['principal', 'currency', 'chargeTypes'],
      order: { chargeTypes: { sortOrder: 'ASC' } },
    });
    if (!setup) throw new NotFoundException('Charge setup not found for this principal');
    return setup;
  }
}
