/**
 * Apps e iniciativas fintech disponibles para el público en Panamá. Contenido informativo,
 * sin afiliación ni recomendación. Se actualiza a mano: revisar las fuentes, cambiar los
 * datos y la fecha `FINTECH_CHECKED_AT`.
 *
 * Regla editorial: solo entra lo que se pudo confirmar con al menos una fuente. Lo que
 * afirma la empresa sobre sí misma (licencias, rendimientos) se marca como tal.
 */

export const FINTECH_CHECKED_AT = '2026-11-27';

export type FintechCategory = 'payments' | 'investing' | 'crypto';

export interface FintechSource {
  label: string;
  url: string;
}

export interface Fintech {
  slug: string;
  name: string;
  category: FintechCategory;
  /** Qué es, en una oración. */
  summary: string;
  /** Lo que se puede hacer con la app. */
  features: string[];
  /** Montos mínimos, comisiones o costos conocidos (con su fecha si es vieja). */
  costs?: string;
  /** Supervisión o registro. `claimed`: lo dice la empresa, no se verificó en el registro oficial. */
  regulation: { text: string; claimed: boolean };
  /** Puntos a tener en cuenta antes de usarla. */
  caveats: string[];
  url: string;
  sources: FintechSource[];
  /** Destacada (pedido explícito del producto). */
  featured?: boolean;
}

