import { Component, computed, inject, signal, type OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import type { ScoreComponent } from './progress-engine';
import { ProgressService } from './progress.service';

export const LEVEL_ICONS: Record<string, string> = {
  start: 'flag',
  control: 'tune',
  cushion: 'shield',
  debtFree: 'link_off',
  fullFund: 'health_and_safety',
  saving: 'savings',
  investing: 'trending_up',
};

@Component({
  selector: 'app-progress-page',
  imports: [RouterLink, TranslocoDirective, MatButtonModule, MatCardModule, MatIconModule, MatProgressBarModule],
  templateUrl: './progress-page.html',
  styleUrl: './progress-page.scss',
})
export class ProgressPage implements OnInit {
  readonly progress = inject(ProgressService);
  private readonly snack = inject(MatSnackBar);
  private readonly transloco = inject(TranslocoService);
  readonly loading = signal(true);
  readonly icons = LEVEL_ICONS;

  /** Diferencia con el último puntaje guardado antes de hoy. */
  readonly trend = computed(() => {
    const today = new Date().toISOString().slice(0, 10);
    const prev = this.progress.history().filter((h) => h.date < today).at(-1);
    return prev ? this.progress.score().score - prev.score : null;
  });

  async ngOnInit() {
    try {
      await this.progress.ensureLoaded();
      const fresh = await this.progress.record();
      for (const key of fresh) {
        this.snack.open(this.transloco.translate('progress.levelUp', { level: this.transloco.translate(`progress.levels.${key}.name`) }), undefined, { duration: 5000 });
      }
    } finally {
      this.loading.set(false);
    }
  }

  /** Explicación del valor medido de cada componente. */
  explain(c: ScoreComponent) {
    const t = (k: string, p?: object) => this.transloco.translate(`progress.components.${c.key}.${k}`, p);
    if (c.value === null) return t('noData');
    switch (c.key) {
      case 'savings':
        return t('value', { pct: Math.round(c.value * 100) });
      case 'emergency':
        return t('value', { months: Math.round(c.value * 10) / 10 });
      case 'debt':
        return t('value', { pct: Math.round(c.value * 100) });
      case 'budget':
        return t('value', { pct: Math.round(c.value * 100) });
      case 'consistency':
        return t('value', { n: c.value });
    }
  }

  async dismiss(key: string) {
    await this.progress.dismiss(key);
  }
}
