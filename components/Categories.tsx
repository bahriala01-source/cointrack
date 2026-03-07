
import React, { useState, useMemo } from 'react';
import { CategoryConfig, CategoryBudgets, Transaction, TransactionType } from '../types';
import { Tag, Plus, PencilSimple, X, WarningCircle, TrendUp, Money, ShoppingCart, House, Lightning, FilmStrip, Car, ForkKnife, Heartbeat, ChartLineUp } from 'phosphor-react';

interface CategoriesProps {
    categories: CategoryConfig[];
    budgets: CategoryBudgets;
    transactions: Transaction[];
    onAddCategory: (cat: CategoryConfig) => void;
    onUpdateBudget: (categoryName: string, amount: number) => void;
}

const categoryIcons: Record<string, any> = {
    'Salary': TrendUp, 'Freelance': Lightning, 'Groceries': ShoppingCart,
    'Rent': House, 'Utilities': Lightning, 'Entertainment': FilmStrip,
    'Transport': Car, 'Dining': ForkKnife, 'Health': Heartbeat,
    'Investment': ChartLineUp,
};

const Categories: React.FC<CategoriesProps> = ({ categories, budgets, transactions, onAddCategory, onUpdateBudget }) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<string | null>(null);
    const [newCatName, setNewCatName] = useState('');
    const [newCatColor, setNewCatColor] = useState('#7C3AED');
    const [newCatType, setNewCatType] = useState<TransactionType>(TransactionType.EXPENSE);
    const [budgetInput, setBudgetInput] = useState('');

    const categorySpecificTotals = useMemo(() => {
        return transactions.reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {} as Record<string, number>);
    }, [transactions]);

    const handleAddCategory = (e: React.FormEvent) => {
        e.preventDefault();
        if (newCatName.trim()) {
            onAddCategory({ name: newCatName.trim(), color: newCatColor, type: newCatType });
            setNewCatName('');
            setIsAddModalOpen(false);
        }
    };

    const handleSetBudget = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCategory && budgetInput !== '') {
            onUpdateBudget(editingCategory, parseFloat(budgetInput));
            setEditingCategory(null);
            setBudgetInput('');
        }
    };

    const presetColors = ['#00D68F', '#34d399', '#FBBF24', '#FF6B6B', '#F97316', '#A855F7', '#7C3AED', '#EC4899', '#14B8A6', '#6366F1', '#4B5568'];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Categories</h2>
                    <p className="text-[#8B95A7] text-sm">Track your earnings and manage spending limits</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-[#6C5CE7] to-[#A855F7] hover:from-[#7C3AED] hover:to-[#B070FA] text-white px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-purple-500/20 font-medium text-sm active:scale-[0.97]"
                >
                    <Plus weight="bold" className="w-4 h-4" />
                    <span>New Category</span>
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {categories.map((cat) => {
                    const isExpense = cat.type === TransactionType.EXPENSE;
                    const budget = budgets[cat.name] || 0;
                    const actual = categorySpecificTotals[cat.name] || 0;
                    const IconComp = categoryIcons[cat.name] || Tag;

                    if (isExpense) {
                        const percentage = budget > 0 ? (actual / budget) * 100 : 0;
                        const isOver = actual > budget && budget > 0;

                        return (
                            <div
                                key={cat.name}
                                className={`glass-card p-5 flex flex-col space-y-4 group animate-fade-in-up ${isOver ? 'border-[#FF6B6B]/30' : ''}`}
                            >
                                <button
                                    onClick={() => { setEditingCategory(cat.name); setBudgetInput(budget?.toString() || ''); }}
                                    className="absolute top-3 right-3 p-2 bg-white/[0.04] rounded-lg opacity-0 group-hover:opacity-100 transition-all text-[#4B5568] hover:text-[#A78BFA]"
                                >
                                    <PencilSimple className="w-3.5 h-3.5" />
                                </button>

                                <div className="flex items-center space-x-3">
                                    <div className="p-2.5 rounded-xl" style={{ backgroundColor: `${cat.color}15` }}>
                                        <IconComp weight="fill" className="w-5 h-5" style={{ color: cat.color }} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-sm leading-tight">{cat.name}</h3>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-[#FF6B6B]">Expense</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-end">
                                    <div className="text-xs">
                                        <p className="text-[#4B5568]">Budget</p>
                                        <p className="font-bold text-white text-sm">${budget.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                    </div>
                                    <div className="text-xs text-right">
                                        <p className="text-[#4B5568]">Spent</p>
                                        <p className={`font-bold text-sm ${isOver ? 'text-[#FF6B6B]' : 'text-white'}`}>
                                            ${actual.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                </div>

                                {budget > 0 ? (
                                    <div className="space-y-1.5">
                                        <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-700 ${isOver ? 'bg-[#FF6B6B]' : 'bg-gradient-to-r from-[#6C5CE7] to-[#A855F7]'}`}
                                                style={{ width: `${Math.min(percentage, 100)}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between items-center text-[9px] font-bold tracking-wider">
                                            <span className={isOver ? 'text-[#FF6B6B]' : 'text-[#4B5568]'}>
                                                {isOver ? '⚠ Over' : `${percentage.toFixed(0)}% used`}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => { setEditingCategory(cat.name); setBudgetInput(''); }}
                                        className="w-full py-2 border border-dashed border-white/[0.08] text-[#4B5568] text-xs font-semibold rounded-xl hover:text-[#A78BFA] hover:border-[#7C3AED]/30 transition-all"
                                    >
                                        + Set Monthly Limit
                                    </button>
                                )}
                            </div>
                        );
                    } else {
                        return (
                            <div
                                key={cat.name}
                                className="relative overflow-hidden rounded-[20px] p-5 flex flex-col space-y-4 group animate-fade-in-up border border-[#00D68F]/20"
                                style={{ background: 'linear-gradient(135deg, rgba(0,214,143,0.05) 0%, #1C2033 100%)' }}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="p-2.5 rounded-xl" style={{ backgroundColor: `${cat.color}15` }}>
                                        <IconComp weight="fill" className="w-5 h-5" style={{ color: cat.color }} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-sm leading-tight">{cat.name}</h3>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-[#00D68F]">Income</span>
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <p className="text-[10px] text-[#4B5568] uppercase font-bold tracking-wider">Total Received</p>
                                    <p className="text-xl font-extrabold text-[#00D68F]">
                                        +${actual.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </p>
                                </div>

                                <div className="flex items-center text-[9px] text-[#4B5568] font-bold uppercase tracking-widest">
                                    <Money className="mr-1 w-3 h-3" /> Direct Deposit
                                </div>
                            </div>
                        );
                    }
                })}
            </div>

            {/* Add Category Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#1C2033] border border-white/[0.08] rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-slide-up">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-lg font-bold text-white">New Category</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-[#4B5568] hover:text-white transition-colors"><X weight="bold" className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleAddCategory} className="space-y-4">
                            <div className="grid grid-cols-2 gap-2">
                                <button type="button" onClick={() => setNewCatType(TransactionType.EXPENSE)}
                                    className={`py-2.5 rounded-xl text-sm font-bold border transition-all ${newCatType === TransactionType.EXPENSE ? 'bg-[#FF6B6B]/10 border-[#FF6B6B]/40 text-[#FF6B6B]' : 'border-white/[0.06] text-[#4B5568]'}`}>
                                    Expense
                                </button>
                                <button type="button" onClick={() => setNewCatType(TransactionType.INCOME)}
                                    className={`py-2.5 rounded-xl text-sm font-bold border transition-all ${newCatType === TransactionType.INCOME ? 'bg-[#00D68F]/10 border-[#00D68F]/40 text-[#00D68F]' : 'border-white/[0.06] text-[#4B5568]'}`}>
                                    Income
                                </button>
                            </div>
                            <input type="text" value={newCatName} onChange={(e) => setNewCatName(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-[#252A3A] border border-white/[0.06] outline-none text-white placeholder-[#4B5568] focus:ring-2 focus:ring-[#7C3AED]/50 transition-all"
                                placeholder="Category Name" autoFocus />
                            <div className="flex flex-wrap gap-2">
                                {presetColors.map(color => (
                                    <button key={color} type="button" onClick={() => setNewCatColor(color)}
                                        className={`w-8 h-8 rounded-full border-2 transition-all ${newCatColor === color ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:scale-105'}`}
                                        style={{ backgroundColor: color }} />
                                ))}
                            </div>
                            <button type="submit" className="w-full py-3 bg-gradient-to-r from-[#6C5CE7] to-[#A855F7] text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 transition-all active:scale-[0.97]">Create Category</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Set Budget Modal */}
            {editingCategory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#1C2033] border border-white/[0.08] rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-slide-up">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-lg font-bold text-white">Budget: {editingCategory}</h3>
                            <button onClick={() => setEditingCategory(null)} className="text-[#4B5568] hover:text-white transition-colors"><X weight="bold" className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleSetBudget} className="space-y-4">
                            <div className="relative">
                                <span className="absolute left-4 top-3 text-[#4B5568] font-bold text-lg">$</span>
                                <input type="number" step="0.01" value={budgetInput} onChange={(e) => setBudgetInput(e.target.value)}
                                    className="w-full pl-8 pr-4 py-3 rounded-xl bg-[#252A3A] border border-white/[0.06] text-white text-lg font-bold outline-none focus:ring-2 focus:ring-[#7C3AED]/50 transition-all"
                                    placeholder="0.00" autoFocus />
                            </div>
                            <p className="text-xs text-[#4B5568] italic">Set a monthly spending cap to track your budget progress.</p>
                            <button type="submit" className="w-full py-3 bg-gradient-to-r from-[#6C5CE7] to-[#A855F7] text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 transition-all active:scale-[0.97]">Update Budget</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Categories;
