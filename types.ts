export interface Transaction {
  id: string;
  title: string;
  categoryId: string;
  categoryName: string; // Denormalized for easier display
  amount: number;
  date: string;
  type: 'expense' | 'income';
  icon: string;
  iconColor: string;
  paymentMethod: string;
  createdBy: 'Andrés' | 'Valeria';
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'expense' | 'income' | 'both';
}

export interface ChartData {
  name: string;
  value: number;
}

export enum Tab {
  HOME = 'home',
  BUDGET = 'budget',
  TRANSACTIONS = 'transactions',
  CARDS = 'cards',
  PROFILE = 'profile',
}