/** Artículos de "Aprendé": contenido estático, sin backend ni seguimiento de lectura. */
export type Level = 'basico' | 'intermedio' | 'avanzado';
export type Topic = 'personal' | 'deudas' | 'pareja' | 'inversion';

export type Block =
  | { h: string }
  | { p: string }
  | { ul: string[] }
  | { ol: string[] }
  /** Recuadro destacado ("La clave"). */
  | { tip: string };

export interface Article {
  slug: string;
  title: string;
  summary: string;
  level: Level;
  topic: Topic;
  /** Artículo con ejemplos de otro país, como referente (por defecto: Panamá). */
  region?: 'AR';
  blocks: Block[];
}

export const LEVELS: Level[] = ['basico', 'intermedio', 'avanzado'];
export const TOPICS: Topic[] = ['personal', 'deudas', 'pareja', 'inversion'];

/** Minutos de lectura (≈ 200 palabras por minuto). */
export function readingMinutes(a: Article): number {
  const text = a.blocks.map((b) => ('h' in b ? b.h : 'p' in b ? b.p : 'tip' in b ? b.tip : 'ul' in b ? b.ul.join(' ') : b.ol.join(' '))).join(' ');
  return Math.max(1, Math.round(text.split(/\s+/).length / 200));
}
