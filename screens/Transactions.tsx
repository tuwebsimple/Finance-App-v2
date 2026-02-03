import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StorageService } from '../services/storage';
import { Transaction } from '../types';

const Transactions: React.FC = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
        const loadedTransactions = await StorageService.getTransactions();
        setTransactions(loadedTransactions);
        setBalance(StorageService.calculateBalance(loadedTransactions));
        setLoading(false);
    }
    loadData();
  }, []);

  if (loading) return (
     <div className="h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
  );

  return (
    <div className="pb-32 flex flex-col h-screen">
      {/* Background Gradient */}
      <div className="fixed inset-0 z-[-1] bg-gradient-to-br from-indigo-50 to-pink-50"></div>

      {/* Header Area */}
      <div className="pt-8 pb-4 px-6">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => navigate('/home')} className="p-2 rounded-full glass-panel hover:bg-white transition shadow-sm">
            <span className="material-icons-round text-gray-700">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold text-gray-800">Transacciones</h1>
          <button className="p-2 rounded-full glass-panel hover:bg-white transition shadow-sm">
            <span className="material-icons-round text-gray-700">settings</span>
          </button>
        </div>

        {/* Balance Card */}
        <div className="glass-panel bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-[2rem] shadow-lg border-none relative overflow-hidden mb-6">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
          <p className="text-sm font-medium text-indigo-100 mb-1">Balance Total</p>
          <h2 className="text-4xl font-bold mb-4">€{balance.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</h2>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-6 space-y-2">
        <h3 className="text-sm font-semibold text-gray-500 px-1 mt-2 mb-2">Historial Completo</h3>
        
        {transactions.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
                <span className="material-icons-round text-4xl mb-2">receipt_long</span>
                <p>No hay movimientos registrados.</p>
            </div>
        ) : (
            transactions.map(t => (
                <div 
                  key={t.id} 
                  onClick={() => navigate(`/edit/${t.id}`, { state: { transaction: t } })}
                  className="glass-panel p-4 rounded-[1.2rem] flex items-center justify-between border border-white/60 mb-3 hover:bg-white/80 transition-colors cursor-pointer"
                >
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl ${t.iconColor} flex items-center justify-center relative`}>
                            <span className="material-icons-round text-2xl">{t.icon}</span>
                            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-[2px] shadow-sm">
                                <span className={`flex w-4 h-4 items-center justify-center rounded-full text-[8px] font-bold text-white ${t.createdBy === 'Andrés' ? 'bg-blue-500' : 'bg-pink-500'}`}>
                                    {t.createdBy ? t.createdBy.charAt(0) : '?'}
                                </span>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900">{t.title}</h4>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                                <span>{t.categoryName}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                <span className="capitalize">{t.paymentMethod || 'Efectivo'}</span>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-0.5">{t.date}</p>
                        </div>
                    </div>
                    <span className={`font-bold text-lg ${t.type === 'expense' ? 'text-gray-900' : 'text-emerald-600'}`}>
                        {t.type === 'expense' ? '-' : '+'} €{Math.abs(t.amount).toFixed(2)}
                    </span>
                </div>
            ))
        )}
      </div>
    </div>
  );
};

export default Transactions;