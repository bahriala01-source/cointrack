
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Transaction, TransactionType, CategoryConfig, CategoryBudgets } from '../types';
import { ArrowUpRight, ArrowDownRight, Wallet, Receipt, ChartBar, Lightning, TrendUp } from 'phosphor-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface DashboardProps {
  transactions: Transaction[];
  onViewAll: () => void;
  categories: CategoryConfig[];
  budgets: CategoryBudgets;
}

// Animated counter hook
function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const ref = useRef<number>();
  useEffect(() => {
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) ref.current = requestAnimationFrame(animate);
    };
    ref.current = requestAnimationFrame(animate);
    return () => { if (ref.current) cancelAnimationFrame(ref.current); };
  }, [target, duration]);
  return value;
}

// Category color map
const CATEGORY_COLORS: Record<string, string> = {
  'Salary': '#00D68F', 'Freelance': '#34d399', 'Groceries': '#FBBF24',
  'Rent': '#FF6B6B', 'Utilities': '#F97316', 'Entertainment': '#A855F7',
  'Transport': '#3B82F6', 'Dining': '#EC4899', 'Health': '#14B8A6',
  'Investment': '#6366F1',
};

const Dashboard: React.FC<DashboardProps> = ({ transactions, onViewAll, categories, budgets }) => {
  const [chartTab, setChartTab] = useState<'categories' | 'monthly'>('categories');

  const transactionStats = useMemo(() => {
    return transactions.reduce((acc, t) => {
      if (t.type === TransactionType.INCOME) {
        acc.income += t.amount;
        acc.incomeCount += 1;
      } else {
        acc.expense += t.amount;
        acc.expenseCount += 1;
      }
      return acc;
    }, { income: 0, expense: 0, incomeCount: 0, expenseCount: 0 });
  }, [transactions]);

  const actualBalance = transactionStats.income - transactionStats.expense;
  const totalIncome = transactionStats.income;
  const totalExpense = transactionStats.expense;

  const animBalance = useCountUp(actualBalance);
  const animIncome = useCountUp(totalIncome);
  const animExpense = useCountUp(totalExpense);

  const actualsByCategory = useMemo(() => {
    return transactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);
  }, [transactions]);

  // Category breakdown chart data
  const categoryChartData = useMemo(() => {
    const byCategory: Record<string, { amount: number; type: string }> = {};
    transactions.forEach(t => {
      if (!byCategory[t.category]) byCategory[t.category] = { amount: 0, type: t.type };
      byCategory[t.category].amount += t.amount;
    });
    return Object.entries(byCategory)
      .map(([name, data]) => ({
        name,
        amount: data.amount,
        color: CATEGORY_COLORS[name] || '#7C3AED',
        type: data.type,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  // Monthly income vs expense data
  const monthlyChartData = useMemo(() => {
    const monthMap: Record<string, { income: number; expense: number }> = {};
    transactions.forEach(t => {
      const key = t.date.substring(0, 7);
      if (!monthMap[key]) monthMap[key] = { income: 0, expense: 0 };
      if (t.type === TransactionType.INCOME) monthMap[key].income += t.amount;
      else monthMap[key].expense += t.amount;
    });
    return Object.entries(monthMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => {
        const [y, m] = month.split('-');
        const label = new Date(Number(y), Number(m) - 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        return { name: label, income: data.income, expense: data.expense };
      });
  }, [transactions]);

  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    return (
      <div className="bg-[#1C2033]/95 backdrop-blur-xl border border-white/10 rounded-xl p-3.5 shadow-2xl min-w-[160px]">
        <p className="text-xs font-bold text-white mb-2">{label}</p>
        {payload.map((entry: any, i: number) => (
          <div key={i} className="flex items-center justify-between text-sm mb-1 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: entry.fill || entry.color }} />
              <span className="text-[#8B95A7] capitalize text-xs">{entry.dataKey || entry.name}</span>
            </div>
            <span className="font-bold text-white text-xs">${entry.value?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* ─── Hero Balance + Stats Row ─── */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
        {/* Main Balance — spans 3 cols */}
        <div className="md:col-span-3 relative overflow-hidden rounded-2xl p-6 animate-fade-in-up" style={{ background: 'linear-gradient(135deg, #1a1040 0%, #2d1b69 50%, #1C2033 100%)' }}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#A855F7]/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#6C5CE7]/10 to-transparent rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm">
                <Wallet className="w-5 h-5 text-[#A78BFA]" weight="fill" />
              </div>
              <span className="text-xs font-bold text-[#A78BFA] uppercase tracking-widest">Total Balance</span>
            </div>
            <h3 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-none">
              ${animBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <p className="text-[#8B95A7] text-sm mt-2">Realized cash across all accounts</p>
          </div>
        </div>

        {/* Income */}
        <div className="glass-card p-5 flex flex-col justify-between animate-fade-in-up animation-delay-100">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl" style={{ background: 'rgba(0, 214, 143, 0.1)' }}>
              <ArrowUpRight className="w-5 h-5 text-[#00D68F]" weight="bold" />
            </div>
            <span className="text-[10px] font-bold text-[#8B95A7] uppercase tracking-widest">Income</span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-extrabold text-white tracking-tight">
              ${animIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <p className="text-[#00D68F] text-xs mt-1 font-medium">↑ {transactionStats.incomeCount} payments</p>
          </div>
        </div>

        {/* Expense */}
        <div className="glass-card p-5 flex flex-col justify-between animate-fade-in-up animation-delay-200">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl" style={{ background: 'rgba(255, 107, 107, 0.1)' }}>
              <ArrowDownRight className="w-5 h-5 text-[#FF6B6B]" weight="bold" />
            </div>
            <span className="text-[10px] font-bold text-[#8B95A7] uppercase tracking-widest">Spent</span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-extrabold text-white tracking-tight">
              ${animExpense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <p className="text-[#FF6B6B] text-xs mt-1 font-medium">↓ {transactionStats.expenseCount} transactions</p>
          </div>
        </div>
      </div>

      {/* ─── Chart + Sidebar ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {/* Chart */}
          <div className="glass-card p-6 overflow-hidden animate-fade-in-up animation-delay-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-bold text-white tracking-tight">Spending Overview</h3>
              <div className="flex bg-[#252A3A] rounded-lg p-0.5">
                <button
                  onClick={() => setChartTab('categories')}
                  className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${chartTab === 'categories' ? 'bg-[#7C3AED] text-white shadow-md' : 'text-[#4B5568] hover:text-[#8B95A7]'}`}
                >
                  By Category
                </button>
                <button
                  onClick={() => setChartTab('monthly')}
                  className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${chartTab === 'monthly' ? 'bg-[#7C3AED] text-white shadow-md' : 'text-[#4B5568] hover:text-[#8B95A7]'}`}
                >
                  Monthly
                </button>
              </div>
            </div>
            <div className="h-72 w-full">
              {chartTab === 'categories' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryChartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }} barCategoryGap="20%">
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: '#8B95A7', fontWeight: 600 }}
                      interval={0}
                      angle={-35}
                      textAnchor="end"
                      height={50}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: '#4B5568', fontWeight: 600 }}
                      tickFormatter={(val) => `$${val}`}
                    />
                    <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(124, 58, 237, 0.06)' }} />
                    <Bar dataKey="amount" radius={[6, 6, 0, 0]} animationDuration={1200}>
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.85} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyChartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: '#8B95A7', fontWeight: 600 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: '#4B5568', fontWeight: 600 }}
                      tickFormatter={(val) => `$${val}`}
                    />
                    <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(124, 58, 237, 0.06)' }} />
                    <Bar dataKey="income" name="Income" fill="#00D68F" radius={[6, 6, 0, 0]} fillOpacity={0.85} animationDuration={1200} />
                    <Bar dataKey="expense" name="Expense" fill="#FF6B6B" radius={[6, 6, 0, 0]} fillOpacity={0.85} animationDuration={1200} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
            {chartTab === 'categories' && (
              <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-white/[0.04]">
                {categoryChartData.slice(0, 8).map(cat => (
                  <div key={cat.name} className="flex items-center space-x-1.5">
                    <div className="w-2 h-2 rounded-sm" style={{ background: cat.color }} />
                    <span className="text-[10px] font-semibold text-[#8B95A7]">{cat.name}</span>
                  </div>
                ))}
              </div>
            )}
            {chartTab === 'monthly' && (
              <div className="flex gap-5 mt-4 pt-4 border-t border-white/[0.04]">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-sm bg-[#00D68F]" />
                  <span className="text-[10px] font-bold text-[#8B95A7] uppercase tracking-wider">Income</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-sm bg-[#FF6B6B]" />
                  <span className="text-[10px] font-bold text-[#8B95A7] uppercase tracking-wider">Expense</span>
                </div>
              </div>
            )}
          </div>

          {/* Recent Transactions */}
          <div className="glass-card overflow-hidden animate-fade-in-up animation-delay-300">
            <div className="p-5 flex justify-between items-center border-b border-white/[0.06]">
              <h3 className="text-base font-bold text-white tracking-tight">Recent Transactions</h3>
              <button
                onClick={onViewAll}
                className="text-xs font-semibold text-[#A78BFA] hover:text-[#C4B5FD] transition-colors uppercase tracking-wider"
              >
                View All →
              </button>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {transactions.slice(0, 5).map(t => (
                <div key={t.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-white/[0.02] transition-all group">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2.5 rounded-xl transition-transform group-hover:scale-105 ${t.type === TransactionType.INCOME
                        ? 'bg-[#00D68F]/10 text-[#00D68F]'
                        : 'bg-[#FF6B6B]/10 text-[#FF6B6B]'
                      }`}>
                      {t.type === TransactionType.INCOME ? <ArrowUpRight weight="bold" className="w-4 h-4" /> : <Receipt weight="bold" className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{t.title}</p>
                      <p className="text-xs text-[#4B5568]">{t.category} • {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    </div>
                  </div>
                  <span className={`font-bold text-sm ${t.type === TransactionType.INCOME ? 'text-[#00D68F]' : 'text-white'}`}>
                    {t.type === TransactionType.INCOME ? '+' : '-'}${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Spending Limits Panel */}
        <div className="space-y-5">
          <div className="glass-card p-6 h-full animate-fade-in-up animation-delay-300">
            <div className="flex items-center space-x-2 mb-6">
              <ChartBar className="w-5 h-5 text-[#A78BFA]" />
              <h3 className="text-base font-bold text-white tracking-tight">Spending Limits</h3>
            </div>
            <div className="space-y-5 overflow-y-auto max-h-[600px] pr-1">
              {categories.filter(c => c.type === TransactionType.EXPENSE && budgets[c.name] > 0).map(cat => {
                const actual = actualsByCategory[cat.name] || 0;
                const budget = budgets[cat.name];
                const percentage = Math.min((actual / budget) * 100, 100);
                const isOver = actual > budget;

                return (
                  <div key={cat.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-[#C4D0E0]">{cat.name}</span>
                      <span className={`font-bold ${isOver ? 'text-[#FF6B6B]' : 'text-white'}`}>
                        ${actual.toLocaleString(undefined, { minimumFractionDigits: 2 })} / ${budget.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="w-full bg-white/[0.06] h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${isOver ? 'bg-[#FF6B6B]' : 'bg-gradient-to-r from-[#6C5CE7] to-[#A855F7]'}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[9px] uppercase font-bold tracking-wider">
                      <span className={isOver ? 'text-[#FF6B6B]' : 'text-[#4B5568]'}>
                        {isOver ? '⚠ Over Limit' : 'On Track'}
                      </span>
                      <span className="text-[#4B5568]">{percentage.toFixed(0)}%</span>
                    </div>
                  </div>
                );
              })}
              {categories.filter(c => c.type === TransactionType.EXPENSE && budgets[c.name] > 0).length === 0 && (
                <div className="text-center py-12 px-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#7C3AED]/10 flex items-center justify-center">
                    <Lightning weight="fill" className="w-8 h-8 text-[#7C3AED]/40" />
                  </div>
                  <p className="text-[#8B95A7] text-sm font-medium mb-1">No budgets yet</p>
                  <p className="text-[#4B5568] text-xs">Set spending limits in Categories to track your goals here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
