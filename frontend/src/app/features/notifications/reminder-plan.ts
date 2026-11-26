/** Qué recordar y cuándo (a las 9 de la mañana, hora local), para los próximos `horizon` días. */
export interface PlannedReminder {
  sourceId: string;
  remindAt: Date;
  title: string;
  body: string;
  link: string;
}

export interface PlanInput {
  today: string;
  cards: { id: string; name: string; due: string; amount: string; label: string }[];
  debts: { id: string; name: string; paymentDay: number; amount: string | null }[];
  deposits: { id: string; name: string; maturity: string }[];
  /** Recurrentes con confirmación: su próxima fecha. */
  rules: { id: string; name: string; next: string; following: string }[];
}

const at9 = (iso: string, daysBefore = 0) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d - daysBefore, 9, 0, 0, 0);
};
const daysIn = (y: number, m: number) => new Date(y, m, 0).getDate();

/** Próxima fecha (hoy o después) con ese día del mes. */
function nextDay(today: string, day: number): string {
  const [y, m, d] = today.split('-').map(Number);
  const pad = (n: number) => String(n).padStart(2, '0');
  const thisMonth = Math.min(day, daysIn(y, m));
  if (thisMonth >= d) return `${y}-${pad(m)}-${pad(thisMonth)}`;
  const ny = m === 12 ? y + 1 : y;
  const nm = m === 12 ? 1 : m + 1;
  return `${ny}-${pad(nm)}-${pad(Math.min(day, daysIn(ny, nm)))}`;
}

export function planReminders(input: PlanInput, t: (key: string, params?: Record<string, unknown>) => string, horizon = 35): PlannedReminder[] {
  const now = at9(input.today);
  const limit = at9(input.today);
  limit.setDate(limit.getDate() + horizon);
  const out: PlannedReminder[] = [];
  const add = (r: PlannedReminder) => {
    if (r.remindAt > new Date(now.getTime() - 1) && r.remindAt <= limit) out.push(r);
  };

  for (const c of input.cards) {
    if (c.amount === '0') continue;
    add({ sourceId: c.id, remindAt: at9(c.due, 2), title: t('cardTitle', { name: c.name }), body: t('cardBody', { amount: c.label, date: c.due.split('-').reverse().join('/') }), link: '/deudas' });
  }
  for (const d of input.debts) {
    const due = nextDay(input.today, d.paymentDay);
    add({ sourceId: d.id, remindAt: at9(due, 1), title: t('debtTitle', { name: d.name }), body: d.amount ? t('debtBody', { amount: d.amount }) : t('debtBodyNoAmount'), link: '/deudas' });
  }
  for (const dep of input.deposits) {
    add({ sourceId: dep.id, remindAt: at9(dep.maturity), title: t('depositTitle', { name: dep.name }), body: t('depositBody'), link: '/ahorro' });
  }
  for (const r of input.rules) {
    for (const date of [r.next, r.following]) {
      add({ sourceId: r.id, remindAt: at9(date), title: t('ruleTitle', { name: r.name }), body: t('ruleBody'), link: '/inicio' });
    }
  }
  return out.sort((a, b) => a.remindAt.getTime() - b.remindAt.getTime());
}
