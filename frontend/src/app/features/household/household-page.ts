import { Component, computed, inject, signal, type OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { KeyVaultService } from '../../core/crypto/key-vault.service';
import { HouseholdContextService } from '../../core/households/household-context.service';
import { SessionService } from '../../core/session/session.service';
import { confirmDialog } from '../../shared/confirm-dialog/confirm-dialog';
import { HouseholdService, type Invitation, type Member } from './household.service';

@Component({
  selector: 'app-household-page',
  imports: [ReactiveFormsModule, TranslocoDirective, MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule],
  templateUrl: './household-page.html',
  styleUrl: './household-page.scss',
})
export class HouseholdPage implements OnInit {
  private readonly service = inject(HouseholdService);
  readonly hh = inject(HouseholdContextService);
  private readonly session = inject(SessionService);
  private readonly vault = inject(KeyVaultService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);
  private readonly transloco = inject(TranslocoService);

  readonly members = signal<Member[]>([]);
  readonly invitations = signal<Invitation[]>([]);
  readonly names = signal<Map<string, string>>(new Map());
  readonly link = signal<string | null>(null);
  readonly myFingerprint = signal<string | null>(null);
  readonly busy = signal(false);

  readonly isAdmin = computed(() => ['OWNER', 'ADMIN'].includes(this.hh.household()?.role ?? ''));
  readonly myId = computed(() => this.session.me()?.user.id);
  readonly others = computed(() => this.hh.households().filter((h) => h.id !== this.hh.householdId()));

  readonly form = inject(FormBuilder).nonNullable.group({ email: ['', [Validators.required, Validators.email]], role: ['MEMBER'] });

  async ngOnInit() {
    this.myFingerprint.set(await this.vault.myFingerprint());
    await this.refresh();
  }

  private async refresh() {
    this.members.set(await this.service.members());
    this.invitations.set(this.isAdmin() ? await this.service.invitations() : []);
    this.names.set(await this.service.householdNames());
  }

  private t(key: string, p?: object) {
    return this.transloco.translate(`household.${key}`, p);
  }

  async invite() {
    if (this.form.invalid) return;
    const { email, role } = this.form.getRawValue();
    await this.run(async () => {
      this.link.set(await this.service.invite(email.trim(), role));
      this.form.reset({ email: '', role: 'MEMBER' });
      this.invitations.set(await this.service.invitations());
    });
  }

  async copyLink() {
    const l = this.link();
    if (l) await navigator.clipboard.writeText(l);
    this.snack.open(this.t('copied'), undefined, { duration: 2000 });
  }

  async revoke(i: Invitation) {
    await this.run(async () => {
      await this.service.revoke(i.id);
      this.invitations.set(await this.service.invitations());
    });
  }

  /** Antes de dar acceso, se confirma que la huella coincide con la que ve la otra persona. */
  async grant(m: Member) {
    const ok = await confirmDialog(this.dialog, {
      title: this.t('grantDialog.title', { name: m.displayName }),
      message: this.t('grantDialog.message', { fingerprint: m.fingerprint }),
      confirm: this.t('grantDialog.confirm'),
      cancel: this.t('cancel'),
    });
    if (ok) await this.run(() => this.service.grant(m), 'granted');
  }

  async setRole(m: Member, role: string) {
    await this.run(() => this.service.setRole(m, role), 'roleChanged');
  }

  async remove(m: Member) {
    const ok = await confirmDialog(this.dialog, {
      title: this.t('removeDialog.title'),
      message: this.t('removeDialog.message', { name: m.displayName }),
      confirm: this.t('removeDialog.confirm'),
      cancel: this.t('cancel'),
      destructive: true,
    });
    if (ok) await this.run(() => this.service.remove(m), 'removed');
  }

  async leave() {
    const ok = await confirmDialog(this.dialog, { title: this.t('leaveDialog.title'), message: this.t('leaveDialog.message'), confirm: this.t('leaveDialog.confirm'), cancel: this.t('cancel'), destructive: true });
    if (ok) await this.run(() => this.service.leave(), 'left');
  }

  async switchTo(id: string) {
    await this.run(() => this.service.switchTo(id), 'switched');
  }

  private async run(fn: () => Promise<unknown>, okKey?: string) {
    this.busy.set(true);
    try {
      await fn();
      if (okKey) this.snack.open(this.t(okKey), undefined, { duration: 3000 });
      await this.refresh();
    } catch {
      this.snack.open(this.t('error'), undefined, { duration: 5000 });
    } finally {
      this.busy.set(false);
    }
  }
}
