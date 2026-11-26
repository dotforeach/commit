import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { NotificationsService } from './notifications.service';

/** Campana de notificaciones (se carga diferida para no pesar en el bundle inicial). */
@Component({
  selector: 'app-notifications-bell',
  imports: [DatePipe, RouterLink, TranslocoDirective, MatBadgeModule, MatButtonModule, MatIconModule, MatMenuModule],
  template: `
    <ng-container *transloco="let t">
      <button mat-icon-button [matMenuTriggerFor]="notifMenu" (menuOpened)="openNotifications()" [attr.aria-label]="t('nav.notifications')" data-testid="bell">
        <mat-icon fontSet="material-symbols-outlined" [matBadge]="notifications.unread() || null" matBadgeSize="small" matBadgeColor="warn" aria-hidden="false">notifications</mat-icon>
      </button>
      <mat-menu #notifMenu="matMenu" class="notif-menu">
        @for (n of notifications.items(); track n.id) {
          <a mat-menu-item [routerLink]="n.link ?? '/inicio'" [class.unread]="!n.read" [attr.data-notification]="n.title">
            <span class="n-title">{{ n.title || t('notifications.types.' + n.type) }}</span>
            <span class="n-body">{{ n.body }} · {{ n.createdAt | date: 'd/M HH:mm' }}</span>
          </a>
        } @empty {
          <p class="empty-notifs">{{ t('notifications.empty') }}</p>
        }
        @if (notifications.unread() > 0) {
          <button mat-menu-item (click)="notifications.markAllRead()">{{ t('notifications.markAll') }}</button>
        }
      </mat-menu>
    </ng-container>
  `,
  styleUrl: './notifications-bell.scss',
})
export class NotificationsBell {
  readonly notifications = inject(NotificationsService);

  async openNotifications() {
    await this.notifications.load().catch(() => undefined);
  }
}
