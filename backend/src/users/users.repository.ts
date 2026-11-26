import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { AuthUser } from './user.types.js';

const authUserSelect = { id: true, email: true, displayName: true } as const;

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string): Promise<AuthUser | null> {
    return this.prisma.user.findUnique({ where: { id }, select: authUserSelect });
  }

  /** El único método que expone el hash: lo usa solo la verificación de credenciales. */
  async findCredentials(email: string): Promise<{ user: AuthUser; passwordHash: string } | null> {
    const row = await this.prisma.user.findUnique({
      where: { email },
      select: { ...authUserSelect, passwordHash: true },
    });
    if (!row) return null;
    const { passwordHash, ...user } = row;
    return { user, passwordHash };
  }

  async updatePasswordHash(id: string, passwordHash: string): Promise<void> {
    await this.prisma.user.update({ where: { id }, data: { passwordHash } });
  }
}
