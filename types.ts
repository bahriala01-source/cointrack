
export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export enum RecurringFrequency {
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export interface CategoryConfig {
  name: string;
  color: string;
  type: TransactionType;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
}

export interface RecurringTransaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  frequency: RecurringFrequency;
  nextDate: string;     // next due date ISO
  isActive: boolean;
}

export enum ViewState {
  DASHBOARD = 'Dashboard',
  TRANSACTIONS = 'Transactions',
  CATEGORIES = 'Categories',
  GOALS = 'Goals',
  SETTINGS = 'Settings',
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export type CategoryBudgets = Record<string, number>;
