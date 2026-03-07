
import React, { useState } from 'react';
import { TransactionType, CategoryConfig } from '../types';
import { X, CurrencyDollar, CalendarBlank, Tag, TextAa } from 'phosphor-react';
import { useToast } from './Toast';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (transaction: { title: string; amount: number; type: TransactionType; category: string; date: string }) => void;
  categories: CategoryConfig[];
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose, onAdd, categories }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const toast = useToast();

  const filteredCategories = categories.filter(c => c.type === type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || !category) return;
    onAdd({ title, amount: parseFloat(amount), type, category, date });
    toast.addToast('Transaction saved successfully!', 'success');
    setTitle('');
    setAmount('');
    setCategory('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-[#1C2033] border border-white/[0.08] rounded-2xl shadow-2xl w-full max-w-md p-6 animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">New Transaction</h3>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/[0.04] text-[#4B5568] hover:text-white hover:bg-white/[0.08] transition-all">
            <X weight="bold" className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Type toggle */}
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => { setType(TransactionType.EXPENSE); setCategory(''); }}
              className={`py-3 rounded-xl text-sm font-bold border transition-all ${type === TransactionType.EXPENSE ? 'bg-[#FF6B6B]/10 border-[#FF6B6B]/40 text-[#FF6B6B]' : 'border-white/[0.06] text-[#4B5568] hover:text-[#8B95A7]'}`}>
              Expense
            </button>
            <button type="button" onClick={() => { setType(TransactionType.INCOME); setCategory(''); }}
              className={`py-3 rounded-xl text-sm font-bold border transition-all ${type === TransactionType.INCOME ? 'bg-[#00D68F]/10 border-[#00D68F]/40 text-[#00D68F]' : 'border-white/[0.06] text-[#4B5568] hover:text-[#8B95A7]'}`}>
              Income
            </button>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-[#4B5568] uppercase tracking-wider mb-1.5 block">Description</label>
            <div className="relative">
              <TextAa className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B5568]" />
              <input type="text" placeholder="e.g. Weekly Groceries" value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#252A3A] border border-white/[0.06] text-white placeholder-[#4B5568] outline-none focus:ring-2 focus:ring-[#7C3AED]/50 transition-all text-sm"
                autoFocus />
            </div>
          </div>

          {/* Amount & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#4B5568] uppercase tracking-wider mb-1.5 block">Amount (USD)</label>
              <div className="relative">
                <CurrencyDollar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B5568]" />
                <input type="number" step="0.01" min="0" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#252A3A] border border-white/[0.06] text-white outline-none focus:ring-2 focus:ring-[#7C3AED]/50 transition-all text-sm" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-[#4B5568] uppercase tracking-wider mb-1.5 block">Date</label>
              <div className="relative">
                <CalendarBlank className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B5568]" />
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#252A3A] border border-white/[0.06] text-white outline-none focus:ring-2 focus:ring-[#7C3AED]/50 transition-all text-sm" />
              </div>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-bold text-[#4B5568] uppercase tracking-wider mb-1.5 block">Category</label>
            <div className="relative">
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B5568]" />
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#252A3A] border border-white/[0.06] text-white outline-none focus:ring-2 focus:ring-[#7C3AED]/50 transition-all text-sm appearance-none">
                <option value="" disabled>Select category</option>
                {filteredCategories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="w-full py-4 bg-gradient-to-r from-[#6C5CE7] to-[#A855F7] hover:from-[#7C3AED] hover:to-[#B070FA] text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-500/20 transition-all duration-300 active:scale-[0.97]">
            Save Transaction
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
