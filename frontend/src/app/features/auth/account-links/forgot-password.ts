import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { AccountService } from '../../../core/auth/account.service';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, RouterLink, TranslocoDirective, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule],
  styleUrl: '../_auth-shared.scss',
  template: `
    <ng-container *transloco="let t; prefix: 'accountLinks.forgot'">
      <mat-card class="auth-card" appearance="outlined">
        <mat-card-header>
          <mat-card-title>{{ t('title') }}</mat-card-title>
          <mat-card-subtitle>{{ t('subtitle') }}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          @if (sent()) {
            <p data-testid="forgot-sent">{{ t('sent') }}</p>
          } @else {
            <form [formGroup]="form" class="form" (ngSubmit)="submit()">
              <mat-form-field>
                <mat-label>{{ t('email') }}</mat-label>
                <input matInput type="email" formControlName="email" autocomplete="username" />
              </mat-form-field>
              <p class="hint">{{ t('note') }}</p>
              @if (error()) {
                <p class="error" role="alert">{{ t('error') }}</p>
              }
              <div class="actions"><button mat-flat-button type="submit" [disabled]="busy() || form.invalid">{{ t('submit') }}</button></div>
            </form>
          }
        </mat-card-content>
        <mat-card-footer class="footer"><a routerLink="/ingresar">{{ t('back') }}</a></mat-card-footer>
      </mat-card>
    </ng-container>
  `,
})
export class ForgotPasswordPage {
  private readonly account = inject(AccountService);
  readonly form = inject(FormBuilder).nonNullable.group({ email: ['', [Validators.required, Validators.email]] });
  readonly busy = signal(false);
  readonly sent = signal(false);
  readonly error = signal(false);

  async submit() {
    this.busy.set(true);
    this.error.set(false);
    try {
      await this.account.forgotPassword(this.form.getRawValue().email.trim());
      this.sent.set(true);
    } catch {
      this.error.set(true);
    } finally {
      this.busy.set(false);
    }
  }
}
