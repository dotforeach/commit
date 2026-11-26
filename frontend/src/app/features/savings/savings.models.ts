export type GoalKind = 'EMERGENCY_FUND' | 'SAVINGS_GOAL' | 'RETIREMENT';
export type GoalStatus = 'ACTIVE' | 'ACHIEVED' | 'PAUSED' | 'CANCELLED';

export interface GoalPayload {
  name: string;
  targetAmount: string;
  monthsOfExpenses: number | null;
}
export interface Contribution {
  id: string;
  date: string;
  amount: string;
  note: string | null;
}
export interface Goal extends GoalPayload {
  id: string;
  accountId: string | null;
  kind: GoalKind;
  currency: string;
  targetDate: string | null;
  priority: number;
  status: GoalStatus;
  revision: string;
  contributions: Contribution[];
}
export type GoalDraft = Omit<Goal, 'id' | 'revision' | 'contributions'>;

export interface DepositPayload {
  institution: string;
  principal: string;
  annualRate: string; // fracción
}
export interface Deposit extends DepositPayload {
  id: string;
  accountId: string;
  currency: string;
  rateType: 'FIXED' | 'VARIABLE' | 'INDEXED' | 'NONE';
  startDate: string;
  maturityDate: string;
  autoRenew: boolean;
  status: 'ACTIVE' | 'MATURED' | 'RENEWED' | 'CANCELLED';
  revision: string;
}

export type AssetClass = 'STOCK' | 'CEDEAR' | 'BOND' | 'ETF' | 'MUTUAL_FUND' | 'CRYPTO' | 'STABLECOIN' | 'REAL_ESTATE' | 'OTHER';
export interface Asset {
  id: string;
  assetClass: AssetClass;
  currency: string;
  symbol: string;
  name: string;
}
export interface ManualPrice {
  id: string;
  assetId: string;
  date: string;
  price: string;
}
export type TradeType = 'BUY' | 'SELL' | 'DIVIDEND' | 'INTEREST' | 'FEE';
export interface InvestmentTrade {
  id: string;
  accountId: string;
  assetId: string;
  cashTransactionId: string | null;
  type: TradeType;
  date: string;
  quantity: string;
  unitPrice: string;
  fees: string;
  notes: string | null;
}
