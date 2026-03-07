
import React, { useState, useMemo } from 'react';
import { RecurringTransaction, RecurringFrequency, TransactionType } from '../types';
import { CalendarBlank, Clock, Lightning, ArrowsClockwise, Pause, Play, Plus, Trash, CurrencyDollar, CaretDown } from 'phosphor-react';

interface GoalsProps {
    recurring: RecurringTransaction[];
    goals: Goal[];
    categories: { name: string; type: TransactionType }[];
    onAddRecurring: (r: Omit<RecurringTransaction, 'id' | 'isActive'>) => void;
    onDeleteRecurring: (id: string) => void;
    onToggleRecurring: (id: string) => void;
    onAddGoal: (g: { name: string; targetAmount: number; deadline?: string; color: string; icon: string }) => void;
    onContributeGoal: (id: string, amount: number) => void;
    onDeleteGoal: (id: string) => void;
}

interface Goal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline: string | null;
    color: string;
    icon: string;
}

const FREQUENCY_LABELS: Record<string, string> = {
    weekly: 'Weekly',
    monthly: 'Monthly',
    yearly: 'Yearly',
};

const Goals: React.FC<GoalsProps> = ({
    recurring, goals, categories,
    onAddRecurring, onDeleteRecurring, onToggleRecurring,
    onAddGoal, onContributeGoal, onDeleteGoal,
}) => {
    const [activeTab, setActiveTab] = useState<'bills' | 'goals'>('bills');
    const [showAddBill, setShowAddBill] = useState(false);
    const [showAddGoal, setShowAddGoal] = useState(false);
    const [contributeId, setContributeId] = useState<string | null>(null);
    const [contributeAmount, setContributeAmount] = useState('');

    // Bill form state
    const [billTitle, setBillTitle] = useState('');
    const [billAmount, setBillAmount] = useState('');
    const [billCategory, setBillCategory] = useState('');
    const [billFrequency, setBillFrequency] = useState<RecurringFrequency>(RecurringFrequency.MONTHLY);
    const [billNextDate, setBillNextDate] = useState('');
    const [billType, setBillType] = useState<TransactionType>(TransactionType.EXPENSE);

    // Goal form state
    const [goalName, setGoalName] = useState('');
    const [goalTarget, setGoalTarget] = useState('');
    const [goalDeadline, setGoalDeadline] = useState('');
    const [goalColor, setGoalColor] = useState('#7C3AED');

    const monthlyTotal = useMemo(() => {
        return recurring.filter(r => r.isActive && r.type === TransactionType.EXPENSE).reduce((sum, r) => {
            if (r.frequency === RecurringFrequency.WEEKLY) return sum + r.amount * 4.33;
            if (r.frequency === RecurringFrequency.YEARLY) return sum + r.amount / 12;
            return sum + r.amount;
        }, 0);
    }, [recurring]);

    const upcomingBills = useMemo(() => {
        const now = new Date();
        const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        return recurring
            .filter(r => r.isActive && new Date(r.nextDate) <= thirtyDays)
            .sort((a, b) => new Date(a.nextDate).getTime() - new Date(b.nextDate).getTime());
    }, [recurring]);

    const handleAddBill = () => {
        if (!billTitle || !billAmount || !billCategory || !billNextDate) return;
        onAddRecurring({
            title: billTitle,
            amount: parseFloat(billAmount),
            type: billType,
            category: billCategory,
            frequency: billFrequency,
            nextDate: billNextDate,
        });
        setBillTitle(''); setBillAmount(''); setBillCategory(''); setBillNextDate('');
        setShowAddBill(false);
    };

    const handleAddGoal = () => {
        if (!goalName || !goalTarget) return;
        onAddGoal({
            name: goalName,
            targetAmount: parseFloat(goalTarget),
            deadline: goalDeadline || undefined,
            color: goalColor,
            icon: 'Target',
        });
        setGoalName(''); setGoalTarget(''); setGoalDeadline(''); setGoalColor('#7C3AED');
        setShowAddGoal(false);
    };

    const handleContribute = (id: string) => {
        const amount = parseFloat(contributeAmount);
        if (isNaN(amount) || amount <= 0) return;
        onContributeGoal(id, amount);
        setContributeId(null);
        setContributeAmount('');
    };

    const getDaysUntil = (dateStr: string) => {
        const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        if (diff === 0) return 'Today';
        if (diff === 1) return 'Tomorrow';
        if (diff < 0) return `${Math.abs(diff)}d overdue`;
        return `${diff} days`;
    };

    const filteredCategories = categories.filter(c => c.type === billType);

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-extrabold text-white tracking-tight">Goals & Bills</h2>
                    <p className="text-[#8B95A7] text-sm mt-1">Track recurring expenses and savings goals</p>
                </div>
                <button
                    onClick={() => activeTab === 'bills' ? setShowAddBill(true) : setShowAddGoal(true)}
                    className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #6C5CE7 0%, #A855F7 100%)' }}
                >
                    <Plus weight="bold" className="w-4 h-4" />
                    <span>{activeTab === 'bills' ? 'New Bill' : 'New Goal'}</span>
                </button>
            </div>

            {/* Tab Selector */}
            <div className="flex bg-[#252A3A] rounded-xl p-1 w-fit">
                <button
                    onClick={() => setActiveTab('bills')}
                    className={`px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'bills' ? 'bg-[#7C3AED] text-white shadow-lg' : 'text-[#4B5568] hover:text-[#8B95A7]'}`}
                >
                    Recurring Bills
                </button>
                <button
                    onClick={() => setActiveTab('goals')}
                    className={`px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'goals' ? 'bg-[#7C3AED] text-white shadow-lg' : 'text-[#4B5568] hover:text-[#8B95A7]'}`}
                >
                    Savings Goals
                </button>
            </div>

            {activeTab === 'bills' && (
                <div className="space-y-5">
                    {/* Monthly Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="glass-card p-5">
                            <p className="text-[10px] font-bold text-[#8B95A7] uppercase tracking-widest mb-2">Monthly Recurring Cost</p>
                            <h3 className="text-2xl font-extrabold text-[#FF6B6B]">
                                ${monthlyTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </h3>
                        </div>
                        <div className="glass-card p-5">
                            <p className="text-[10px] font-bold text-[#8B95A7] uppercase tracking-widest mb-2">Active Subscriptions</p>
                            <h3 className="text-2xl font-extrabold text-white">{recurring.filter(r => r.isActive).length}</h3>
                        </div>
                        <div className="glass-card p-5">
                            <p className="text-[10px] font-bold text-[#8B95A7] uppercase tracking-widest mb-2">Due in 30 Days</p>
                            <h3 className="text-2xl font-extrabold text-[#FBBF24]">{upcomingBills.length}</h3>
                        </div>
                    </div>

                    {/* Recurring List */}
                    <div className="glass-card overflow-hidden">
                        <div className="px-5 py-4 border-b border-white/[0.06]">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider">All Recurring</h3>
                        </div>
                        <div className="divide-y divide-white/[0.04]">
                            {recurring.map(r => (
                                <div key={r.id} className={`px-5 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-all ${!r.isActive ? 'opacity-40' : ''}`}>
                                    <div className="flex items-center space-x-4">
                                        <div className={`p-2.5 rounded-xl ${r.type === TransactionType.INCOME ? 'bg-[#00D68F]/10' : 'bg-[#FF6B6B]/10'}`}>
                                            <ArrowsClockwise weight="bold" className={`w-4 h-4 ${r.type === TransactionType.INCOME ? 'text-[#00D68F]' : 'text-[#FF6B6B]'}`} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-white text-sm">{r.title}</p>
                                            <p className="text-xs text-[#4B5568]">{r.category} • {FREQUENCY_LABELS[r.frequency]}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="text-right">
                                            <p className={`font-bold text-sm ${r.type === TransactionType.INCOME ? 'text-[#00D68F]' : 'text-white'}`}>
                                                {r.type === TransactionType.INCOME ? '+' : '-'}${r.amount.toFixed(2)}
                                            </p>
                                            <p className="text-[10px] text-[#4B5568] font-medium">
                                                <CalendarBlank weight="bold" className="inline w-3 h-3 mr-1" />
                                                {getDaysUntil(r.nextDate)}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <button onClick={() => onToggleRecurring(r.id)} className="p-2 rounded-lg hover:bg-white/[0.06] transition-all text-[#8B95A7] hover:text-white">
                                                {r.isActive ? <Pause weight="bold" className="w-4 h-4" /> : <Play weight="bold" className="w-4 h-4" />}
                                            </button>
                                            <button onClick={() => onDeleteRecurring(r.id)} className="p-2 rounded-lg hover:bg-[#FF6B6B]/10 transition-all text-[#8B95A7] hover:text-[#FF6B6B]">
                                                <Trash weight="bold" className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {recurring.length === 0 && (
                                <div className="text-center py-12 px-4">
                                    <ArrowsClockwise weight="fill" className="w-12 h-12 text-[#7C3AED]/20 mx-auto mb-3" />
                                    <p className="text-[#8B95A7] text-sm">No recurring transactions yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'goals' && (
                <div className="space-y-5">
                    {/* Goal Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {goals.map(g => {
                            const progress = Math.min((g.currentAmount / g.targetAmount) * 100, 100);
                            const remaining = g.targetAmount - g.currentAmount;

                            return (
                                <div key={g.id} className="glass-card p-5 space-y-4 hover:border-white/10 transition-all">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${g.color}20` }}>
                                                <Lightning weight="fill" className="w-5 h-5" style={{ color: g.color }} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white text-sm">{g.name}</h4>
                                                {g.deadline && (
                                                    <p className="text-[10px] text-[#4B5568] font-medium">
                                                        <Clock weight="bold" className="inline w-3 h-3 mr-1" />
                                                        {getDaysUntil(g.deadline)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <button onClick={() => onDeleteGoal(g.id)} className="p-1.5 rounded-lg hover:bg-[#FF6B6B]/10 text-[#4B5568] hover:text-[#FF6B6B] transition-all">
                                            <Trash weight="bold" className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                    {/* Progress Ring — horizontal bar */}
                                    <div>
                                        <div className="flex justify-between text-xs mb-1.5">
                                            <span className="text-[#8B95A7] font-medium">${g.currentAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                            <span className="text-[#4B5568] font-bold">${g.targetAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                        </div>
                                        <div className="w-full bg-white/[0.06] h-2.5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-700"
                                                style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${g.color}, ${g.color}CC)` }}
                                            />
                                        </div>
                                        <div className="flex justify-between mt-1.5">
                                            <span className="text-[10px] font-bold text-[#4B5568]">{progress.toFixed(0)}% saved</span>
                                            <span className="text-[10px] font-medium text-[#8B95A7]">${remaining.toLocaleString(undefined, { minimumFractionDigits: 2 })} left</span>
                                        </div>
                                    </div>

                                    {/* Contribute */}
                                    {contributeId === g.id ? (
                                        <div className="flex space-x-2">
                                            <input
                                                type="number"
                                                value={contributeAmount}
                                                onChange={e => setContributeAmount(e.target.value)}
                                                placeholder="Amount"
                                                className="flex-1 px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm placeholder-[#4B5568] focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
                                            />
                                            <button onClick={() => handleContribute(g.id)} className="px-3 py-2 rounded-lg text-xs font-bold text-white" style={{ background: g.color }}>
                                                Save
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => { setContributeId(g.id); setContributeAmount(''); }}
                                            className="w-full py-2.5 rounded-xl border border-dashed border-white/[0.08] text-[#8B95A7] hover:border-[#7C3AED]/50 hover:text-[#A855F7] transition-all text-xs font-semibold"
                                        >
                                            + Add Contribution
                                        </button>
                                    )}
                                </div>
                            );
                        })}

                        {goals.length === 0 && (
                            <div className="col-span-full text-center py-12">
                                <Lightning weight="fill" className="w-12 h-12 text-[#7C3AED]/20 mx-auto mb-3" />
                                <p className="text-[#8B95A7] text-sm">No savings goals yet. Create your first one!</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ─── Add Bill Modal ─── */}
            {showAddBill && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowAddBill(false)}>
                    <div className="w-full max-w-md bg-[#1C2033] border border-white/[0.06] rounded-2xl p-6 space-y-4 animate-fade-in-up" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-white">Add Recurring Bill</h3>
                        <div className="flex space-x-2 mb-2">
                            <button onClick={() => setBillType(TransactionType.EXPENSE)} className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${billType === TransactionType.EXPENSE ? 'bg-[#FF6B6B]/20 text-[#FF6B6B]' : 'bg-white/[0.04] text-[#4B5568]'}`}>Expense</button>
                            <button onClick={() => setBillType(TransactionType.INCOME)} className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${billType === TransactionType.INCOME ? 'bg-[#00D68F]/20 text-[#00D68F]' : 'bg-white/[0.04] text-[#4B5568]'}`}>Income</button>
                        </div>
                        <input value={billTitle} onChange={e => setBillTitle(e.target.value)} placeholder="Title (e.g. Netflix)" className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder-[#4B5568] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]" />
                        <input type="number" value={billAmount} onChange={e => setBillAmount(e.target.value)} placeholder="Amount ($)" className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder-[#4B5568] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]" />
                        <select value={billCategory} onChange={e => setBillCategory(e.target.value)} className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] appearance-none">
                            <option value="">Select Category</option>
                            {filteredCategories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                        </select>
                        <select value={billFrequency} onChange={e => setBillFrequency(e.target.value as RecurringFrequency)} className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] appearance-none">
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                        <input type="date" value={billNextDate} onChange={e => setBillNextDate(e.target.value)} className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]" />
                        <div className="flex space-x-3 pt-2">
                            <button onClick={() => setShowAddBill(false)} className="flex-1 py-3 rounded-xl border border-white/[0.08] text-[#8B95A7] text-sm font-semibold hover:bg-white/[0.04] transition-all">Cancel</button>
                            <button onClick={handleAddBill} className="flex-1 py-3 rounded-xl text-white text-sm font-bold transition-all hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg, #6C5CE7 0%, #A855F7 100%)' }}>Add Bill</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Add Goal Modal ─── */}
            {showAddGoal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowAddGoal(false)}>
                    <div className="w-full max-w-md bg-[#1C2033] border border-white/[0.06] rounded-2xl p-6 space-y-4 animate-fade-in-up" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-white">New Savings Goal</h3>
                        <input value={goalName} onChange={e => setGoalName(e.target.value)} placeholder="Goal Name (e.g. Emergency Fund)" className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder-[#4B5568] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]" />
                        <input type="number" value={goalTarget} onChange={e => setGoalTarget(e.target.value)} placeholder="Target Amount ($)" className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder-[#4B5568] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]" />
                        <input type="date" value={goalDeadline} onChange={e => setGoalDeadline(e.target.value)} placeholder="Deadline (optional)" className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]" />
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#8B95A7] uppercase tracking-wider">Color</label>
                            <div className="flex space-x-2">
                                {['#7C3AED', '#00D68F', '#3B82F6', '#FF6B6B', '#FBBF24', '#EC4899'].map(c => (
                                    <button key={c} onClick={() => setGoalColor(c)} className={`w-8 h-8 rounded-full transition-all ${goalColor === c ? 'ring-2 ring-white ring-offset-2 ring-offset-[#1C2033] scale-110' : 'hover:scale-105'}`} style={{ background: c }} />
                                ))}
                            </div>
                        </div>
                        <div className="flex space-x-3 pt-2">
                            <button onClick={() => setShowAddGoal(false)} className="flex-1 py-3 rounded-xl border border-white/[0.08] text-[#8B95A7] text-sm font-semibold hover:bg-white/[0.04] transition-all">Cancel</button>
                            <button onClick={handleAddGoal} className="flex-1 py-3 rounded-xl text-white text-sm font-bold transition-all hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg, #6C5CE7 0%, #A855F7 100%)' }}>Create Goal</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Goals;
