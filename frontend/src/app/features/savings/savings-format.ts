export { depositProjection } from './savings-math';

/** Número de proyección → string decimal con 2 decimales como máximo (para formatMoney). */
export const toMoneyString = (n: number) => {
  const s = (Math.round(n * 100) / 100).toFixed(2);
  return s.replace(/\.?0+$/, '') || '0';
};
