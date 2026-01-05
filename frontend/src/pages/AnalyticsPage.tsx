import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart, Line, PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './AnalyticsPage.css';

interface Transaction {
  _id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

const AnalyticsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5001/api/transactions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      // Ensure loading state is handled if needed
    }
  };

  // Calculate category breakdown for expenses
  const getCategoryData = () => {
    const categoryTotals: { [key: string]: number } = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      });

    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value
    }));
  };

  // Calculate monthly trends
  const getMonthlyTrends = () => {
    const monthlyData: { [key: string]: { income: number; expense: number } } = {};
    
    transactions.forEach(t => {
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
        month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        income: data.income,
        expense: data.expense,
        net: data.income - data.expense
      }));
  };

  // Calculate income vs expense comparison
  const getIncomeVsExpense = () => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return [
      { name: 'Income', value: totalIncome, color: '#4CAF50' },
      { name: 'Expense', value: totalExpense, color: '#ff6b6b' }
    ];
  };

  // Top spending categories
  const getTopCategories = () => {
    const categoryData = getCategoryData();
    return categoryData
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  };

  const categoryData = getCategoryData();
  const monthlyTrends = getMonthlyTrends();
  const incomeVsExpense = getIncomeVsExpense();
  const topCategories = getTopCategories();

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#fee140'];

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? ((netBalance / totalIncome) * 100).toFixed(1) : 0;

  return (
    <div className="analytics-container">
      <h1>📊 Financial Analytics</h1>

      {/* Summary Stats */}
      <div className="analytics-summary">
        <div className="stat-card income">
          <h3>Total Income</h3>
          <p className="amount">₹{totalIncome.toFixed(2)}</p>
        </div>
        <div className="stat-card expense">
          <h3>Total Expenses</h3>
          <p className="amount">₹{totalExpense.toFixed(2)}</p>
        </div>
        <div className="stat-card net">
          <h3>Net Balance</h3>
          <p className={`amount ${netBalance >= 0 ? 'positive' : 'negative'}`}>
            ₹{netBalance.toFixed(2)}
          </p>
        </div>
        <div className="stat-card savings">
          <h3>Savings Rate</h3>
          <p className="amount">{savingsRate}%</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        
        {/* Income vs Expense Pie Chart */}
        <div className="chart-card">
          <h2>💰 Income vs Expenses</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={incomeVsExpense}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ₹${value.toFixed(0)}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {incomeVsExpense.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `₹${value.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="chart-card">
          <h2>🏷️ Spending by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `₹${value.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Trends */}
        <div className="chart-card full-width">
          <h2>📈 Monthly Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: number) => `₹${value.toFixed(2)}`} />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#4CAF50" strokeWidth={2} />
              <Line type="monotone" dataKey="expense" stroke="#ff6b6b" strokeWidth={2} />
              <Line type="monotone" dataKey="net" stroke="#667eea" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Categories Bar Chart */}
        <div className="chart-card full-width">
          <h2>🔝 Top 5 Spending Categories</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topCategories}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: number) => `₹${value.toFixed(2)}`} />
              <Bar dataKey="value" fill="#667eea">
                {topCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights */}
      <div className="insights-section">
        <h2>💡 Quick Insights</h2>
        <div className="insights-grid">
          {totalExpense > totalIncome && (
            <div className="insight warning">
              ⚠️ You're spending more than you earn! Consider reducing expenses.
            </div>
          )}
          {parseFloat(savingsRate.toString()) >= 20 && (
            <div className="insight success">
              ✅ Great job! You're saving {savingsRate}% of your income.
            </div>
          )}
          {categoryData.length > 0 && (
            <div className="insight info">
              📊 Your highest spending category is <strong>{categoryData[0]?.name}</strong> at ₹{categoryData[0]?.value.toFixed(2)}
            </div>
          )}
          {transactions.length === 0 && (
            <div className="insight info">
              📝 Start adding transactions to see detailed analytics!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
