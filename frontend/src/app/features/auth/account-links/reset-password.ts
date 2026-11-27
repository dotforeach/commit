import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators, type ValidationErrors } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { AccountService } from '../../../core/auth/account.service';
import { PasswordToggle } from '../../../shared/password-toggle/password-toggle';

const same = (g: AbstractControl): ValidationErrors | null => (g.get('password')!.value === g.get('confirm')!.value ? null : { mismatch: true });

@Component({
  selector: 'app-reset-password',
  imports: [PasswordToggle, ReactiveFormsModule, RouterLink, TranslocoDirective, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule],
  styleUrl: '../_auth-shared.scss',
  template: `
    <ng-container *transloco="let t; prefix: 'accountLinks.reset'">
      <mat-card class="auth-card" appearance="outlined">
        <mat-card-header>
          <mat-card-title>{{ t('title') }}</mat-card-title>
          <mat-card-subtitle>{{ t('subtitle') }}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          @if (done()) {
            <p data-testid="reset-done">{{ t('done') }}</p>
          } @else {
            <form [formGroup]="form" class="form" (ngSubmit)="submit()">
              <mat-form-field>
                <mat-label>{{ t('password') }}</mat-label>
                <input matInput type="password" formControlName="password" autocomplete="new-password" #pa />
                <app-password-toggle matSuffix [for]="pa" />
                <mat-hint>{{ t('hint') }}</mat-hint>
              </mat-form-field>
              <mat-form-field>
                <mat-label>{{ t('confirm') }}</mat-label>
                <input matInput type="password" formControlName="confirm" autocomplete="new-password" #pb />
                <app-password-toggle matSuffix [for]="pb" />
              </mat-form-field>
              @if (form.hasError('mismatch') && form.controls.confirm.dirty) {
                <p class="error" role="alert">{{ t('mismatch') }}</p>
              }
              @if (error()) {
                <p class="error" role="alert">{{ t('invalid') }}</p>
              }
              <div class="actions"><button mat-flat-button type="submit" [disabled]="busy() || form.invalid">{{ t('submit') }}</button></div>
            </form>
          }
        </mat-card-content>
        <mat-card-footer class="footer"><a routerLink="/ingresar">{{ t('login') }}</a></mat-card-footer>
      </mat-card>
    </ng-container>
  `,
})
export class ResetPasswordPage {
  private readonly account = inject(AccountService);
  private readonly token = inject(ActivatedRoute).snapshot.queryParamMap.get('token') ?? '';
  readonly form = inject(FormBuilder).nonNullable.group({ password: ['', [Validators.required, Validators.minLength(10)]], confirm: ['', Validators.required] }, { validators: same });
  readonly busy = signal(false);
  readonly done = signal(false);
  readonly error = signal(false);

  async submit() {
    this.busy.set(true);
    this.error.set(false);
    try {
      await this.account.resetPassword(this.token, this.form.getRawValue().password);
      this.done.set(true);
    } catch {
      this.error.set(true);
    } finally {
      this.busy.set(false);
    }
  }
}
