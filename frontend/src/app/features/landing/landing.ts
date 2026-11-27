import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { readingMinutes } from '../learn/article.model';
import { articleBySlug } from '../learn/articles';

const FEATURES = [
  { key: 'budget', icon: 'pie_chart' },
  { key: 'debts', icon: 'credit_card' },
  { key: 'plan', icon: 'auto_awesome' },
  { key: 'savings', icon: 'savings' },
  { key: 'household', icon: 'group' },
  { key: 'reminders', icon: 'notifications' },
] as const;

const FEATURED = ['presupuesto-50-30-20', 'decimo-tercer-mes', 'cuentas-juntas-separadas-o-mixtas'];

/** Página pública de presentación. Con sesión iniciada, "/" lleva directo a Inicio (ver landingGuard). */
@Component({
  selector: 'app-landing',
  imports: [RouterLink, TranslocoDirective, MatButtonModule, MatIconModule],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {
  readonly features = FEATURES;
  readonly steps = ['one', 'two', 'three'];
  readonly faqs = ['free', 'privacy', 'forgot', 'bank', 'offline', 'couple'];
  readonly articles = FEATURED.map((s) => articleBySlug(s)!).map((a) => ({ ...a, minutes: readingMinutes(a) }));
}
