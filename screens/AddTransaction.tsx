import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { StorageService } from '../services/storage';
import { Category, Transaction } from '../types';

// Extended Icon List with even more options
const ICONS = [
  // Food & Drink
  'restaurant', 'local_cafe', 'local_bar', 'cake', 'local_pizza', 'liquor', 'icecream', 'bakery_dining', 'lunch_dining',
  // Transport
  'directions_car', 'local_taxi', 'flight', 'directions_bus', 'train', 'subway', 'two_wheeler', 'local_gas_station', 'commute',
  // Shopping
  'shopping_cart', 'shopping_bag', 'store', 'card_giftcard', 'receipt', 'sell', 'checkroom',
  // Housing & Utilities
  'home', 'apartment', 'cottage', 'wifi', 'water_drop', 'bolt', 'lightbulb', 'plumbing', 'kitchen', 'bed', 'chair', 'build',
  // Entertainment
  'movie', 'videogame_asset', 'music_note', 'sports_soccer', 'sports_tennis', 'pool', 'spa', 'park', 'beach_access', 'forest', 'toys',
  // Health
  'medical_services', 'local_hospital', 'local_pharmacy', 'healing', 'fitness_center', 'monitor_heart',
  // Finances & Work
  'work', 'business', 'savings', 'attach_money', 'euro', 'currency_bitcoin', 'add_card', 'wallet', 'account_balance',
  // Education & Kids
  'school', 'book', 'child_care', 'baby_changing_station',
  // Pets
  'pets', 
  // Services
  'local_laundry_service', 'dry_cleaning', 'construction', 'local_shipping', 'hotel', 'phone_iphone'
];

const PAYMENT_METHODS = [
  { id: 'efectivo', label: 'Efectivo', icon: 'payments' },
  { id: 'debito', label: 'Débito', icon: 'credit_card' },
  { id: 'credito', label: 'Crédito', icon: 'card_membership' },
  { id: 'transferencia', label: 'Transferencia', icon: 'account_balance' },
];

