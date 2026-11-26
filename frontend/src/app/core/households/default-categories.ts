/** Categorías iniciales de cada hogar. El nombre sale de i18n (`categories.<systemKey>`) y se guarda cifrado. */
export interface DefaultCategory {
  systemKey: string;
  kind: 'INCOME' | 'EXPENSE';
  budgetGroup: 'NEEDS' | 'WANTS' | 'SAVINGS' | null;
  icon: string; // Material Symbols
  color: string;
}

export const DEFAULT_CATEGORIES: DefaultCategory[] = [
  { systemKey: 'income.salary', kind: 'INCOME', budgetGroup: null, icon: 'payments', color: '#2e7d32' },
  { systemKey: 'income.bonus', kind: 'INCOME', budgetGroup: null, icon: 'redeem', color: '#388e3c' },
  { systemKey: 'income.freelance', kind: 'INCOME', budgetGroup: null, icon: 'work', color: '#43a047' },
  { systemKey: 'income.other', kind: 'INCOME', budgetGroup: null, icon: 'add_card', color: '#66bb6a' },

  { systemKey: 'housing.rent', kind: 'EXPENSE', budgetGroup: 'NEEDS', icon: 'home', color: '#1565c0' },
  { systemKey: 'housing.utilities', kind: 'EXPENSE', budgetGroup: 'NEEDS', icon: 'bolt', color: '#1976d2' },
  { systemKey: 'food.groceries', kind: 'EXPENSE', budgetGroup: 'NEEDS', icon: 'shopping_cart', color: '#1e88e5' },
  { systemKey: 'transport', kind: 'EXPENSE', budgetGroup: 'NEEDS', icon: 'directions_bus', color: '#039be5' },
  { systemKey: 'health', kind: 'EXPENSE', budgetGroup: 'NEEDS', icon: 'medical_services', color: '#00acc1' },
  { systemKey: 'education', kind: 'EXPENSE', budgetGroup: 'NEEDS', icon: 'school', color: '#00897b' },
  { systemKey: 'insurance', kind: 'EXPENSE', budgetGroup: 'NEEDS', icon: 'shield', color: '#5c6bc0' },
  { systemKey: 'taxes', kind: 'EXPENSE', budgetGroup: 'NEEDS', icon: 'account_balance', color: '#3949ab' },

  { systemKey: 'food.restaurants', kind: 'EXPENSE', budgetGroup: 'WANTS', icon: 'restaurant', color: '#ef6c00' },
  { systemKey: 'entertainment', kind: 'EXPENSE', budgetGroup: 'WANTS', icon: 'theaters', color: '#f57c00' },
  { systemKey: 'subscriptions', kind: 'EXPENSE', budgetGroup: 'WANTS', icon: 'subscriptions', color: '#fb8c00' },
  { systemKey: 'shopping', kind: 'EXPENSE', budgetGroup: 'WANTS', icon: 'checkroom', color: '#ffa000' },
  { systemKey: 'travel', kind: 'EXPENSE', budgetGroup: 'WANTS', icon: 'flight', color: '#ff8f00' },
  { systemKey: 'gifts', kind: 'EXPENSE', budgetGroup: 'WANTS', icon: 'featured_seasonal_and_gifts', color: '#f4511e' },
  { systemKey: 'other', kind: 'EXPENSE', budgetGroup: 'WANTS', icon: 'more_horiz', color: '#8d6e63' },

  { systemKey: 'savings', kind: 'EXPENSE', budgetGroup: 'SAVINGS', icon: 'savings', color: '#6a1b9a' },
  { systemKey: 'debt.payments', kind: 'EXPENSE', budgetGroup: 'SAVINGS', icon: 'credit_card_off', color: '#7b1fa2' },
  { systemKey: 'investments', kind: 'EXPENSE', budgetGroup: 'SAVINGS', icon: 'trending_up', color: '#8e24aa' },
];
