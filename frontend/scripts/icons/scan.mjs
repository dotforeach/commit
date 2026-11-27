// Íconos de Material Symbols que usa la app. La fuente se recorta a estos (ver subset.py).
// Uso:
//   node scripts/icons/scan.mjs --check   → falla si se usa un ícono que no está en la fuente recortada
//   node scripts/icons/scan.mjs --write   → actualiza icons.json (después: pnpm icons:subset)
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../..', import.meta.url));
const manifestPath = join(root, 'scripts/icons/icons.json');

/**
 * Nombres válidos: todos los que dibuja la fuente completa (available.json, generado por
 * subset.py --available). La lista de tipos del paquete está incompleta (le faltan p. ej. "insights").
 */
export function validIconNames() {
  return new Set(JSON.parse(readFileSync(join(root, 'scripts/icons/available.json'), 'utf8')));
}

function* files(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* files(path);
    else if (/\.(ts|html)$/.test(name) && !/\.spec\.ts$/.test(name) && !name.endsWith('.d.ts')) yield path;
  }
}

/**
 * Busca, de forma conservadora (mejor de más que de menos):
 * - en plantillas: el texto dentro de <mat-icon> o de elementos con la clase material-symbols-outlined,
 *   y los literales de sus interpolaciones;
 * - en TypeScript: cualquier literal que sea un nombre de ícono válido (íconos en datos: menú, cuentas, categorías…).
 */
export function usedIcons(valid = validIconNames()) {
  const used = new Map(); // ícono → primer archivo donde aparece
  const add = (name, file) => {
    if (valid.has(name) && !used.has(name)) used.set(name, relative(root, file));
  };
  for (const file of files(join(root, 'src/app'))) {
    const src = readFileSync(file, 'utf8');
    // <mat-icon>…</mat-icon> y cualquier elemento con la clase material-symbols-outlined
    const tags = [
      ...src.matchAll(/<mat-icon\b[^>]*>([\s\S]*?)<\/mat-icon>/g),
      ...src.matchAll(/<(\w+)\b[^>]*class="[^"]*material-symbols-outlined[^"]*"[^>]*>([^<]*)<\/\1>/g),
    ].map((m) => (m.length === 2 ? m[1] : m[2]));
    for (const raw of tags) {
      const inner = (raw ?? '').trim();
      if (!inner.includes('{{')) add(inner, file);
      for (const lit of inner.matchAll(/'([a-z0-9_]+)'/g)) add(lit[1], file);
    }
    for (const lit of src.matchAll(/(['"`])([a-z0-9_]+)\1/g)) add(lit[2], file);
  }
  return used;
}

const mode = process.argv[2];
if (mode === '--write' || mode === '--check') {
  const used = usedIcons();
  if (mode === '--write') {
    writeFileSync(manifestPath, JSON.stringify([...used.keys()].sort(), null, 2) + '\n');
    console.log(`icons.json: ${used.size} íconos`);
  } else {
    const manifest = new Set(JSON.parse(readFileSync(manifestPath, 'utf8')));
    const missing = [...used].filter(([name]) => !manifest.has(name));
    if (missing.length > 0) {
      console.error('Íconos usados que no están en la fuente recortada (se verían como texto):');
      for (const [name, file] of missing) console.error(`  ${name}  (${file})`);
      console.error('Ejecuta: pnpm icons:subset');
      process.exit(1);
    }
    console.log(`Íconos OK: ${used.size} en uso, todos incluidos en la fuente recortada.`);
  }
}
