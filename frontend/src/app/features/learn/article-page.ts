import { Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { TranslocoDirective } from '@jsverse/transloco';
import { AuthService } from '../../core/auth/auth.service';
import { readingMinutes } from './article.model';
import { ARTICLES, articleBySlug } from './articles';

@Component({
  selector: 'app-article-page',
  imports: [RouterLink, TranslocoDirective, MatButtonModule, MatIconModule],
  templateUrl: './article-page.html',
  styleUrl: './learn.scss',
})
export class ArticlePage {
  readonly slug = toSignal(inject(ActivatedRoute).paramMap.pipe(map((p) => p.get('slug') ?? '')), { initialValue: '' });
  readonly auth = inject(AuthService);
  readonly article = computed(() => articleBySlug(this.slug()) ?? null);
  readonly minutes = computed(() => (this.article() ? readingMinutes(this.article()!) : 0));
  /** Del mismo tema, primero los del nivel siguiente. */
  readonly related = computed(() => {
    const a = this.article();
    if (!a) return [];
    return ARTICLES.filter((o) => o.topic === a.topic && o.slug !== a.slug).slice(0, 3);
  });

  constructor() {
    const title = inject(Title);
    effect(() => {
      const a = this.article();
      title.setTitle(a ? `${a.title} · Commit` : 'Aprendé · Commit');
      if (typeof window !== 'undefined') window.scrollTo({ top: 0 });
    });
  }
}
