import type { Topic } from './article.model';

/**
 * Consejos rápidos por tema de Aprende (español de Panamá, trato de tú). Cada uno enlaza al
 * artículo que lo desarrolla. Se muestran en Aprende y, al azar, en la pantalla de carga.
 * Regla: consejos generales y verificables; nada de rendimientos ni tasas que caduquen.
 */
export interface Tip {
  text: string;
  /** Slug del artículo que lo desarrolla. */
  article: string;
}

export const TIPS: Record<Topic, Tip[]> = {
  personal: [
    { text: 'Anota cada gasto durante un mes, incluso el café: los gastos hormiga suelen ser los que más se escapan.', article: 'registrar-gastos-y-gastos-hormiga' },
    { text: 'Págate primero: el día que cobras, separa tu ahorro antes de gastar, aunque sea un 5 %.', article: 'pagate-primero-y-metas' },
    { text: 'Arma tu fondo de emergencia de a poco: la meta son 3 a 6 meses de gastos básicos en una cuenta aparte.', article: 'fondo-de-emergencia' },
    { text: 'Planifica el décimo tercer mes antes de recibirlo: decide cuánto va a deudas, ahorro y gustos.', article: 'decimo-tercer-mes' },
    { text: 'Prueba la regla 50/30/20 como punto de partida: necesidades, gustos y ahorro o deudas.', article: 'presupuesto-50-30-20' },
    { text: 'Si tus ingresos varían, presupuesta con tu mes más bajo y ahorra lo que sobre en los meses buenos.', article: 'presupuesto-base-cero-ingresos-variables' },
  ],
  deudas: [
    { text: 'Paga el total de la tarjeta cada mes: pagar solo el mínimo puede costarte años de intereses.', article: 'tarjeta-minimo-vs-total' },
    { text: 'Compara préstamos por su tasa efectiva y el costo total, no solo por la cuota mensual.', article: 'tasa-nominal-efectiva-costo-total' },
    { text: 'Revisa tu historial en la APC al menos una vez al año y corrige cualquier error a tiempo.', article: 'apc-historial-crediticio' },
    { text: 'Elige una estrategia y síguela: avalancha (la tasa más alta primero) ahorra más; bola de nieve motiva más.', article: 'bola-de-nieve-vs-avalancha' },
    { text: 'Antes de un préstamo por descuento directo, calcula cuánto te queda libre cada quincena.', article: 'prestamos-descuento-directo' },
    { text: 'Consolidar deudas solo ayuda si la nueva tasa es menor y dejas de usar las tarjetas que liquidaste.', article: 'consolidar-y-refinanciar' },
  ],
  pareja: [
    { text: 'Hablen de plata con calma y en un momento neutro: ingresos, deudas y metas, sin juicios.', article: 'hablar-de-plata-en-pareja' },
    { text: 'No hay una sola forma correcta: cuentas juntas, separadas o mixtas funcionan si ambos están de acuerdo.', article: 'cuentas-juntas-separadas-o-mixtas' },
    { text: 'Repartan los gastos del hogar en proporción a lo que gana cada uno si sus ingresos son muy distintos.', article: 'gastos-compartidos-del-hogar' },
    { text: 'Revisen juntos el presupuesto una vez al mes: diez minutos evitan muchas discusiones.', article: 'hablar-de-plata-en-pareja' },
    { text: 'Antes de comprar casa, sumen la cuota, el seguro y el mantenimiento: no solo la mensualidad del banco.', article: 'comprar-casa-hipoteca' },
    { text: 'Si alguien depende de tus ingresos, considera un seguro de vida y deja tus documentos en orden.', article: 'proteger-a-tu-familia' },
  ],
  inversion: [
    { text: 'Invierte solo después de tener tu fondo de emergencia y las deudas caras bajo control.', article: 'perfil-de-riesgo-y-diversificacion' },
    { text: 'Empieza pronto aunque sea poco: el interés compuesto premia el tiempo más que el monto.', article: 'interes-compuesto' },
    { text: 'No pongas todo en un solo lugar: diversificar reduce el riesgo de perder mucho de golpe.', article: 'perfil-de-riesgo-y-diversificacion' },
    { text: 'Los fondos indexados y ETF de bajo costo son una forma sencilla de invertir a largo plazo.', article: 'fondos-indexados-y-etf' },
    { text: 'Compara plazos fijos y cuentas de ahorro por su tasa y por cuándo puedes sacar tu dinero.', article: 'cuentas-de-ahorro-y-plazo-fijo' },
    { text: 'Piensa en tu retiro desde ahora: la pensión de la CSS rara vez alcanza sola; complementa con ahorro voluntario.', article: 'jubilacion-css-y-ahorro-voluntario' },
  ],
};

/** Un consejo al azar (para la pantalla de carga). */
export function randomTip(random = Math.random): Tip & { topic: Topic } {
  const all = (Object.entries(TIPS) as [Topic, Tip[]][]).flatMap(([topic, tips]) => tips.map((t) => ({ ...t, topic })));
  return all[Math.floor(random() * all.length)];
}
