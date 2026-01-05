import React, { useState, useEffect } from 'react';
import { TrendingUp, Eye, EyeOff, Wallet, ArrowUp, ArrowDown, PieChart as PieChartIcon, TrendingDown } from 'lucide-react';
import { transactionAPI, goalAPI, aiAPI } from '../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface Transaction {
  _id?: string;
  id?: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string | Date;
}

const DashboardPage: React.FC = () => {
  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [showBalance, setShowBalance] = useState(true);
  const [goals, setGoals] = useState<any[]>([]);
  const [aiTip, setAiTip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [transactionsRes, goalsData, tips] = await Promise.all([
        transactionAPI.getAll(),
        goalAPI.getAll(),
        aiAPI.getTips(),
      ]);

      const txns = transactionsRes.data.transactions || [];
      setTransactions(txns);
      
      const totalIncome = txns
        .filter((t: any) => t.type === 'income')
        .reduce((sum: number, t: any) => sum + t.amount, 0);
      const totalExpenses = txns
        .filter((t: any) => t.type === 'expense')
        .reduce((sum: number, t: any) => sum + t.amount, 0);

      setIncome(totalIncome);
      setExpenses(totalExpenses);
      setBalance(totalIncome - totalExpenses);
      setGoals(goalsData.data.goals || []);
      setAiTip(tips.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate spending breakdown by category
  const getSpendingBreakdown = () => {
    const categoryTotals: { [key: string]: number } = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      });

    return Object.entries(categoryTotals)
      .map(([name, value]) => ({
        name,
        value: Math.round(value),
      }))
      .sort((a, b) => b.value - a.value);
  };

  // Calculate monthly trends
  const getMonthlyTrends = () => {
    const monthlyData: { [key: string]: { income: number; expense: number } } = {};

    transactions.forEach((t) => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expense: 0 };
      }

      if (t.type === 'income') {
        monthlyData[monthKey].income += t.amount;
      } else {
        monthlyData[monthKey].expense += t.amount;
      }
    });

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, data]) => ({
        month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short' }),
        income: Math.round(data.income),
        expense: Math.round(data.expense),
      }));
  };

  // Subtle slate colors for charts
  const SLATE_COLORS = [
    '#64748b', // slate-500
    '#475569', // slate-600
    '#334155', // slate-700
    '#1e293b', // slate-800
    '#94a3b8', // slate-400
    '#cbd5e1', // slate-300
    '#e2e8f0', // slate-200
  ];

  const spendingBreakdown = getSpendingBreakdown();
  const monthlyTrends = getMonthlyTrends();

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Overview of your financial health</p>
        </div>

        {/* Stats Grid - Responsive: 1 col mobile, 2 col tablet, 3-4 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {/* Total Balance Card */}
          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold opacity-90 flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  Total Balance
                </CardTitle>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="hover:opacity-80 transition-opacity"
                  aria-label="Toggle balance visibility"
                >
                  {showBalance ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-10 w-32 bg-white/20" />
              ) : (
                <p className="text-3xl sm:text-4xl font-bold">
                  {showBalance ? `₹${balance.toLocaleString()}` : '••••••'}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Monthly Income Card */}
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold opacity-90 flex items-center gap-2">
                <ArrowUp className="h-4 w-4" />
                Monthly Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-10 w-32 bg-white/20" />
              ) : (
                <p className="text-3xl sm:text-4xl font-bold">₹{income.toLocaleString()}</p>
              )}
            </CardContent>
          </Card>

          {/* Monthly Expenses Card */}
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold opacity-90 flex items-center gap-2">
                <ArrowDown className="h-4 w-4" />
                Monthly Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-10 w-32 bg-white/20" />
              ) : (
                <p className="text-3xl sm:text-4xl font-bold">₹{expenses.toLocaleString()}</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Goals Progress Card */}
          <Card className="shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
                Goals Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : goals.length > 0 ? (
                <div className="space-y-4">
                  {goals.map((goal) => (
                    <div key={goal._id || goal.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-foreground">{goal.name}</span>
                        <span className="text-sm text-muted-foreground">
                          ₹{goal.currentAmount?.toLocaleString() || 0} / ₹{goal.targetAmount?.toLocaleString() || 0}
                        </span>
                      </div>
                    <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            ((goal.currentAmount || 0) / (goal.targetAmount || 1)) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No goals yet. Create one to start saving! 🎯</p>
            )}
          </CardContent>
        </Card>

        {/* Charts Grid - Responsive: 1 col mobile, 2 col desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Spending Breakdown Chart */}
          <Card className="shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                Spending Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-64 w-full" />
                </div>
              ) : spendingBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={spendingBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {spendingBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={SLATE_COLORS[index % SLATE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => `₹${value.toLocaleString()}`}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px',
                        color: 'hsl(var(--card-foreground))',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted-foreground text-center py-16">No expense data available</p>
              )}
            </CardContent>
          </Card>

          {/* Monthly Trend Chart */}
          <Card className="shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                Monthly Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-64 w-full" />
                </div>
              ) : monthlyTrends.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="month"
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: '12px' }}
                      tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      formatter={(value: number) => `₹${value.toLocaleString()}`}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px',
                        color: 'hsl(var(--card-foreground))',
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="income"
                      stroke="#475569"
                      strokeWidth={2}
                      dot={{ fill: '#475569', r: 4 }}
                      name="Income"
                    />
                    <Line
                      type="monotone"
                      dataKey="expense"
                      stroke="#94a3b8"
                      strokeWidth={2}
                      dot={{ fill: '#94a3b8', r: 4 }}
                      name="Expenses"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted-foreground text-center py-16">No transaction data available</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* AI Tip Card */}
        {aiTip && (
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-l-4 border-purple-500 dark:border-purple-400 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🌱</span>
                Sage Says
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground mb-2">{aiTip.message}</p>
              {aiTip.encouragement && (
                <p className="text-sm text-muted-foreground italic">{aiTip.encouragement}</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;

