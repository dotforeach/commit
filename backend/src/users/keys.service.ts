import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { verifyEd25519 } from '../auth/member-key-signature.js';
import { AppMailer } from '../mail/app-mailer.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { keyUpdateSignedMessage } from './key-update-signature.js';
import type { UpdateKeysInput } from './keys.schemas.js';

@Injectable()
export class KeysService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailer: AppMailer,
  ) {}

  /**
   * Reemplaza las claves privadas cifradas. Exige una firma con la clave privada del usuario:
   * con solo la contraseña de ingreso no se pueden pisar (no hay forma de dejar a alguien sin sus datos).
   */
  async update(userId: string, input: UpdateKeysInput): Promise<void> {
    const keys = await this.prisma.userKeys.findUnique({ where: { userId } });
    if (!keys) throw new NotFoundException();
    if (keys.keyVersion !== input.keyVersion) throw new ConflictException('Las claves cambiaron; recarga');

    const message = keyUpdateSignedMessage(userId, input.keyVersion, { ...input.passphrase, ...input.recovery });
    if (!verifyEd25519(keys.signingPublicKey, message, input.signature)) {
      throw new ForbiddenException('Firma inválida');
    }

    const { count } = await this.prisma.userKeys.updateMany({
      where: { userId, keyVersion: input.keyVersion },
      data: { ...input.passphrase, ...input.recovery },
    });
    if (count === 0) throw new ConflictException('Las claves cambiaron; recarga');
    // Aviso por correo (no incluye ningún dato de las claves)
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { email: true, displayName: true } });
    if (user) await this.mailer.passphraseChanged(user);
  }
}
