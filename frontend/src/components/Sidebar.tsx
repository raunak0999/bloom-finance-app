import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Leaf, LayoutDashboard, Wallet, TrendingUp, Target, LogOut, BarChart3, MessageCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Sidebar: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-64 bg-gradient-to-b from-emerald-700 to-emerald-900 text-white min-h-screen p-6 flex flex-col">
      <div className="mb-8">
        <Link to="/dashboard" className="flex items-center gap-2">
          <Leaf size={32} />
          <span className="text-3xl font-bold">Bloom</span>
        </Link>
        <p className="text-emerald-100 text-sm mt-2">Where your money grows</p>
      </div>

      {user && (
        <div className="mb-8 p-4 bg-emerald-600 rounded-lg">
          <p className="font-semibold">{user.fullName}</p>
          <p className="text-sm text-emerald-100">{user.email}</p>
        </div>
      )}

      <nav className="space-y-3 flex-1">
        <Link
          to="/dashboard"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-emerald-600 transition"
        >
          <LayoutDashboard size={20} />
          Dashboard
        </Link>
        <Link
          to="/transactions"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-emerald-600 transition"
        >
          <Wallet size={20} />
          Transactions
        </Link>
        <Link
          to="/budget"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-emerald-600 transition"
        >
          <TrendingUp size={20} />
          Budget
        </Link>
        <Link
          to="/goals"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-emerald-600 transition"
        >
          <Target size={20} />
          Goals
        </Link>
        <Link
          to="/analytics"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-emerald-600 transition"
        >
          <BarChart3 size={20} />
          Analytics
        </Link>
        <Link
          to="/ai-chat"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-emerald-600 transition"
        >
          <MessageCircle size={20} />
          AI Chat
        </Link>
        <Link to="/investments" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
          <span>💰</span>
          <span>Investments</span>
        </Link>
      </nav>

      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition"
      >
        <LogOut size={20} />
        Logout
      </button>
    </div>
  );
};
