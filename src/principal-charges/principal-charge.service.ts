import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { TenantService } from '../tenant/tenant.service';
import { PrincipalChargeSetup } from './principal-charge-setup.entity';
import { PrincipalChargeType } from './principal-charge-type.entity';
import { ChargeSetupAuditLog } from './charge-setup-audit.entity';
import { Principal } from '../principals/principal.entity';
import { Currency } from '../currencies/currency.entity';
import { UpsertPrincipalChargeSetupDto } from './principal-charge.dto';

@Injectable()
export class PrincipalChargeService {
  constructor(private tenantService: TenantService) {}

  async findAll(): Promise<PrincipalChargeSetup[]> {
    return this.tenantService.withManager(
      (manager) =>
        manager.getRepository(PrincipalChargeSetup).find({
          order: { createdAt: 'ASC' },
          relations: ['principal', 'currency', 'chargeTypes'],
        }),
      { transactional: false },
    );
  }

  async findByPrincipal(principalId: string): Promise<PrincipalChargeSetup> {
    return this.tenantService.withManager(
      (manager) => this.fetchByPrincipal(manager, principalId),
      { transactional: false },
    );
  }

  /** Upsert: create or fully replace the charge setup for a principal */
  async upsert(
    data: UpsertPrincipalChargeSetupDto,
    userId: string,
  ): Promise<PrincipalChargeSetup> {
    return this.tenantService.withManager(async (manager) => {
      const principal = await manager
        .getRepository(Principal)
        .findOne({ where: { id: data.principalId } });
      if (!principal) throw new NotFoundException('Principal not found');

      const currency = await manager
        .getRepository(Currency)
        .findOne({ where: { id: data.currencyId } });
      if (!currency) throw new NotFoundException('Currency not found');
      if (!currency.isActive)
        throw new BadRequestException('Selected currency is not active');

      // Find or create the setup row
      let setup = await manager.getRepository(PrincipalChargeSetup).findOne({
        where: { principalId: data.principalId },
        relations: ['chargeTypes', 'currency'],
      });

      // Capture previous state for audit
      const previousChargeTypes =
        setup?.chargeTypes?.map((ct) => ({
          chargeType: ct.chargeType,
          calcMode: ct.calcMode,
          minValue: ct.minValue,
          maxValue: ct.maxValue,
          fixedValue: ct.fixedValue,
          sortOrder: ct.sortOrder,
        })) ?? null;
      const previousCurrencyCode = setup?.currency?.code ?? null;
      const isUpdate = !!setup;

      if (setup) {
        await manager.getRepository(PrincipalChargeSetup).update(setup.id, {
          currencyId: data.currencyId,
          updatedBy: userId,
        });
        // Delete existing charge types and replace
        await manager
          .getRepository(PrincipalChargeType)
          .softDelete({ setupId: setup.id });
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
          setupId: setup.id,
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

      // Write audit log
      const auditLog = manager.create(ChargeSetupAuditLog, {
        principalId: data.principalId,
        principalName: principal.name,
        action: isUpdate ? 'UPDATED' : 'CREATED',
        currencyId: data.currencyId,
        currencyCode: currency.code,
        chargeTypes: data.chargeTypes.map((ct, i) => ({
          chargeType: ct.chargeType.toUpperCase(),
          calcMode: ct.calcMode,
          minValue: ct.minValue ?? null,
          maxValue: ct.maxValue ?? null,
          fixedValue: ct.fixedValue ?? null,
          sortOrder: ct.sortOrder ?? i,
        })),
        previousChargeTypes: isUpdate ? previousChargeTypes : null,
        previousCurrencyCode: isUpdate ? previousCurrencyCode : null,
        performedBy: userId,
      });
      await manager.save(auditLog);

      return this.fetchByPrincipal(manager, data.principalId);
    });
  }

  async delete(principalId: string, userId?: string): Promise<void> {
    await this.tenantService.withManager(async (manager) => {
      const setup = await manager.getRepository(PrincipalChargeSetup).findOne({
        where: { principalId },
        relations: ['principal', 'currency', 'chargeTypes'],
      });
      if (!setup)
        throw new NotFoundException(
          'Charge setup not found for this principal',
        );

      // Write audit log before deletion
      const auditLog = manager.create(ChargeSetupAuditLog, {
        principalId,
        principalName: setup.principal?.name ?? principalId,
        action: 'DELETED',
        currencyId: setup.currencyId,
        currencyCode: setup.currency?.code ?? null,
        chargeTypes:
          setup.chargeTypes?.map((ct) => ({
            chargeType: ct.chargeType,
            calcMode: ct.calcMode,
            minValue: ct.minValue,
            maxValue: ct.maxValue,
            fixedValue: ct.fixedValue,
            sortOrder: ct.sortOrder,
          })) ?? null,
        previousChargeTypes: null,
        previousCurrencyCode: null,
        performedBy: userId ?? null,
      });
      await manager.save(auditLog);

      await manager
        .getRepository(PrincipalChargeType)
        .softDelete({ setupId: setup.id });
      await manager.getRepository(PrincipalChargeSetup).softDelete(setup.id);
    });
  }

  /** Used internally by the calculation engine */
  async findSetupForCalculation(
    principalId: string,
    manager: any,
  ): Promise<PrincipalChargeSetup | null> {
    return manager.getRepository(PrincipalChargeSetup).findOne({
      where: { principalId },
      relations: ['currency', 'chargeTypes'],
      order: { chargeTypes: { sortOrder: 'ASC' } },
    });
  }

  async getAuditLog(): Promise<ChargeSetupAuditLog[]> {
    return this.tenantService.withManager(
      (manager) =>
        manager.getRepository(ChargeSetupAuditLog).find({
          order: { createdAt: 'DESC' },
          take: 200,
        }),
      { transactional: false },
    );
  }

  async getAuditLogByPrincipal(
    principalId: string,
  ): Promise<ChargeSetupAuditLog[]> {
    return this.tenantService.withManager(
      (manager) =>
        manager.getRepository(ChargeSetupAuditLog).find({
          where: { principalId },
          order: { createdAt: 'DESC' },
          take: 100,
        }),
      { transactional: false },
    );
  }

  private async fetchByPrincipal(
    manager: any,
    principalId: string,
  ): Promise<PrincipalChargeSetup> {
    const setup = await manager.getRepository(PrincipalChargeSetup).findOne({
      where: { principalId },
      relations: ['principal', 'currency', 'chargeTypes'],
      order: { chargeTypes: { sortOrder: 'ASC' } },
    });
    if (!setup)
      throw new NotFoundException('Charge setup not found for this principal');
    return setup;
  }
}