const AddTransaction: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const isEditing = !!id;

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  
  // Default to today's date
  const [date, setDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });

  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [paymentMethod, setPaymentMethod] = useState('efectivo');
  const [createdBy, setCreatedBy] = useState<'Andrés' | 'Valeria'>('Valeria');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [categories, setCategories] = useState<Category[]>([]);
  
  // New Category Modal State
  const [showNewCatModal, setShowNewCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('category');

  useEffect(() => {
    const init = async () => {
        // Load categories first
        const cats = await StorageService.getCategories();
        setCategories(cats);

        // If editing, load transaction data
        if (isEditing) {
            // Check if we passed the transaction object in state (faster)
            const stateTransaction = location.state?.transaction as Transaction | undefined;
            
            if (stateTransaction) {
                populateForm(stateTransaction);
            } else {
                // Fallback: fetch from DB (for deep links/refreshes) - simplified for now by loading all
                // In a huge app we would fetch single doc by ID
                const all = await StorageService.getTransactions();
                const found = all.find(t => t.id === id);
                if (found) populateForm(found);
            }
        }
    };
    init();
  }, [id, isEditing, location.state]);

  const populateForm = (t: Transaction) => {
      setAmount(Math.abs(t.amount).toString());
      setDescription(t.title);
      setCategoryId(t.categoryId);
      setDate(t.date);
      setType(t.type);
      setPaymentMethod(t.paymentMethod || 'efectivo');
      setCreatedBy(t.createdBy);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || !categoryId || isSubmitting) return;

    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    setIsSubmitting(true);
    const finalAmount = parseFloat(amount);
    
    const transactionData: any = {
      title: description,
      categoryId: category.id,
      categoryName: category.name,
      amount: type === 'expense' ? -Math.abs(finalAmount) : Math.abs(finalAmount),
      date: date,
      type: type,
      icon: category.icon,
      iconColor: category.color,
      paymentMethod: paymentMethod,
      createdBy: createdBy
    };

    if (isEditing && id) {
        await StorageService.updateTransaction({
            id: id,
            ...transactionData
        });
    } else {
        await StorageService.saveTransaction({
            id: Date.now().toString(), // Will be ignored by Firestore
            ...transactionData
        });
    }

    setIsSubmitting(false);
    navigate('/home');
  };

  const handleDelete = async () => {
      if (!isEditing || !id) return;
      
      if (window.confirm('¿Estás seguro de que quieres eliminar este registro?')) {
          setIsSubmitting(true);
          await StorageService.deleteTransaction(id);
          setIsSubmitting(false);
          navigate('/home');
      }
  };

  const handleAddCategory = async () => {
    if(!newCatName) return;
    const newCat: Category = {
        id: `cat_${Date.now()}`,
        name: newCatName,
        icon: newCatIcon,
        color: `bg-indigo-100 text-indigo-500`, // Default color for custom cats
        type: 'both'
    };
    
    // Optimistic update
    setCategories([...categories, newCat]);
    setCategoryId(newCat.id); 
    setShowNewCatModal(false);
    setNewCatName('');

    // Async save
    await StorageService.saveCategory(newCat);
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden flex flex-col p-6">
       {/* Background Ambient */}
       <div className="fixed top-[-10%] right-[-10%] w-[350px] h-[350px] bg-indigo-200 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 z-0"></div>
       <div className="fixed bottom-[-10%] left-[-10%] w-[350px] h-[350px] bg-pink-200 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 z-0"></div>

      <header className="relative z-10 flex items-center justify-between mb-6 pt-4">
        {/* Go to Home since this might be the entry screen now */}
        <button onClick={() => navigate('/home')} className="p-2 rounded-full hover:bg-black/5 transition-colors">
          <span className="material-icons-round text-gray-600">close</span>
        </button>
        <h1 className="text-xl font-bold tracking-tight text-gray-900">
            {isEditing ? 'Editar Registro' : (type === 'expense' ? 'Registrar Gasto' : 'Registrar Ingreso')}
        </h1>
        <button 
            onClick={() => setType(type === 'expense' ? 'income' : 'expense')}
            className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wide transition-colors ${type === 'expense' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-600 border-green-200'}`}
        >
          {type === 'expense' ? 'Es Ingreso' : 'Es Gasto'}
        </button>
      </header>

      {/* User Selector */}
      <div className="relative z-10 bg-white/60 p-1.5 rounded-2xl flex mb-6 shadow-sm border border-white/50 backdrop-blur-sm">
        {['Valeria', 'Andrés'].map((user) => (
          <button
            key={user}
            type="button"
            onClick={() => setCreatedBy(user as any)}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all shadow-sm ${createdBy === user ? 'bg-white text-indigo-600 shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
          >
            {user}
          </button>
        ))}
      </div>

      {/* Amount Display */}
      <div className="glass-panel bg-white/60 rounded-[2rem] p-6 mb-6 shadow-sm text-center relative overflow-hidden border border-white/80 z-10">
        <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${type === 'expense' ? 'from-orange-500 to-red-500' : 'from-green-500 to-emerald-500'}`}></div>
        <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Monto</label>
        <div className="flex items-center justify-center relative">
          <span className="text-4xl font-light text-gray-400 mr-2">$</span>
          <input 
            type="number" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-transparent border-none text-5xl font-bold text-gray-900 placeholder-gray-200 focus:ring-0 w-full text-center p-0 appearance-none m-0"
            placeholder="0.00"
          />
          <span className="absolute right-0 bottom-2 text-sm font-bold text-gray-400">MXN</span>
        </div>
      </div>

      {/* Form */}
      <form className="space-y-4 flex-grow relative z-10" onSubmit={handleSubmit}>
        
        {/* Category */}
        <div className="group">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold text-gray-600 ml-1">Categoría</label>
            <button type="button" onClick={() => setShowNewCatModal(true)} className="text-xs font-bold text-indigo-600 flex items-center">
                <span className="material-icons-round text-sm mr-1">add</span> Nueva
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="material-icons-round text-indigo-500">category</span>
            </div>
            <select 
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="glass-panel bg-white/50 block w-full pl-11 pr-10 py-3.5 text-base rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-shadow shadow-sm text-gray-900 appearance-none border border-gray-200"
            >
              <option value="" disabled>Selecciona una categoría</option>
              {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <span className="material-icons-round text-gray-400">expand_more</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-600 mb-2 ml-1">Descripción</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="material-icons-round text-pink-500">description</span>
            </div>
            <input 
              type="text" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="glass-panel bg-white/50 block w-full pl-11 pr-4 py-3.5 text-base rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-shadow shadow-sm text-gray-900 placeholder-gray-400 border border-gray-200"
              placeholder={type === 'expense' ? "¿En qué gastaste?" : "¿Origen del ingreso?"}
            />
          </div>
        </div>

        {/* Date */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-600 mb-2 ml-1">Fecha</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="material-icons-round text-indigo-500">calendar_today</span>
            </div>
            <input 
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="glass-panel bg-white/50 block w-full pl-11 pr-4 py-3.5 text-base rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-shadow shadow-sm text-gray-900 border border-gray-200"
            />
          </div>
        </div>

        {/* Payment Method */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-600 mb-2 ml-1">Método de Pago</label>
          <div className="grid grid-cols-2 gap-2">
            {PAYMENT_METHODS.map((pm) => (
               <button
                  key={pm.id}
                  type="button"
                  onClick={() => setPaymentMethod(pm.id)}
                  className={`flex items-center gap-2 p-3 rounded-2xl border transition-all ${paymentMethod === pm.id ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-500/50' : 'bg-white/40 border-gray-200 hover:bg-white/60'}`}
               >
                   <span className={`material-icons-round text-lg ${paymentMethod === pm.id ? 'text-indigo-600' : 'text-gray-400'}`}>{pm.icon}</span>
                   <span className={`text-sm font-medium ${paymentMethod === pm.id ? 'text-indigo-900' : 'text-gray-600'}`}>{pm.label}</span>
               </button>
            ))}
          </div>
        </div>

        <button 
          type="submit"
          disabled={isSubmitting}
          className={`w-full text-white font-bold py-4 px-6 rounded-2xl shadow-lg transform transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2 
            ${type === 'expense' 
                ? 'bg-gradient-to-r from-red-500 to-pink-500 shadow-red-500/30' 
                : 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-green-500/30'}
             ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
              <span className="material-icons-round">check_circle</span>
          )}
          {isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Confirmar')}
        </button>

        {isEditing && (
            <button 
                type="button"
                onClick={handleDelete}
                className="w-full text-red-500 font-bold py-3 px-6 rounded-2xl border-2 border-red-100 bg-red-50 hover:bg-red-100 transition-colors mt-4 flex items-center justify-center gap-2"
            >
                <span className="material-icons-round">delete_outline</span>
                Eliminar Registro
            </button>
        )}
      </form>

      {/* New Category Modal */}
      {showNewCatModal && (
          <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6">
              <div className="bg-white rounded-[2rem] p-6 w-full max-w-sm shadow-2xl overflow-hidden">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Nueva Categoría</h3>
                  
                  <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Nombre</label>
                        <input 
                            type="text" 
                            value={newCatName}
                            onChange={(e) => setNewCatName(e.target.value)}
                            className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Ej. Gimnasio"
                        />
                      </div>
                      
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Icono</label>
                        <div className="grid grid-cols-6 gap-2 mt-2 max-h-48 overflow-y-auto no-scrollbar">
                            {ICONS.map(icon => (
                                <button
                                    key={icon}
                                    type="button"
                                    onClick={() => setNewCatIcon(icon)}
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${newCatIcon === icon ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                >
                                    <span className="material-icons-round text-lg">{icon}</span>
                                </button>
                            ))}
                        </div>
                      </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                      <button 
                        type="button" 
                        onClick={() => setShowNewCatModal(false)}
                        className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition-colors"
                      >
                          Cancelar
                      </button>
                      <button 
                        type="button"
                        onClick={handleAddCategory}
                        className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30"
                      >
                          Crear
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default AddTransaction;