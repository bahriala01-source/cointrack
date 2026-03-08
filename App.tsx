
import React, { useState, useEffect, useCallback } from 'react';
import { ViewState, Transaction, CategoryConfig, CategoryBudgets, RecurringTransaction } from './types';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Categories from './components/Categories';
import Settings from './components/Settings';
import Goals from './components/Goals';
import AddTransactionModal from './components/AddTransactionModal';
import LandingPage from './components/LandingPage';
import { ToastProvider } from './components/Toast';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string | null;
  color: string;
  icon: string;
}

const App: React.FC = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<CategoryConfig[]>([]);
  const [budgets, setBudgets] = useState<CategoryBudgets>({});
  const [recurring, setRecurring] = useState<RecurringTransaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // ─── Fetch data from backend ─────────────────────────────
  const fetchTransactions = useCallback(async () => {
    const res = await fetch(`${API_BASE}/transactions`);
    const data = await res.json();
    setTransactions(data);
  }, []);

  const fetchCategories = useCallback(async () => {
    const res = await fetch(`${API_BASE}/categories`);
    const data = await res.json();
    setCategories(data);
  }, []);

  const fetchBudgets = useCallback(async () => {
    const res = await fetch(`${API_BASE}/budgets`);
    const data = await res.json();
    setBudgets(data);
  }, []);

  const fetchRecurring = useCallback(async () => {
    const res = await fetch(`${API_BASE}/recurring`);
    const data = await res.json();
    setRecurring(data);
  }, []);

  const fetchGoals = useCallback(async () => {
    const res = await fetch(`${API_BASE}/goals`);
    const data = await res.json();
    setGoals(data);
  }, []);

  // Initial data load
  useEffect(() => {
    const loadAll = async () => {
      setIsLoading(true);
      try {
        await Promise.all([fetchTransactions(), fetchCategories(), fetchBudgets(), fetchRecurring(), fetchGoals()]);
      } catch (err) {
        console.error('Failed to load data from API:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadAll();
  }, [fetchTransactions, fetchCategories, fetchBudgets, fetchRecurring, fetchGoals]);

  // ─── Handlers ────────────────────────────────────────────
  const handleAddTransaction = async (newTx: Omit<Transaction, 'id'>) => {
    await fetch(`${API_BASE}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTx),
    });
    await fetchTransactions();
  };

  const handleDeleteTransaction = async (id: string) => {
    await fetch(`${API_BASE}/transactions/${id}`, { method: 'DELETE' });
    await fetchTransactions();
  };

  const handleAddCategory = async (newCat: CategoryConfig) => {
    await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCat),
    });
    await fetchCategories();
  };

  const handleUpdateBudget = async (categoryName: string, amount: number) => {
    await fetch(`${API_BASE}/budgets/${encodeURIComponent(categoryName)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    });
    await fetchBudgets();
  };

  // Recurring handlers
  const handleAddRecurring = async (r: Omit<RecurringTransaction, 'id' | 'isActive'>) => {
    await fetch(`${API_BASE}/recurring`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(r),
    });
    await fetchRecurring();
  };

  const handleDeleteRecurring = async (id: string) => {
    await fetch(`${API_BASE}/recurring/${id}`, { method: 'DELETE' });
    await fetchRecurring();
  };

  const handleToggleRecurring = async (id: string) => {
    await fetch(`${API_BASE}/recurring/${id}/toggle`, { method: 'PATCH' });
    await fetchRecurring();
  };

  // Goal handlers
  const handleAddGoal = async (g: { name: string; targetAmount: number; deadline?: string; color: string; icon: string }) => {
    await fetch(`${API_BASE}/goals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(g),
    });
    await fetchGoals();
  };

  const handleContributeGoal = async (id: string, amount: number) => {
    await fetch(`${API_BASE}/goals/${id}/contribute`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    });
    await fetchGoals();
  };

  const handleDeleteGoal = async (id: string) => {
    await fetch(`${API_BASE}/goals/${id}`, { method: 'DELETE' });
    await fetchGoals();
  };

  const renderView = () => {
    if (isLoading) {
      return (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
            <div className="md:col-span-3 skeleton skeleton-card h-44" />
            <div className="skeleton skeleton-card h-44" />
            <div className="skeleton skeleton-card h-44" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 skeleton skeleton-card h-80" />
            <div className="skeleton skeleton-card h-80" />
          </div>
        </div>
      );
    }

    switch (currentView) {
      case ViewState.DASHBOARD:
        return (
          <Dashboard
            transactions={transactions}
            onViewAll={() => setCurrentView(ViewState.TRANSACTIONS)}
            categories={categories}
            budgets={budgets}
          />
        );
      case ViewState.TRANSACTIONS:
        return (
          <Transactions
            transactions={transactions}
            onDeleteTransaction={handleDeleteTransaction}
          />
        );
      case ViewState.CATEGORIES:
        return (
          <Categories
            categories={categories}
            budgets={budgets}
            transactions={transactions}
            onAddCategory={handleAddCategory}
            onUpdateBudget={handleUpdateBudget}
          />
        );
      case ViewState.GOALS:
        return (
          <Goals
            recurring={recurring}
            goals={goals}
            categories={categories}
            onAddRecurring={handleAddRecurring}
            onDeleteRecurring={handleDeleteRecurring}
            onToggleRecurring={handleToggleRecurring}
            onAddGoal={handleAddGoal}
            onContributeGoal={handleContributeGoal}
            onDeleteGoal={handleDeleteGoal}
          />
        );
      case ViewState.SETTINGS:
        return <Settings isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;
      default:
        return <Dashboard transactions={transactions} onViewAll={() => setCurrentView(ViewState.TRANSACTIONS)} categories={categories} budgets={budgets} />;
    }
  };

  if (showLanding) {
    return <LandingPage onEnterApp={() => setShowLanding(false)} />;
  }

  return (
    <ToastProvider>
      <Layout
        currentView={currentView}
        onChangeView={setCurrentView}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      >
        {renderView()}
      </Layout>

      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddTransaction}
        categories={categories}
      />
    </ToastProvider>
  );
};

export default App;
