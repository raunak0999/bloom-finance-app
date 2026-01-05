import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Target } from 'lucide-react';
import { goalAPI } from '../services/api';

export const Goals: React.FC = () => {
  const [goals, setGoals] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    deadline: '',
    category: 'savings',
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await goalAPI.getAll();
      setGoals(response.data.goals || []);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await goalAPI.create(formData);
      setFormData({
        name: '',
        targetAmount: '',
        deadline: '',
        category: 'savings',
      });
      setShowForm(false);
      await fetchGoals();
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await goalAPI.delete(id);
      await fetchGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const handleUpdateProgress = async (id: string, currentAmount: number) => {
    try {
      const newAmount = currentAmount + 1000;
      await goalAPI.update(id, { currentAmount: newAmount });
      await fetchGoals();
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-foreground">Savings Goals</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-primary-foreground px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90"
        >
          <Plus size={20} /> New Goal
        </button>
      </div>

      {showForm && (
        <div className="bg-card rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-foreground">Create New Goal</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Goal Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Vacation, Car, House"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Target Amount</label>
              <input
                type="number"
                value={formData.targetAmount}
                onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                placeholder="Enter target amount"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Target Date</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90"
              >
                Create Goal
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.isArray(goals) && goals.map((goal) => {
          const percentage = (goal.currentAmount / goal.targetAmount) * 100;
          const daysLeft = Math.ceil(
            (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          );

          return (
            <div key={goal._id || goal.id} className="bg-card rounded-lg shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{goal.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(goal._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">
                    ₹{(goal.currentAmount || 0).toLocaleString()} / ₹{(goal.targetAmount || 0).toLocaleString()}
                  </span>
                  <span className="font-semibold text-primary">{percentage.toFixed(0)}%</span>
                </div>
                <div className="bg-muted rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all"
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => handleUpdateProgress(goal._id, goal.currentAmount)}
                className="w-full bg-primary/10 text-primary py-2 rounded-lg hover:bg-primary/20 font-semibold"
              >
                Add ₹1000
              </button>
            </div>
          );
        })}
      </div>

      {goals.length === 0 && (
        <div className="text-center text-gray-600 mt-8">
          <Target size={48} className="mx-auto mb-4 opacity-50" />
          <p>No goals yet. Create one to start saving towards your dreams! 🎯</p>
        </div>
      )}
    </div>
  );
};
