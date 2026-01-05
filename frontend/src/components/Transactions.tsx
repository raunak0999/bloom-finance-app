import React, { useState, useEffect } from 'react';
import { transactionAPI } from '../services/api';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await transactionAPI.getAll();
      const data = Array.isArray(response.data) ? response.data : 
                   (response.data?.transactions || []);
      setTransactions(data);
    } catch (error) {
      console.error('Error:', error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 bg-card rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-foreground">Transactions</h1>
      {transactions.length === 0 ? (
        <p className="text-muted-foreground">No transactions yet</p>
      ) : (
        <ul className="space-y-2">
          {transactions.map(t => (
            <li key={t.id} className="p-3 bg-muted rounded-lg text-foreground">
              {t.description} - ₹{t.amount}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Transactions;
