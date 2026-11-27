import { DatePipe, KeyValuePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { PasswordToggle } from '../../shared/password-toggle/password-toggle';
import { Component, DestroyRef, computed, inject, signal, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslocoDirective } from '@jsverse/transloco';
import { firstValueFrom } from 'rxjs';

type NodeState = 'up' | 'down' | 'disabled' | 'configured';
interface StatusNode {
  id: string;
  state: NodeState;
  latencyMs: number | null;
  details: Record<string, string | number | boolean | null>;
}
interface Snapshot {
  generatedAt: string;
  nodes: StatusNode[];
}

/**
 * Posiciones del diagrama (viewBox 1160 × 600). Los servicios externos quedan alineados con los
 * huecos entre los nodos internos: sus líneas cruzan la columna de datos sin pasar por encima.
 */
interface Box {
  id: string;
  x: number;
  y: number;
  icon: string;
}
const W = 190;
const H = 70;
const BOXES: Box[] = [
  { id: 'browser', x: 20, y: 300, icon: 'devices' },
  { id: 'frontend', x: 255, y: 300, icon: 'web' },
  { id: 'backend', x: 490, y: 300, icon: 'dns' },
  { id: 'postgres', x: 735, y: 100, icon: 'database' },
  { id: 'redis', x: 735, y: 240, icon: 'memory' },
  { id: 'queues', x: 735, y: 370, icon: 'stacks' },
  { id: 'ocr', x: 735, y: 500, icon: 'document_scanner' },
  { id: 'whatsapp', x: 960, y: 30, icon: 'chat' },
  { id: 'ai', x: 960, y: 170, icon: 'auto_awesome' },
  { id: 'rates', x: 960, y: 305, icon: 'currency_exchange' },
  { id: 'push', x: 960, y: 435, icon: 'notifications' },
];
/** Canal vertical (entre el backend y la columna de datos) por donde salen las conexiones. */
const BUS_X = 710;
/** Conexiones: [desde, hasta]. */
const EDGES: [string, string][] = [
  ['browser', 'frontend'],
  ['frontend', 'backend'],
  ['backend', 'postgres'],
  ['backend', 'redis'],
  ['redis', 'queues'],
  ['backend', 'ocr'],
  ['backend', 'whatsapp'],
  ['backend', 'ai'],
  ['backend', 'rates'],
  ['backend', 'push'],
];
const REFRESH_MS = 10_000;
const TOKEN_KEY = 'commit.statusToken';

@Component({
  selector: 'app-status-page',
  imports: [PasswordToggle, DatePipe, KeyValuePipe, FormsModule, TranslocoDirective, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule],
  templateUrl: './status-page.html',
  styleUrl: './status-page.scss',
})
export class StatusPage implements OnInit {
  private readonly http = inject(HttpClient);
  readonly snapshot = signal<Snapshot | null>(null);
  readonly error = signal<'locked' | 'down' | null>(null);
  readonly selected = signal<string>('backend');
  readonly loading = signal(false);
  readonly lastOk = signal<Date | null>(null);
  token = sessionStorage.getItem(TOKEN_KEY) ?? '';
  readonly W = W;
  readonly H = H;
  readonly boxes = BOXES;

  /** Estado de cada nodo; navegador y frontend están "arriba" si esta página cargó. */
  readonly byId = computed(() => {
    const map = new Map<string, StatusNode>();
    for (const n of this.snapshot()?.nodes ?? []) map.set(n.id, n);
    const reachable = this.error() !== 'down';
    map.set('browser', { id: 'browser', state: 'up', latencyMs: null, details: { userAgent: navigator.userAgent.split(') ')[0] + ')', online: navigator.onLine } });
    map.set('frontend', { id: 'frontend', state: reachable ? 'up' : 'down', latencyMs: null, details: { origin: location.origin } });
    if (!reachable) map.set('backend', { id: 'backend', state: 'down', latencyMs: null, details: {} });
    return map;
  });

  readonly edges = computed(() =>
    EDGES.map(([from, to]) => {
      const a = BOXES.find((b) => b.id === from)!;
      const b = BOXES.find((x) => x.id === to)!;
      const ay = a.y + H / 2;
      const by = b.y + H / 2;
      let d: string;
      if (a.x === b.x) d = `M${a.x + W / 2},${a.y + H} V${b.y}`; // misma columna: vertical
      else if (from === 'backend') d = `M${a.x + W},${ay} H${BUS_X} V${by} H${b.x}`; // por el canal
      else d = `M${a.x + W},${ay} H${b.x}`; // en línea
      const target = this.byId().get(to)?.state ?? 'disabled';
      const source = this.byId().get(from)?.state ?? 'disabled';
      const live = source === 'up' && (target === 'up' || target === 'configured');
      return { key: `${from}-${to}`, d, state: source === 'down' || target === 'down' ? 'down' : live ? 'live' : 'idle' };
    }),
  );

  readonly summary = computed(() => {
    const nodes = [...this.byId().values()];
    return { up: nodes.filter((n) => n.state === 'up' || n.state === 'configured').length, down: nodes.filter((n) => n.state === 'down').length, total: nodes.length };
  });

  readonly selectedNode = computed(() => this.byId().get(this.selected()) ?? null);

  constructor() {
    const timer = setInterval(() => void this.refresh(), REFRESH_MS);
    inject(DestroyRef).onDestroy(() => clearInterval(timer));
  }

  async ngOnInit() {
    await this.refresh();
  }

  async refresh() {
    if (this.error() === 'locked' && !this.token) return;
    this.loading.set(true);
    try {
      const headers = this.token ? { 'x-status-token': this.token } : undefined;
      this.snapshot.set(await firstValueFrom(this.http.get<Snapshot>('/api/status', { headers })));
      this.error.set(null);
      this.lastOk.set(new Date());
    } catch (e) {
      this.error.set(e instanceof HttpErrorResponse && e.status === 404 ? 'locked' : 'down');
    } finally {
      this.loading.set(false);
    }
  }

  async unlock() {
    sessionStorage.setItem(TOKEN_KEY, this.token);
    this.error.set(null);
    await this.refresh();
  }

  stateOf(id: string): NodeState {
    return this.byId().get(id)?.state ?? 'disabled';
  }

  latency(id: string) {
    const ms = this.byId().get(id)?.latencyMs;
    return ms === null || ms === undefined ? '' : `${ms} ms`;
  }
}
