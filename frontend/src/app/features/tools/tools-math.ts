/**
 * Calculadoras financieras (públicas). Proyecciones en punto flotante redondeadas a centavos:
 * son estimaciones educativas, no ofertas de un banco.
 */
const round2 = (n: number) => Math.round(n * 100) / 100;

// ── Interés compuesto ────────────────────────────────────────────────────────
export interface CompoundInput {
  initial: number;
  monthly: number;
  /** Tasa nominal anual (fracción), capitalización mensual. */
  annualRate: number;
  years: number;
}
export interface CompoundYear {
  year: number;
  contributed: number;
  interest: number;
  balance: number;
}
export function compoundGrowth(i: CompoundInput): { rows: CompoundYear[]; final: CompoundYear; effectiveRate: number } {
  const r = i.annualRate / 12;
  let balance = i.initial;
  let contributed = i.initial;
  const rows: CompoundYear[] = [];
  for (let m = 1; m <= Math.round(i.years * 12); m++) {
    balance = balance * (1 + r) + i.monthly; // aporte al final de cada mes
    contributed += i.monthly;
    if (m % 12 === 0 || m === Math.round(i.years * 12)) {
      rows.push({ year: Math.ceil(m / 12), contributed: round2(contributed), interest: round2(balance - contributed), balance: round2(balance) });
    }
  }
  const final = rows.at(-1) ?? { year: 0, contributed: round2(i.initial), interest: 0, balance: round2(i.initial) };
  return { rows, final, effectiveRate: Math.pow(1 + r, 12) - 1 };
}

// ── Hipoteca (sistema francés) ───────────────────────────────────────────────
export function payment(principal: number, annualRate: number, months: number): number {
  if (months <= 0) return 0;
  const r = annualRate / 12;
  return r === 0 ? principal / months : (principal * r) / (1 - Math.pow(1 + r, -months));
}

export interface MortgageInput {
  price: number;
  downPayment: number;
  annualRate: number;
  years: number;
  /** Subsidio de tasa (puntos porcentuales, fracción) durante los primeros años; 0 si no aplica. */
  subsidyPoints: number;
  subsidyYears: number;
}
export interface MortgageResult {
  loan: number;
  /** Cuota mientras rige el subsidio (o la única cuota, si no hay subsidio). */
  firstPayment: number;
  /** Cuota cuando termina el subsidio (null si no hay subsidio). */
  laterPayment: number | null;
  totalInterest: number;
  totalPaid: number;
  yearly: { year: number; interest: number; principal: number; balance: number }[];
}
export function mortgage(i: MortgageInput): MortgageResult {
  const loan = Math.max(i.price - i.downPayment, 0);
  const months = Math.round(i.years * 12);
  const subsidyMonths = i.subsidyPoints > 0 ? Math.min(Math.round(i.subsidyYears * 12), months) : 0;
  const subsidized = Math.max(i.annualRate - i.subsidyPoints, 0);
  let balance = loan;
  let current = payment(loan, subsidyMonths > 0 ? subsidized : i.annualRate, months);
  const firstPayment = current;
  let laterPayment: number | null = null;
  let totalInterest = 0;
  let totalPaid = 0;
  const yearly: MortgageResult['yearly'] = [];
  let yi = 0;
  let yp = 0;
  for (let m = 1; m <= months && balance > 0.005; m++) {
    if (m === subsidyMonths + 1 && subsidyMonths > 0) {
      current = payment(balance, i.annualRate, months - subsidyMonths);
      laterPayment = current;
    }
    const rate = m <= subsidyMonths ? subsidized : i.annualRate;
    const interest = balance * (rate / 12);
    const principal = Math.min(current - interest, balance);
    balance -= principal;
    totalInterest += interest;
    totalPaid += interest + principal;
    yi += interest;
    yp += principal;
    if (m % 12 === 0 || m === months) {
      yearly.push({ year: Math.ceil(m / 12), interest: round2(yi), principal: round2(yp), balance: round2(Math.max(balance, 0)) });
      yi = 0;
      yp = 0;
    }
  }
  return {
    loan: round2(loan),
    firstPayment: round2(firstPayment),
    laterPayment: laterPayment === null ? null : round2(laterPayment),
    totalInterest: round2(totalInterest),
    totalPaid: round2(totalPaid),
    yearly,
  };
}

