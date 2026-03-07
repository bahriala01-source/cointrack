
import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType } from '../types';
import { MagnifyingGlass, Funnel, ArrowUp, ArrowDown, DotsThreeVertical, Trash, CaretLeft, CaretRight } from 'phosphor-react';

interface TransactionsProps {
  transactions: Transaction[];
  onDeleteTransaction?: (id: string) => void;
}

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50];

const Transactions: React.FC<TransactionsProps> = ({ transactions, onDeleteTransaction }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filter === 'all' ? true : t.type === filter;
      return matchesSearch && matchesType;
    });
  }, [transactions, searchTerm, filter]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Simple color map for categories
  const categoryColors: Record<string, string> = {
    'Salary': '#00D68F', 'Freelance': '#34d399', 'Groceries': '#FBBF24',
    'Rent': '#FF6B6B', 'Utilities': '#F97316', 'Entertainment': '#A855F7',
    'Transport': '#3B82F6', 'Dining': '#EC4899', 'Health': '#14B8A6',
    'Investment': '#6366F1',
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Transactions</h2>
          <p className="text-[#8B95A7] text-sm">History of your income and expenses</p>
        </div>

        <div className="flex space-x-3">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlass className="h-4 w-4 text-[#4B5568] group-focus-within:text-[#A78BFA] transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="pl-10 pr-4 py-2.5 bg-[#1C2033] border border-white/[0.06] rounded-xl text-sm text-white placeholder-[#4B5568] focus:ring-2 focus:ring-[#7C3AED]/50 focus:border-[#7C3AED]/50 outline-none transition-all w-full md:w-64"
            />
          </div>
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }}
              className="appearance-none bg-[#1C2033] border border-white/[0.06] text-white text-sm rounded-xl focus:ring-2 focus:ring-[#7C3AED]/50 block w-full p-2.5 pl-10 pr-8"
            >
              <option value="all">All</option>
              <option value={TransactionType.INCOME}>Income</option>
              <option value={TransactionType.EXPENSE}>Expense</option>
            </select>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Funnel className="h-4 w-4 text-[#4B5568]" />
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/[0.02] border-b border-white/[0.06]">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-[#4B5568] uppercase tracking-widest">Transaction</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#4B5568] uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#4B5568] uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#4B5568] uppercase tracking-widest text-right">Amount</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#4B5568] uppercase tracking-widest text-center">Status</th>
                <th className="px-4 py-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {paginatedTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-white/[0.02] transition-all group">
                  <td className="px-6 py-4 text-sm font-medium text-white">{t.title}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                      style={{
                        background: `${categoryColors[t.category] || '#7C3AED'}15`,
                        color: categoryColors[t.category] || '#A78BFA'
                      }}
                    >
                      {t.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#8B95A7]">{formatDate(t.date)}</td>
                  <td className={`px-6 py-4 text-sm font-bold text-right ${t.type === TransactionType.INCOME ? 'text-[#00D68F]' : 'text-white'}`}>
                    {t.type === TransactionType.INCOME ? '+' : '-'}${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${t.type === TransactionType.INCOME
                        ? 'bg-[#00D68F]/10 text-[#00D68F]'
                        : 'bg-[#FF6B6B]/10 text-[#FF6B6B]'
                      }`}>
                      {t.type === TransactionType.INCOME ? 'Income' : 'Expense'}
                    </span>
                  </td>
                  <td className="px-4 py-4 relative">
                    {onDeleteTransaction && (
                      <>
                        <button
                          onClick={() => setOpenMenuId(openMenuId === t.id ? null : t.id)}
                          className="p-1.5 rounded-lg text-[#4B5568] hover:text-white hover:bg-white/[0.05] opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <DotsThreeVertical weight="bold" className="w-4 h-4" />
                        </button>
                        {openMenuId === t.id && (
                          <div className="absolute right-4 top-12 z-20 bg-[#252A3A] border border-white/[0.08] rounded-xl shadow-2xl p-1 min-w-[120px] animate-scale-in">
                            <button
                              onClick={() => { onDeleteTransaction(t.id); setOpenMenuId(null); }}
                              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-[#FF6B6B] hover:bg-[#FF6B6B]/10 rounded-lg transition-colors"
                            >
                              <Trash className="w-4 h-4" />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-white/[0.04]">
          {paginatedTransactions.map((t) => (
            <div key={t.id} className="p-4 flex flex-col space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-white text-sm">{t.title}</p>
                  <p className="text-xs text-[#4B5568] mt-0.5">{formatDate(t.date)}</p>
                </div>
                <span className={`font-bold text-sm ${t.type === TransactionType.INCOME ? 'text-[#00D68F]' : 'text-white'}`}>
                  {t.type === TransactionType.INCOME ? '+' : '-'}${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span
                  className="px-2 py-1 rounded-lg text-xs font-semibold"
                  style={{
                    background: `${categoryColors[t.category] || '#7C3AED'}15`,
                    color: categoryColors[t.category] || '#A78BFA'
                  }}
                >
                  {t.category}
                </span>
                {t.type === TransactionType.INCOME ?
                  <ArrowUp className="w-4 h-4 text-[#00D68F]" weight="bold" /> :
                  <ArrowDown className="w-4 h-4 text-[#FF6B6B]" weight="bold" />
                }
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-[#4B5568]">Rows per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="bg-[#252A3A] border border-white/[0.06] text-white text-xs rounded-lg px-2 py-1 outline-none"
              >
                {ITEMS_PER_PAGE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-[#8B95A7]">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg bg-[#252A3A] text-[#8B95A7] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <CaretLeft weight="bold" className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg bg-[#252A3A] text-[#8B95A7] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <CaretRight weight="bold" className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {filteredTransactions.length === 0 && (
        <div className="text-center py-16">
          <p className="text-[#8B95A7] text-sm font-medium">No transactions found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Transactions;
