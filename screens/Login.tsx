import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Andrea79*') {
      setError('');
      // Redirect directly to Add Transaction as requested
      navigate('/add');
    } else {
      setError('Contraseña incorrecta');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden flex flex-col items-center justify-center p-6">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-pink-500 rounded-full mix-blend-screen filter blur-[80px] opacity-30 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-72 h-72 bg-purple-600 rounded-full mix-blend-screen filter blur-[80px] opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-80 h-80 bg-indigo-600 rounded-full mix-blend-screen filter blur-[80px] opacity-30 animate-blob animation-delay-4000"></div>

      {/* Header */}
      <div className="relative z-10 flex flex-col items-center mb-10">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20 mb-4">
          <span className="material-icons-round text-white text-xl">auto_graph</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Finanzas Pro</h1>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm relative z-10">
        <div className="glass-card-dark rounded-3xl p-8 border border-white/10 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
              Bienvenido
            </h2>
            <p className="text-slate-400 text-sm">Ingresa tu contraseña para continuar</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-center">
                <p className="text-sm text-red-200 font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 ml-1 uppercase tracking-wider">Contraseña</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-icons-round text-slate-500 group-focus-within:text-purple-400 transition-colors">lock_outline</span>
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-11 pr-4 py-3.5 rounded-2xl border border-white/10 bg-slate-800/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-lg shadow-lg shadow-purple-500/30 active:scale-95 hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2"
            >
              Ingresar
              <span className="material-icons-round">arrow_forward</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;