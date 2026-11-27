import type { Article } from './article.model';
import { DEUDAS } from './articles/deudas';
import { INVERSION } from './articles/inversion';
import { PAREJA } from './articles/pareja';
import { PERSONAL } from './articles/personal';

const ORDER = { basico: 0, intermedio: 1, avanzado: 2 } as const;

/** Todos los artículos, de básico a avanzado. */
export const ARTICLES: Article[] = [...PERSONAL, ...DEUDAS, ...PAREJA, ...INVERSION].sort((a, b) => ORDER[a.level] - ORDER[b.level]);

export const articleBySlug = (slug: string) => ARTICLES.find((a) => a.slug === slug);
