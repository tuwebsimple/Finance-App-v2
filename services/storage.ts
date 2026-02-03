import { Transaction, Category } from '../types';
import { db } from './firebase';
import { collection, addDoc, getDocs, query, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore";

const TRANSACTIONS_KEY = 'finanzas_pro_transactions';
const CATEGORIES_KEY = 'finanzas_pro_categories';

// Default categories if none exist
const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat_1', name: 'Comida', icon: 'restaurant', color: 'bg-orange-100 text-orange-500', type: 'expense' },
  { id: 'cat_2', name: 'Transporte', icon: 'directions_car', color: 'bg-purple-100 text-purple-600', type: 'expense' },
  { id: 'cat_3', name: 'Vivienda', icon: 'home', color: 'bg-blue-100 text-blue-600', type: 'expense' },
  { id: 'cat_4', name: 'Salario', icon: 'payments', color: 'bg-green-100 text-green-600', type: 'income' },
  { id: 'cat_5', name: 'Entretenimiento', icon: 'movie', color: 'bg-pink-100 text-pink-500', type: 'expense' },
];

export const StorageService = {
  // ---- Helper para Cálculos ----
  calculateBalance: (transactions: Transaction[]) => {
      return transactions.reduce((acc, curr) => acc + curr.amount, 0);
  },
  
  calculateIncome: (transactions: Transaction[]) => {
      return transactions
        .filter(t => t.type === 'income')
        .reduce((acc, curr) => acc + curr.amount, 0);
  },

  calculateExpense: (transactions: Transaction[]) => {
      return transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, curr) => acc + Math.abs(curr.amount), 0);
  },

  // ---- Operaciones Asíncronas ----

  getTransactions: async (): Promise<Transaction[]> => {
    if (db) {
        // Modo Nube (Firebase)
        try {
            const q = query(collection(db, "transactions"), orderBy("date", "desc"));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
        } catch (e) {
            console.error("Error fetching transactions from cloud:", e);
            return [];
        }
    } else {
        // Modo Local
        const data = localStorage.getItem(TRANSACTIONS_KEY);
        // Simulamos un pequeño delay para que la UI se comporte igual
        return Promise.resolve(data ? JSON.parse(data) : []);
    }
  },

  saveTransaction: async (transaction: Transaction) => {
    if (db) {
         // Modo Nube
         // Quitamos el ID generado localmente para dejar que Firebase genere uno único
         const { id, ...dataToSave } = transaction; 
         await addDoc(collection(db, "transactions"), dataToSave);
    } else {
         // Modo Local
         const current = await StorageService.getTransactions();
         const updated = [transaction, ...current];
         localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updated));
    }
  },

  updateTransaction: async (transaction: Transaction) => {
    if (db) {
        // Modo Nube
        try {
            const transactionRef = doc(db, "transactions", transaction.id);
            // No guardamos el ID dentro del documento en Firestore, solo los datos
            const { id, ...dataToUpdate } = transaction;
            await updateDoc(transactionRef, dataToUpdate);
        } catch (e) {
            console.error("Error updating transaction:", e);
        }
    } else {
        // Modo Local
        const current = await StorageService.getTransactions();
        const updated = current.map(t => t.id === transaction.id ? transaction : t);
        localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updated));
    }
  },

  deleteTransaction: async (id: string) => {
    if (db) {
        // Modo Nube
        try {
            await deleteDoc(doc(db, "transactions", id));
        } catch (e) {
             console.error("Error deleting transaction:", e);
        }
    } else {
        // Modo Local
        const current = await StorageService.getTransactions();
        const updated = current.filter(t => t.id !== id);
        localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updated));
    }
  },

  getCategories: async (): Promise<Category[]> => {
    if (db) {
        // Modo Nube
        try {
            const querySnapshot = await getDocs(collection(db, "categories"));
            const cats = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
            if (cats.length === 0) {
                 return DEFAULT_CATEGORIES;
            }
            return cats;
        } catch (e) {
            return DEFAULT_CATEGORIES;
        }
    } else {
        // Modo Local
        const data = localStorage.getItem(CATEGORIES_KEY);
        if (!data) {
          localStorage.setItem(CATEGORIES_KEY, JSON.stringify(DEFAULT_CATEGORIES));
          return Promise.resolve(DEFAULT_CATEGORIES);
        }
        return Promise.resolve(JSON.parse(data));
    }
  },

  saveCategory: async (category: Category) => {
    if (db) {
        const { id, ...dataToSave } = category;
        await addDoc(collection(db, "categories"), dataToSave);
    } else {
        const current = await StorageService.getCategories();
        const updated = [...current, category];
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(updated));
    }
  }
};