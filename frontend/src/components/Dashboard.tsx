import React, { useState, useEffect } from 'react';
import { TrendingUp, Eye, EyeOff, PieChart, BarChart3, Target, Wallet } from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { transactionAPI, budgetAPI, goalAPI } from '../services/api';

export const Dashboard: React.FC = () => {
  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [showBalance, setShowBalance] = useState(true);
  const [loading, setLoading] = useState(true);
  const [budgetData, setBudgetData] = useState<any[]>([]);
  const [goalData, setGoalData] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [transactionsRes, budgetRes, goalsRes] = await Promise.all([
        transactionAPI.getAll(),
        budgetAPI.get(),
        goalAPI.getAll()
      ]);

      const txns = transactionsRes.data || [];
      const totalIncome = txns.filter((t: any) => t.type === 'income').reduce((sum: number, t: any) => sum + t.amount, 0);
      const totalExpenses = txns.filter((t: any) => t.type === 'expense').reduce((sum: number, t: any) => sum + t.amount, 0);

      setIncome(totalIncome);
      setExpenses(totalExpenses);
      setBalance(totalIncome - totalExpenses);
      setBudgetData(budgetRes.data?.budget?.categories || budgetRes.data?.categories || []);
      const goals = Array.isArray(goalsRes.data)
        ? goalsRes.data
        : Array.isArray(goalsRes.data?.goals)
          ? goalsRes.data.goals
          : [];

      setGoalData(goals);
    } catch (error) {
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Balance</h3>
          <p className="text-4xl font-bold">{showBalance ? `₹${balance.toLocaleString()}` : '••••'}</p>
          <button onClick={() => setShowBalance(!showBalance)} className="mt-2 text-blue-100 hover:text-white">
            {showBalance ? 'Hide' : 'Show'}
          </button>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Income</h3>
          <p className="text-4xl font-bold">₹{income.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Expenses</h3>
          <p className="text-4xl font-bold">₹{expenses.toLocaleString()}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-foreground">
            <PieChart className="text-blue-500" />
            Income vs Expenses
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={[
                  { name: 'Income', value: income, color: '#10B981' },
                  { name: 'Expenses', value: expenses, color: '#EF4444' }
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {[
                  { name: 'Income', value: income, color: '#10B981' },
                  { name: 'Expenses', value: expenses, color: '#EF4444' }
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `₹${(value ?? 0).toLocaleString()}`} />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-foreground">
            <Target className="text-purple-500" />
            Goals Progress
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={goalData.slice(0, 3).map((goal: any, index: number) => ({
                  name: goal.name || `Goal ${index + 1}`,
                  value: goal.currentAmount || 0,
                  color: ['#8B5CF6', '#06B6D4', '#F59E0B'][index]
                }))}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {goalData.slice(0, 3).map((goal: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={['#8B5CF6', '#06B6D4', '#F59E0B'][index]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `₹${(value ?? 0).toLocaleString()}`} />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Budget Cards Section */}
      <div className="bg-card rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-foreground">
          <Wallet className="text-blue-500" />
          Budget Overview (Top 3)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {budgetData.slice(0, 3).map((category: any, index: number) => {
            const percentage = (category.spent / category.limit) * 100;
            const gradients = [
              'bg-gradient-to-br from-blue-500 to-blue-600',
              'bg-gradient-to-br from-green-500 to-green-600',
              'bg-gradient-to-br from-orange-500 to-orange-600'
            ];
            const icons = {
              'Food': '🍔',
              'Rent': '🏠',
              'Shopping': '🛒'
            };
            const getProgressColor = () => {
              if (percentage <= 70) return 'bg-green-500';
              if (percentage <= 90) return 'bg-orange-500';
              return 'bg-red-500';
            };

            return (
              <div key={index} className={`${gradients[index % gradients.length]} rounded-lg shadow-lg p-6 text-white transition-all duration-300 hover:shadow-xl`}>
                <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                  <span className="text-2xl">{icons[category.name as keyof typeof icons] || '📊'}</span>
                  {category.name}
                </h3>
                <p className="text-3xl font-bold mb-4">
                  ₹{(category.spent || 0).toLocaleString()} / ₹{(category.limit || 0).toLocaleString()}
                </p>
                <div className="mt-4">
                  <div className="flex justify-between mb-2 text-sm">
                    <span>Progress</span>
                    <span className="font-semibold">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="bg-white/20 rounded-full h-4 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${getProgressColor()}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
