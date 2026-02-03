import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const isActive = (route: string) => path === route;
  
  const getLinkClass = (route: string) => `
    flex flex-col items-center gap-1 transition-colors duration-200
    ${isActive(route) ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}
  `;

  return (
    <nav className="fixed bottom-0 left-0 w-full glass-panel border-t border-white/50 pb-safe pt-2 px-6 pb-6 z-50">
      <div className="flex justify-between items-center max-w-md mx-auto relative">
        <button onClick={() => navigate('/home')} className={getLinkClass('/home')}>
          <span className="material-icons-round text-2xl">dashboard</span>
          <span className="text-[10px] font-medium">Inicio</span>
        </button>
        
        <button onClick={() => navigate('/budget')} className={getLinkClass('/budget')}>
          <span className="material-icons-round text-2xl">analytics</span>
          <span className="text-[10px] font-medium">Reportes</span>
        </button>

        <div className="relative -top-6">
          <button 
            onClick={() => navigate('/add')}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/40 flex items-center justify-center text-white transform active:scale-95 transition-transform"
          >
            <span className="material-icons-round text-3xl">add</span>
          </button>
        </div>

        <button onClick={() => navigate('/transactions')} className={getLinkClass('/transactions')}>
          <span className="material-icons-round text-2xl">credit_card</span>
          <span className="text-[10px] font-medium">Tarjetas</span>
        </button>

        <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors">
          <span className="material-icons-round text-2xl">person</span>
          <span className="text-[10px] font-medium">Perfil</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;