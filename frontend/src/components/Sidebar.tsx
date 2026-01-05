import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Leaf, LayoutDashboard, Wallet, TrendingUp, Target, LogOut, BarChart3, MessageCircle, Sun, Moon, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from './theme-provider';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen = false, onMobileClose }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Close mobile drawer when route changes
    if (isMobileOpen && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleTheme = () => {
    const currentTheme = theme === 'system' 
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  };
  
  const currentThemeDisplay = mounted && theme === 'system' 
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme === 'system' 
    ? 'light' 
    : theme;

  const sidebarContent = (
    <div className="w-64 bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 text-foreground min-h-screen p-6 flex flex-col">
      {/* Mobile close button */}
      <div className="lg:hidden flex justify-end mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMobileClose}
          className="text-foreground hover:bg-muted"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="mb-8">
        <Link to="/dashboard" className="flex items-center gap-2" onClick={onMobileClose}>
          <Leaf size={32} />
          <span className="text-3xl font-bold">Bloom</span>
        </Link>
        <p className="text-muted-foreground text-sm mt-2">Where your money grows</p>
      </div>

      {user && (
        <div className="mb-8 p-4 bg-card rounded-lg">
          <p className="font-semibold">{user.fullName}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      )}

      <nav className="space-y-3 flex-1">
        <Link
          to="/dashboard"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            location.pathname === '/dashboard' ? 'bg-accent' : 'hover:bg-accent'
          }`}
          onClick={onMobileClose}
        >
          <LayoutDashboard size={20} />
          Dashboard
        </Link>
        <Link
          to="/transactions"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            location.pathname === '/transactions' ? 'bg-accent' : 'hover:bg-accent'
          }`}
          onClick={onMobileClose}
        >
          <Wallet size={20} />
          Transactions
        </Link>
        <Link
          to="/budget"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            location.pathname === '/budget' ? 'bg-accent' : 'hover:bg-accent'
          }`}
          onClick={onMobileClose}
        >
          <TrendingUp size={20} />
          Budget
        </Link>
        <Link
          to="/goals"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            location.pathname === '/goals' ? 'bg-accent' : 'hover:bg-accent'
          }`}
          onClick={onMobileClose}
        >
          <Target size={20} />
          Goals
        </Link>
        <Link
          to="/analytics"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            location.pathname === '/analytics' ? 'bg-accent' : 'hover:bg-accent'
          }`}
          onClick={onMobileClose}
        >
          <BarChart3 size={20} />
          Analytics
        </Link>
        <Link
          to="/ai-chat"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            location.pathname === '/ai-chat' ? 'bg-accent' : 'hover:bg-accent'
          }`}
          onClick={onMobileClose}
        >
          <MessageCircle size={20} />
          AI Chat
        </Link>
        <Link
          to="/investments"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            location.pathname === '/investments' ? 'bg-accent' : 'hover:bg-accent'
          }`}
          onClick={onMobileClose}
        >
          <span>💰</span>
          <span>Investments</span>
        </Link>
      </nav>

      <div className="space-y-3">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-primary hover:bg-primary/90 transition-colors text-primary-foreground"
          aria-label="Toggle theme"
        >
          {currentThemeDisplay === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          {currentThemeDisplay === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-destructive hover:bg-destructive/90 transition-colors text-destructive-foreground"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );

  // Desktop: Always visible sidebar
  const desktopSidebar = (
    <div className="hidden lg:block fixed left-0 top-0 h-full z-30">
      {sidebarContent}
    </div>
  );

  // Mobile: Animated drawer
  const mobileDrawer = (
    <AnimatePresence>
      {isMobileOpen && (
        <>
          {/* Overlay backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onMobileClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
            className="fixed left-0 top-0 h-full z-50 lg:hidden shadow-2xl"
          >
            {sidebarContent}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {desktopSidebar}
      {mobileDrawer}
    </>
  );
};
