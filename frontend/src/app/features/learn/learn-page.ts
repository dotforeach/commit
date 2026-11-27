import { Component, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { LEVELS, TOPICS, readingMinutes, type Level, type Topic } from './article.model';
import { ARTICLES } from './articles';

/** "Aprendé": artículos de educación financiera, públicos (no hace falta cuenta). */
@Component({
  selector: 'app-learn-page',
  imports: [RouterLink, TranslocoDirective, MatButtonModule, MatChipsModule, MatIconModule],
  templateUrl: './learn-page.html',
  styleUrl: './learn.scss',
})
export class LearnPage {
  readonly topics = TOPICS;
  readonly levels = LEVELS;
  readonly topic = signal<Topic | null>(null);
  readonly level = signal<Level | null>(null);
  readonly minutes = readingMinutes;
  readonly articles = computed(() => ARTICLES.filter((a) => (this.topic() === null || a.topic === this.topic()) && (this.level() === null || a.level === this.level())));
}
