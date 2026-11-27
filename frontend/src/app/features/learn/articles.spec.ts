import { LEVELS, TOPICS, readingMinutes } from './article.model';
import { ARTICLES, articleBySlug } from './articles';

describe('artículos de Aprendé', () => {
  it('hay 25, con slugs únicos y URL-safe', () => {
    expect(ARTICLES).toHaveLength(25);
    const slugs = ARTICLES.map((a) => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it('cada tema tiene artículos de los tres niveles', () => {
    for (const topic of TOPICS) for (const level of LEVELS) expect(ARTICLES.some((a) => a.topic === topic && a.level === level), `${topic}/${level}`).toBe(true);
  });

  it('todos tienen contenido y tiempo de lectura', () => {
    for (const a of ARTICLES) {
      expect(a.blocks.length).toBeGreaterThan(3);
      expect(readingMinutes(a)).toBeGreaterThanOrEqual(1);
    }
    expect(articleBySlug('fondo-de-emergencia')?.title).toContain('emergencia');
  });
});

import { PLAN_ARTICLE, TIP_ARTICLE } from './links';

describe('enlaces "Leer más"', () => {
  it('todos apuntan a artículos que existen', () => {
    for (const slug of [...Object.values(TIP_ARTICLE), ...Object.values(PLAN_ARTICLE)]) expect(articleBySlug(slug), slug).toBeDefined();
  });
});
