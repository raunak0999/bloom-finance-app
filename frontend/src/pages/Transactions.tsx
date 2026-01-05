import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { transactionAPI } from '../services/api';
import toast from 'react-hot-toast';

interface Transaction {
  _id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

const categories = {
  income: ['Salary', 'Freelance', 'Investment', 'Other'],
  expense: ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Other']
};

const Transactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (user && token) {
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = async () => {
    try {
      const response = await transactionAPI.getAll();
      setTransactions(response.data);
    } catch (error: any) {
      console.error('Failed to fetch transactions', error);
      toast.error(error.response?.data?.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !type) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const payload = {
        amount: parseFloat(amount),
        type: type.toLowerCase(),
        category,
        description,
        date: date ? new Date(date).toISOString() : undefined
      };

      if (editingId) {
        await transactionAPI.update(editingId, payload);
        toast.success('Transaction updated!');
        setEditingId(null);
      } else {
        await transactionAPI.create(payload);
        toast.success('Transaction added!');
      }
      setAmount('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
      fetchTransactions();
    } catch (error: any) {
      console.error('Failed to save transaction', error);
      toast.error(error.response?.data?.message || 'Failed to save transaction');
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingId(transaction._id);
    setType(transaction.type);
    setAmount(transaction.amount.toString());
    setCategory(transaction.category);
    setDescription(transaction.description);
    setDate(new Date(transaction.date).toISOString().split('T')[0]);
  };

  const handleDelete = async (id: string) => {
    try {
      await transactionAPI.delete(id);
      toast.success('Transaction deleted');
      fetchTransactions();
    } catch (error: any) {
      console.error('Failed to delete transaction', error);
      toast.error(error.response?.data?.message || 'Failed to delete transaction');
    }
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="text-xl">Loading...</div></div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">Transactions</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-green-50 p-6 rounded-xl border border-green-200">
          <p className="text-green-700 text-sm font-medium">Total Income</p>
          <p className="text-3xl font-bold text-green-900">₹{totalIncome.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-red-50 p-6 rounded-xl border border-red-200">
          <p className="text-red-700 text-sm font-medium">Total Expenses</p>
          <p className="text-3xl font-bold text-red-900">₹{totalExpense.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
          <p className="text-blue-700 text-sm font-medium">Balance</p>
          <p className="text-3xl font-bold text-blue-900">₹{balance.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-4">{editingId ? 'Edit Transaction' : 'Add Transaction'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <select value={type} onChange={(e) => setType(e.target.value as 'income' | 'expense')} className="w-full p-2 border rounded">
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border rounded">
                {categories[type].map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Amount</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full p-2 border rounded" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-2 border rounded" required />
            </div>
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">{editingId ? 'Update Transaction' : 'Add Transaction'}</button>
        </form>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
        {transactions.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          <ul className="space-y-2">
            {transactions.map(t => (
              <li key={t._id} className="flex justify-between items-center p-2 border rounded">
                <div>
                  <p className="font-bold">{t.category}</p>
                  <p>{t.description}</p>
                  <p>{new Date(t.date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={t.type === 'income' ? 'text-green-500' : 'text-red-500'}>
                    {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString("en-IN")}
                  </span>
                  <button onClick={() => handleEdit(t)} className="text-blue-500">Edit</button>
                  <button onClick={() => handleDelete(t._id)} className="text-red-500">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Transactions;
