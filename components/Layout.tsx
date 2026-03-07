
import React, { useState } from 'react';
import { ViewState } from '../types';
import {
  SquaresFour,
  ListBullets,
  GridFour,
  Gear,
  Plus,
  TrendUp,
  CaretLeft,
  CaretRight,
  Target
} from 'phosphor-react';

interface LayoutProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  onOpenAddModal: () => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentView, onChangeView, onOpenAddModal, children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { id: ViewState.DASHBOARD, icon: SquaresFour, label: 'Dashboard' },
    { id: ViewState.CATEGORIES, icon: GridFour, label: 'Categories' },
    { id: ViewState.TRANSACTIONS, icon: ListBullets, label: 'Transactions' },
    { id: ViewState.GOALS, icon: Target, label: 'Goals' },
    { id: ViewState.SETTINGS, icon: Gear, label: 'Settings' },
  ];

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });

  return (
    <div className="flex h-screen w-full bg-[#0C0E14] overflow-hidden">

      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col h-full bg-[#111320] border-r border-white/[0.06] z-20 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
        {/* Logo */}
        <div className={`p-5 flex items-center border-b border-white/[0.06] ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
          <div className="bg-gradient-to-br from-[#6C5CE7] to-[#A855F7] p-2.5 rounded-xl shadow-lg shadow-purple-500/20 flex-shrink-0">
            <TrendUp weight="bold" className="text-white w-5 h-5" />
          </div>
          {!isCollapsed && (
            <h1 className="text-lg font-bold text-white tracking-tight animate-fade-in">CoinTrack</h1>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          {navItems.map((item, i) => (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center px-3' : 'space-x-3 px-4'} py-3 rounded-xl transition-all duration-200 group relative ${currentView === item.id
                ? 'bg-gradient-to-r from-[#7C3AED]/15 to-transparent text-[#A78BFA] font-medium'
                : 'text-[#8B95A7] hover:bg-white/[0.03] hover:text-white'
                }`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {currentView === item.id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-gradient-to-b from-[#6C5CE7] to-[#A855F7]" />
              )}
              <item.icon weight={currentView === item.id ? "fill" : "regular"} className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Collapse Toggle */}
        <div className="px-3 py-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center p-2 text-[#4B5568] hover:text-[#8B95A7] rounded-lg transition-colors"
          >
            {isCollapsed ? <CaretRight weight="bold" className="w-4 h-4" /> : <CaretLeft weight="bold" className="w-4 h-4" />}
          </button>
        </div>

        {/* Add Transaction CTA */}
        <div className="p-3 border-t border-white/[0.06]">
          <button
            onClick={onOpenAddModal}
            className={`w-full bg-gradient-to-r from-[#6C5CE7] to-[#A855F7] hover:from-[#7C3AED] hover:to-[#B070FA] text-white font-semibold py-3 rounded-xl shadow-lg shadow-purple-500/20 transition-all duration-300 flex items-center justify-center space-x-2 active:scale-[0.97] animate-pulse-glow ${isCollapsed ? 'px-3' : 'px-4'}`}
          >
            <Plus weight="bold" className="w-5 h-5" />
            {!isCollapsed && <span className="text-sm">Add Transaction</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto relative pb-24 md:pb-0">
        {/* Desktop Header with Greeting */}
        <header className="hidden md:flex sticky top-0 z-10 bg-[#0C0E14]/80 backdrop-blur-xl border-b border-white/[0.04] px-8 py-4 justify-between items-center">
          <div>
            <h2 className="text-sm font-medium text-[#8B95A7]">{greeting} 👋</h2>
            <p className="text-xs text-[#4B5568] mt-0.5">{today}</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6C5CE7] to-[#A855F7] flex items-center justify-center text-white text-sm font-bold shadow-md">
              U
            </div>
          </div>
        </header>

        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-10 bg-[#0C0E14]/80 backdrop-blur-xl border-b border-white/[0.06] p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-br from-[#6C5CE7] to-[#A855F7] p-1.5 rounded-lg">
              <TrendUp weight="bold" className="text-white w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-white">CoinTrack</h1>
          </div>
          <button onClick={onOpenAddModal} className="p-2 bg-[#7C3AED]/20 text-[#A78BFA] rounded-full">
            <Plus weight="bold" className="w-5 h-5" />
          </button>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#111320]/95 backdrop-blur-xl border-t border-white/[0.06] pb-safe z-30">
        <div className="flex justify-around items-center">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`flex flex-col items-center justify-center py-3 px-2 flex-1 space-y-1 transition-colors ${currentView === item.id
                ? 'text-[#A78BFA]'
                : 'text-[#4B5568]'
                }`}
            >
              <item.icon weight={currentView === item.id ? "fill" : "regular"} className="w-6 h-6" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
