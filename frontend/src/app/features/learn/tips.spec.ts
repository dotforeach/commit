import { TOPICS } from './article.model';
import { ARTICLES } from './articles';
import { randomTip, TIPS } from './tips';

describe('consejos rápidos', () => {
  it('al menos 5 por tema', () => {
    for (const topic of TOPICS) expect(TIPS[topic].length, topic).toBeGreaterThanOrEqual(5);
  });
  it('cada consejo enlaza a un artículo existente del mismo tema', () => {
    const bySlug = new Map(ARTICLES.map((a) => [a.slug, a]));
    for (const topic of TOPICS) {
      for (const tip of TIPS[topic]) {
        expect(bySlug.has(tip.article), tip.article).toBe(true);
        expect(bySlug.get(tip.article)!.topic, tip.article).toBe(topic);
      }
    }
  });
  it('sin repetidos y en trato de tú (sin voseo)', () => {
    const all = TOPICS.flatMap((t) => TIPS[t].map((x) => x.text));
    expect(new Set(all).size).toBe(all.length);
    for (const text of all) expect(text, text).not.toMatch(/\b(pagá|ahorrá|revisá|tenés|podés|sabés|querés|elegí)\b/i);
  });
  it('randomTip devuelve uno con su tema', () => {
    expect(randomTip(() => 0).topic).toBe('personal');
    expect(randomTip(() => 0.999).topic).toBe('inversion');
  });
});
