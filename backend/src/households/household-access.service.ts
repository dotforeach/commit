import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

export type HouseholdAccess = 'read' | 'write';

/**
 * Control de acceso a un hogar. Para quien no es miembro activo, el hogar no existe (404):
 * no se revela si el ID es válido. Los VIEWER pueden leer pero no escribir (403).
 */
@Injectable()
export class HouseholdAccessService {
  constructor(private readonly prisma: PrismaService) {}

  async require(householdId: string, userId: string, access: HouseholdAccess) {
    const member = await this.prisma.householdMember.findUnique({
      where: { householdId_userId: { householdId, userId } },
      include: { household: { select: { currentKeyVersion: true } } },
    });
    if (!member || member.status !== 'ACTIVE') throw new NotFoundException('Hogar no encontrado');
    if (access === 'write' && member.role === 'VIEWER') {
      throw new ForbiddenException('Tu rol en este hogar es de solo lectura');
    }
    return { role: member.role, currentKeyVersion: member.household.currentKeyVersion };
  }
}
