import React, { useEffect, useState } from 'react';
import { StorageService } from '../services/storage';

const Budget: React.FC = () => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
        const transactions = await StorageService.getTransactions();
        setBalance(StorageService.calculateBalance(transactions));
        setLoading(false);
    }
    loadData();
  }, []);

  if (loading) return null;

  return (
    <div className="pb-32 pt-8 px-5">
       {/* Background Ambient */}
      <div className="fixed top-[0%] left-[-10%] w-[300px] h-[300px] bg-blue-100 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 z-[-1]"></div>
      <div className="fixed bottom-[20%] right-[-10%] w-[300px] h-[300px] bg-purple-100 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 z-[-1]"></div>

      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <div>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Resumen</p>
          <h1 className="text-2xl font-bold text-gray-900">Mi Presupuesto</h1>
        </div>
      </header>

      {/* Main Card */}
      <div className="w-full relative overflow-hidden rounded-[2rem] shadow-xl shadow-indigo-500/20 mb-6 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-700"></div>
        
        {/* Decorative Circles */}
        <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-[-20px] left-[-20px] w-40 h-40 bg-pink-500 opacity-20 rounded-full blur-2xl"></div>

        <div className="relative z-10 p-6">
          <div className="flex items-center gap-2 mb-6 opacity-90">
            <span className="material-icons-round text-xl">account_balance_wallet</span>
            <span className="text-sm font-medium">Disponible</span>
          </div>

          <div className="mb-8">
            <h2 className="text-4xl font-bold tracking-tight mb-3">€{balance.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</h2>
            <p className="text-sm opacity-70">Balance actual calculado en base a tus ingresos y gastos registrados.</p>
          </div>
        </div>
      </div>

      {/* Empty State / Placeholder for future budget features */}
      <div className="glass-panel bg-white/80 rounded-[2rem] p-8 shadow-sm border border-white/60 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            <span className="material-icons-round text-3xl">analytics</span>
        </div>
        <h3 className="font-bold text-gray-900 text-lg mb-2">Análisis de Presupuesto</h3>
        <p className="text-gray-500 text-sm mb-4">
            Registra más transacciones para ver un desglose detallado de tus gastos por categoría y recomendaciones de ahorro.
        </p>
      </div>
    </div>
  );
};

export default Budget;