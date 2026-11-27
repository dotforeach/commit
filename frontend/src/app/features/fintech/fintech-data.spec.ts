import { FINTECH_CATEGORIES, FINTECH_CHECKED_AT, FINTECHS } from './fintech-data';

describe('datos de fintech', () => {
  it('slugs únicos y categorías válidas', () => {
    const slugs = FINTECHS.map((f) => f.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const f of FINTECHS) expect(FINTECH_CATEGORIES).toContain(f.category);
  });

  it('cada una tiene sitio oficial y al menos una fuente https', () => {
    for (const f of FINTECHS) {
      expect(f.url, f.slug).toMatch(/^https:\/\//);
      expect(f.sources.length, f.slug).toBeGreaterThan(0);
      for (const s of f.sources) expect(s.url, f.slug).toMatch(/^https:\/\//);
    }
  });

  it('incluye las pedidas como destacadas: Lulubit, Arka y Fortesza', () => {
    expect(FINTECHS.filter((f) => f.featured).map((f) => f.slug).sort()).toEqual(['arka', 'fortesza', 'lulubit']);
  });

  it('cada categoría tiene al menos una app y la fecha de revisión es válida', () => {
    for (const c of FINTECH_CATEGORIES) expect(FINTECHS.some((f) => f.category === c), c).toBe(true);
    expect(Number.isNaN(Date.parse(FINTECH_CHECKED_AT))).toBe(false);
  });
});
