/**
 * Artículo de "Aprendé" para cada consejo de Progreso y cada paso del Plan mágico.
 * Solo slugs (sin el texto), para no sumar los artículos a esos chunks.
 */
export const TIP_ARTICLE: Record<string, string> = {
  'onboarding.finish': 'presupuesto-50-30-20',
  'debt.avalanche': 'bola-de-nieve-vs-avalancha',
  'emergency.start': 'fondo-de-emergencia',
  'emergency.grow': 'fondo-de-emergencia',
  'budget.create': 'presupuesto-50-30-20',
  'budget.over': 'registrar-gastos-y-gastos-hormiga',
  'savings.low': 'pagate-primero-y-metas',
  'cash.idle': 'cuentas-de-ahorro-y-plazo-fijo',
  'invest.diversify': 'perfil-de-riesgo-y-diversificacion',
  'record.consistency': 'registrar-gastos-y-gastos-hormiga',
};

export const PLAN_ARTICLE: Record<string, string> = {
  minimums: 'bola-de-nieve-vs-avalancha',
  shortfall: 'presupuesto-base-cero-ingresos-variables',
  cards: 'tarjeta-minimo-vs-total',
  miniFund: 'fondo-de-emergencia',
  prepay: 'bola-de-nieve-vs-avalancha',
  dontPrepay: 'inflacion-y-tasa-real-referente-argentina',
  fullFund: 'fondo-de-emergencia',
  goal: 'pagate-primero-y-metas',
  invest: 'perfil-de-riesgo-y-diversificacion',
};