export const FINTECHS: Fintech[] = [
  {
    slug: 'lulubit',
    name: 'Lulubit',
    category: 'crypto',
    featured: true,
    summary: 'App para comprar y vender cripto (USDT, Bitcoin) con dólares, que opera en Panamá, Costa Rica y Guatemala.',
    features: [
      'Comprar y vender USDT y Bitcoin depositando dólares por ACH o ACH Xpress desde bancos locales.',
      'Pagar con PIX en Brasil usando dólares desde el celular, sin cuenta bancaria brasileña (según la empresa).',
      'Cuenta virtual en EE. UU. para recibir dólares desde plataformas como PayPal o Wise (según la empresa).',
      'Lulucard: tarjeta vinculada a la billetera cripto.',
    ],
    costs: 'En 2024 anunció una cuenta remunerada de hasta 7 % anual sobre USDT; verifica las condiciones vigentes en la app.',
    regulation: { text: 'Panamá no tiene una ley específica de cripto: no es un depósito bancario ni está cubierto como tal.', claimed: false },
    caveats: [
      'El rendimiento en USDT no es un depósito: depende de la empresa y del emisor de la stablecoin.',
      'La función de PIX y la cuenta en EE. UU. solo están descritas por la propia empresa.',
    ],
    url: 'https://www.lulubit.app/',
    sources: [
      { label: 'Sitio oficial de Lulubit', url: 'https://www.lulubit.app/' },
      { label: 'Lulubit: cómo pagar con PIX en Brasil desde Panamá', url: 'https://www.lulubit.app/post/c%C3%B3mo-pagar-con-pix-en-brasil-desde-panam%C3%A1' },
      { label: 'LatamFintech: cuenta remunerada y virtual (2024)', url: 'https://www.latamfintech.co/articles/lulubit-la-app-de-criptomonedas-lanzo-una-cuenta-remunerada-y-virtual-para-potenciar-las-finanzas-de-sus-usuarios-en-panama-y-guatemala' },
    ],
  },
  {
    slug: 'arka',
    name: 'Arka',
    category: 'investing',
    featured: true,
    summary: 'Fintech panameña para invertir en fondos de mercados globales (incluida la bolsa de EE. UU.) desde un banco local.',
    features: [
      'Fondos desde conservadores hasta de crecimiento, y también de cripto.',
      'Se fondea desde cualquier banco local.',
    ],
    costs: 'Desde $10. Sin costo por abrir la cuenta; comisión administrativa desde 0.75 % (según la empresa).',
    regulation: { text: 'La empresa indica estar registrada y regulada por la Superintendencia del Mercado de Valores (SMV).', claimed: true },
    caveats: [
      'Verifica su registro en supervalores.gob.pa antes de invertir.',
      'Su página explica que la renta de fuente extranjera no paga ISR en Panamá, pero aclara que es informativo y no una garantía fiscal.',
      'Invertir en fondos tiene riesgo: el valor puede bajar.',
    ],
    url: 'https://arka.app/',
    sources: [
      { label: 'Arka: inversión general', url: 'https://arka.app/inversion_general' },
      { label: 'Arka: tratamiento fiscal', url: 'https://www.arka.app/arka/tax_Treatment' },
      { label: 'Arka en App Store (Arka Group S.A.)', url: 'https://apps.apple.com/mx/app/arka/id6740244711' },
    ],
  },
  {
    slug: 'fortesza',
    name: 'Fortesza',
    category: 'investing',
    featured: true,
    summary: 'Plataforma panameña de micro-inversión en acciones y ETF de EE. UU. y en factoring de facturas de empresas de Panamá.',
    features: [
      'Acciones y ETF de EE. UU. desde $5.',
      'Factoring: financias facturas por cobrar de empresas reconocidas en Panamá, desde $50.',
    ],
    costs: 'Retornos de factoring reportados entre 8 % y 12 % anual (cifras de la empresa y de prensa de 2019-2020).',
    regulation: { text: 'Registrada como sujeto obligado no financiero ante la Superintendencia de Bancos (Ley 23 de 2015); la empresa indica también registro en la SMV.', claimed: true },
    caveats: [
      'La información pública disponible es de 2018-2023: confirma en fortesza.com que el servicio sigue activo.',
      'El factoring no es un depósito: si la empresa deudora no paga, puedes perder dinero.',
    ],
    url: 'https://www.fortesza.com/',
    sources: [
      { label: 'Blog de Fortesza: invertir desde $5 y factoring desde $50', url: 'https://blog.fortesza.com/' },
      { label: 'Fintech News America: 7 fintech de Panamá', url: 'https://fintechnews.am/panama/50130/7-fintech-companies-from-panama-to-know/' },
      { label: 'La Estrella de Panamá: crowdfactoring', url: 'https://www.laestrella.com.pa/economia/el-crowdfactoring-un-apoyo-financiero-empresarial-que-toma-fuerza-en-panama-GF6887976' },
    ],
  },
  {
    slug: 'hapi',
    name: 'Hapi',
    category: 'investing',
    summary: 'App para comprar acciones y ETF de EE. UU. desde Latinoamérica, con clientes en Panamá.',
    features: ['Fracciones de acciones y ETF desde $5.', 'Sin comisión por compra y venta de acciones (según guías de 2026).'],
    regulation: { text: 'El corretaje lo da Hapi Securities, LLC, miembro de FINRA/SIPC en EE. UU. No tiene licencia de la SMV de Panamá.', claimed: false },
    caveats: ['Al no tener licencia panameña, un reclamo se tramita bajo reglas de EE. UU.', 'Hay reseñas de usuarios sobre fondos retenidos durante verificaciones.'],
    url: 'https://hapi.trade/',
    sources: [
      { label: 'Hapi: invertir en la bolsa', url: 'https://hapi.trade/en/start' },
      { label: 'Rankia: mejores brokers para invertir desde Panamá (2026)', url: 'https://www.rankia.co/blog/trading-desde-cero/7207493-mejores-brokers-invertir-panama' },
    ],
  },
  {
    slug: 'yappy',
    name: 'Yappy',
    category: 'payments',
    summary: 'La plataforma de pagos con el número de celular de Banco General, integrada con varios bancos de Panamá.',
    features: [
      'Enviar y recibir dinero al instante con el número de celular.',
      'Pagar en más de 30,000 comercios afiliados.',
      'Desde octubre de 2026 también funciona para clientes de Banistmo (ocho bancos en total).',
    ],
    regulation: { text: 'Servicio de Banco General, banco supervisado por la Superintendencia de Bancos de Panamá.', claimed: false },
    caveats: ['Hay topes de envío según el banco: revísalos en tu banca.'],
    url: 'https://www.yappy.com.pa/',
    sources: [
      { label: 'Newsroom Panama: Yappy (septiembre 2026)', url: 'https://newsroompanama.com/2026/09/20/a-benchmark-for-digital-payments-in-panama-is-yappys-ambition-to-become/' },
      { label: 'En El Medio: Banistmo incorpora Yappy (octubre 2026)', url: 'https://www.enelmediopanama.com/2026/10/12/banistmo-incorpora-yappy-y-amplia-las-opciones-de-pagos-digitales-para-mas-de-600-mil-clientes/' },
    ],
  },
  {
    slug: 'kuara',
    name: 'Kuara',
    category: 'payments',
    summary: 'Red panameña de pagos inmediatos entre bancos: transferencias con solo el número de celular, 24/7.',
    features: [
      'Transferencias interbancarias al instante, incluso fines de semana y feriados.',
      'Creada por Global Bank, MMG Bank y Banesco; luego se sumaron Banistmo y Caja de Ahorros (2025).',
    ],
    regulation: { text: 'La operan bancos supervisados por la Superintendencia de Bancos de Panamá.', claimed: false },
    caveats: ['Se usa desde la app de tu banco: solo si tu banco participa.'],
    url: 'https://www.prensa.com/tema/kuara/',
    sources: [
      { label: 'La Prensa: Yappy, Nequi, Zinli y Kuara', url: 'https://www.prensa.com/economia/yappy-nequi-zinli-y-ahora-kuara-compiten-en-el-mercado-de-los-pagos-digitales-en-panama/' },
      { label: 'La Estrella: Caja de Ahorros se integra a Kuara (2025)', url: 'https://www.laestrella.com.pa/economia/pagos-interbancarios-al-instante-caja-de-ahorros-se-integra-a-kuara-MK16946486' },
    ],
  },
  {
    slug: 'zinli',
    name: 'Zinli',
    category: 'payments',
    summary: 'Billetera en dólares de Banco Mercantil Panamá, con tarjeta Visa prepagada para compras nacionales e internacionales.',
    features: [
      'Tarjeta Visa prepagada virtual y física.',
      'Desde abril de 2026, transferencias interbancarias inmediatas por ACH Xpress.',
    ],
    costs: 'En 2024 anunció un cargo de $0.99 al mes por la tarjeta, además de comisiones de recarga; verifica las tarifas vigentes.',
    regulation: { text: 'Billetera de Banco Mercantil Panamá, banco supervisado por la Superintendencia de Bancos.', claimed: false },
    caveats: ['Revisa las comisiones de recarga antes de usarla como cuenta principal.'],
    url: 'https://www.zinli.com/',
    sources: [
      { label: 'E&N: Zinli permite transferencias interbancarias (2026)', url: 'https://www.revistaeyn.com/finanzas/zinli-es-la-primera-fintech-en-panama-en-permitir-transferencias-interbancarias-KH30378570' },
      { label: 'El Diario: cuotas de mantenimiento (2024)', url: 'https://eldiario.com/2024/08/21/zinli-anuncio-cuotas-mantenimientos-usuarios-plataforma/' },
    ],
  },
  {
    slug: 'punto-pago',
    name: 'Punto Pago',
    category: 'payments',
    summary: 'App panameña gratuita con billetera, tarjetas débito Mastercard y pago de servicios.',
    features: [
      'Pagar servicios (Ensa, Naturgy, Panapass, Tigo, Más Móvil) y recargas.',
      'Tarjeta débito Mastercard física y virtual.',
      'Transferencias y cobros entre usuarios con código QR, y cashback en compras.',
    ],
    regulation: { text: 'No encontramos información pública sobre su supervisión: pregúntala antes de mantener saldos altos.', claimed: false },
    caveats: ['Verifica las funciones vigentes en la app: la información pública es de las fichas de la tienda.'],
    url: 'https://www.puntopago.net/',
    sources: [{ label: 'Punto Pago en App Store (Panamá)', url: 'https://apps.apple.com/pa/app/punto-pago/id1415876448' }],
  },
];

export const FINTECH_CATEGORIES: FintechCategory[] = ['payments', 'investing', 'crypto'];

/** Cómo verificar una fintech en Panamá (enlaces oficiales). */
export const REGULATORS: FintechSource[] = [
  { label: 'Superintendencia del Mercado de Valores (SMV): entidades reguladas', url: 'https://supervalores.gob.pa/' },
  { label: 'Superintendencia de Bancos de Panamá (SBP)', url: 'https://www.superbancos.gob.pa/' },
];
