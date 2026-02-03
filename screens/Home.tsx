import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, ResponsiveContainer, BarChart, Bar, XAxis } from 'recharts';
import { StorageService } from '../services/storage';
import { Transaction } from '../types';
import { db } from '../services/firebase';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
        try {
            const loadedTransactions = await StorageService.getTransactions();
            setTransactions(loadedTransactions);
            
            // Calculate locally based on fetched data
            setBalance(StorageService.calculateBalance(loadedTransactions));
            setIncome(StorageService.calculateIncome(loadedTransactions));
            setExpense(StorageService.calculateExpense(loadedTransactions));

            // Prepare simple chart data
            const graphData = loadedTransactions.slice(0, 7).reverse().map((t, index) => ({
                name: index.toString(),
                value: Math.abs(t.amount)
            }));
            
            if (graphData.length === 0) {
                setChartData([{name: '0', value: 0}, {name: '1', value: 0}]);
            } else {
                setChartData(graphData);
            }
        } catch (error) {
            console.error("Error loading data", error);
        } finally {
            setLoading(false);
        }
    };
    
    loadData();
  }, []);

  if (loading) {
      return (
          <div className="h-screen flex items-center justify-center bg-gray-50">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
      );
  }

  return (
    <div className="pb-32 pt-8 px-5">
      {/* Background Ambient */}
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 z-[-1]"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-pink-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 z-[-1]"></div>

      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <p className="text-sm font-medium text-gray-500">Hola,</p>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600">
            Valeria y Andrés
          </h1>
          {!db && <p className="text-[10px] text-orange-500 font-bold mt-1">Modo Local (Sin sincronizar)</p>}
        </div>
        <button className="p-2 rounded-full glass-panel hover:bg-white transition-colors shadow-sm relative">
          <span className="material-icons-round text-gray-600">notifications</span>
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
        </button>
      </header>

      {/* Net Worth Card */}
      <div className="w-full mb-8 relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl blur opacity-30 group-hover:opacity-40 transition-opacity"></div>
        <div className="relative glass-panel bg-gradient-to-br from-indigo-500/90 to-purple-600/90 border-none rounded-3xl p-6 text-white overflow-hidden shadow-xl">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
          
          <div className="flex justify-between items-start mb-2 relative z-10">
            <span className="text-sm font-medium text-white/80">Balance Total</span>
            <span className="material-icons-round text-white/80 text-lg">visibility</span>
          </div>
          
          <div className="flex items-baseline gap-2 mb-4 relative z-10">
            <h2 className="text-4xl font-bold tracking-tight">€{balance.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</h2>
          </div>

          <div className="h-20 w-full relative z-10 -mb-4 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#ffffff" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Summary Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="glass-panel rounded-2xl p-4 shadow-sm hover:-translate-y-1 transition-transform">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-green-100 rounded-xl text-green-600">
                <span className="material-icons-round text-xl">payments</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 font-medium mb-1">Ingresos</p>
            <h3 className="text-lg font-bold text-gray-800">€{income.toLocaleString()}</h3>
        </div>
        <div className="glass-panel rounded-2xl p-4 shadow-sm hover:-translate-y-1 transition-transform">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-red-100 rounded-xl text-red-500">
                <span className="material-icons-round text-xl">shopping_cart</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 font-medium mb-1">Gastos</p>
            <h3 className="text-lg font-bold text-gray-800">€{expense.toLocaleString()}</h3>
        </div>
      </div>

      {/* Recents */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800 text-lg">Recientes</h3>
          <button onClick={() => navigate('/transactions')} className="text-sm font-medium text-pink-600">
            {transactions.length === 0 ? 'Sin datos' : 'Ver todo'}
          </button>
        </div>
        
        {transactions.length === 0 ? (
           <div className="glass-panel p-6 rounded-2xl text-center border border-white/60">
             <p className="text-gray-500 text-sm">No hay transacciones aún. <br/>¡Agrega la primera!</p>
           </div>
        ) : (
          <div className="space-y-3">
            {transactions.slice(0, 3).map((t) => (
              <div 
                key={t.id} 
                onClick={() => navigate(`/edit/${t.id}`, { state: { transaction: t } })}
                className="glass-panel p-3 rounded-2xl flex items-center justify-between border border-white/60 cursor-pointer hover:bg-white/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full ${t.iconColor} flex items-center justify-center relative`}>
                    <span className="material-icons-round text-xl">{t.icon}</span>
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-[2px] shadow-sm">
                        <span className={`flex w-4 h-4 items-center justify-center rounded-full text-[8px] font-bold text-white ${t.createdBy === 'Andrés' ? 'bg-blue-500' : 'bg-pink-500'}`}>
                            {t.createdBy ? t.createdBy.charAt(0) : '?'}
                        </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{t.title}</p>
                    <p className="text-xs text-gray-500">{new Date(t.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`font-bold ${t.type === 'expense' ? 'text-slate-800' : 'text-green-600'}`}>
                  {t.type === 'expense' ? '-' : '+'} €{Math.abs(t.amount).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;