// ── Tarjeta de crédito: cuánto tardas en pagarla ─────────────────────────────
export interface CardPayoffInput {
  balance: number;
  annualRate: number;
  /** Pago fijo por mes; o null para simular "solo el mínimo". */
  fixedPayment: number | null;
  /** Mínimo: % del saldo (fracción) con un piso en dólares. */
  minimumPct: number;
  minimumFloor: number;
}
export interface CardPayoff {
  months: number;
  totalInterest: number;
  totalPaid: number;
  /** Con ese pago la deuda no baja (los intereses le ganan). */
  never: boolean;
}
export function cardPayoff(i: CardPayoffInput, maxMonths = 600): CardPayoff {
  const r = i.annualRate / 12;
  let balance = i.balance;
  let months = 0;
  let totalInterest = 0;
  let totalPaid = 0;
  while (balance > 0.005 && months < maxMonths) {
    months++;
    const interest = balance * r;
    balance += interest;
    totalInterest += interest;
    const due = i.fixedPayment ?? Math.max(balance * i.minimumPct, i.minimumFloor);
    const pay = Math.min(due, balance);
    if (pay <= interest + 0.0001 && months > 1) return { months, totalInterest: round2(totalInterest), totalPaid: round2(totalPaid), never: true };
    balance -= pay;
    totalPaid += pay;
  }
  return { months, totalInterest: round2(totalInterest), totalPaid: round2(totalPaid), never: balance > 0.005 };
}

// ── Tarjeta de débito: costo anual de la cuenta ──────────────────────────────
export interface DebitAccountInput {
  name: string;
  /** Cargos fijos al año (anualidad de la tarjeta, etc.). */
  annualFees: number;
  /** Retiros en cajeros de otros bancos por mes y su costo. */
  otherAtmPerMonth: number;
  otherAtmFee: number;
  /** Retiros en ventanilla por mes que pasan del límite gratis, y su costo. */
  extraTellerPerMonth: number;
  tellerFee: number;
  /** Interés que paga la cuenta (fracción anual) sobre el saldo promedio. */
  annualRate: number;
  averageBalance: number;
}
export function debitAnnualCost(a: DebitAccountInput): { fees: number; interestEarned: number; net: number } {
  const fees = a.annualFees + 12 * (a.otherAtmPerMonth * a.otherAtmFee + a.extraTellerPerMonth * a.tellerFee);
  const interestEarned = a.averageBalance * a.annualRate;
  return { fees: round2(fees), interestEarned: round2(interestEarned), net: round2(fees - interestEarned) };
}

// ── Débito vs. crédito para una compra ───────────────────────────────────────
export interface PurchaseInput {
  amount: number;
  /** Cashback o puntos de la tarjeta de crédito (fracción). */
  cashbackPct: number;
  /** Tasa de la tarjeta de crédito si la compra se financia. */
  annualRate: number;
  /** Meses en que pagarías la compra con la tarjeta (1 = pagas el total al vencer). */
  months: number;
}
export interface PurchaseOption {
  key: 'debit' | 'creditFull' | 'creditFinanced';
  /** Costo neto: lo que pagas de más (negativo = ahorras). */
  netCost: number;
  interest: number;
  cashback: number;
}
export function debitVsCredit(i: PurchaseInput): PurchaseOption[] {
  const cashback = round2(i.amount * i.cashbackPct);
  const financedMonths = Math.max(i.months, 2);
  const monthlyPay = payment(i.amount, i.annualRate, financedMonths);
  const interest = round2(monthlyPay * financedMonths - i.amount);
  return [
    { key: 'debit', netCost: 0, interest: 0, cashback: 0 },
    { key: 'creditFull', netCost: -cashback, interest: 0, cashback },
    { key: 'creditFinanced', netCost: round2(interest - cashback), interest, cashback },
  ];
}
