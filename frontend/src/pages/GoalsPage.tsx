import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GoalsPage.css';
import toast from 'react-hot-toast';

interface Goal {
  _id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category?: string;
}

const GoalsPage = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState({
    name: "",
    targetAmount: "",
    deadline: "",
    currentAmount: "0",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addingMoneyId, setAddingMoneyId] = useState<string | null>(null);
  const [moneyToAdd, setMoneyToAdd] = useState('');

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }
      const res = await axios.get('http://localhost:5001/api/goals', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGoals(res.data.goals || []);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to load goals');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      if (editingId) {
        await axios.put(`http://localhost:5001/api/goals/${editingId}`,
          {
            name: newGoal.name, 
            targetAmount: parseFloat(newGoal.targetAmount), 
            currentAmount: parseFloat(newGoal.currentAmount), 
            deadline: newGoal.deadline 
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Goal updated!');
        setEditingId(null);
      } else {
        await axios.post('http://localhost:5001/api/goals',
          {
            name: newGoal.name, 
            targetAmount: parseFloat(newGoal.targetAmount), 
            currentAmount: parseFloat(newGoal.currentAmount), 
            deadline: newGoal.deadline 
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Goal created!');
      }
      
      setNewGoal({
        name: "",
        targetAmount: "",
        deadline: "",
        currentAmount: "0",
      });
      fetchGoals();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error saving goal';
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5001/api/goals/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Goal deleted');
      fetchGoals();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to delete goal');
    }
  };

  const handleEdit = (goal: Goal) => {
    setEditingId(goal._id);
    setNewGoal({
      name: goal.name,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      deadline: goal.deadline,
    });
  };

  const handleAddMoney = async (goalId: string) => {
    try {
      const token = localStorage.getItem('token');
      const goal = goals.find(g => g._id === goalId);
      if (!goal) return;

      const newAmount = goal.currentAmount + parseFloat(moneyToAdd);
      await axios.put(`http://localhost:5001/api/goals/${goalId}`,
        { currentAmount: newAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success('Money added to goal!');
      setAddingMoneyId(null);
      setMoneyToAdd('');
      fetchGoals();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to add money');
    }
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const calculateDaysRemaining = (deadline: string) => {
    const today = new Date();
    const end = new Date(deadline);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalRemaining = totalTarget - totalSaved;

  return (
    <div className="goals-container">
      <h1>🎯 Financial Goals</h1>

      {/* Summary Cards */}
      <div className="goals-summary">
        <div className="summary-card">
          <h3>Total Target</h3>
          <p className="amount">₹{totalTarget.toFixed(2)}</p>
        </div>
        <div className="summary-card">
          <h3>Total Saved</h3>
          <p className="amount saved">₹{totalSaved.toFixed(2)}</p>
        </div>
        <div className="summary-card">
          <h3>Remaining</h3>
          <p className="amount remaining">₹{totalRemaining.toFixed(2)}</p>
        </div>
        <div className="summary-card">
          <h3>Active Goals</h3>
          <p className="amount">{goals.length}</p>
        </div>
      </div>

      {/* Add Goal Form */}
      <div className="goal-form-section">
        <h2>{editingId ? '✏️ Edit Goal' : '➕ Create New Goal'}</h2>
        <form onSubmit={handleSubmit} className="goal-form">
          <input
            type="text"
            placeholder="Goal name (e.g., Buy a car)"
            value={newGoal.name}
            onChange={(e) =>
              setNewGoal({ ...newGoal, name: e.target.value })
            }
            required
          />
          <input
            type="number"
            placeholder="Target Amount (₹)"
            value={newGoal.targetAmount}
            onChange={(e) =>
              setNewGoal({ ...newGoal, targetAmount: e.target.value })
            }
            required
            min="0"
            step="0.01"
          />
          <input
            type="number"
            placeholder="Current Amount (₹)"
            value={newGoal.currentAmount}
            onChange={(e) =>
              setNewGoal({ ...newGoal, currentAmount: e.target.value })
            }
            required
            min="0"
            step="0.01"
          />
          <input
            type="date"
            placeholder="Deadline"
            value={newGoal.deadline}
            onChange={(e) =>
              setNewGoal({ ...newGoal, deadline: e.target.value })
            }
            required
          />
          <button type="submit">{editingId ? 'Update' : 'Create'} Goal</button>
          {editingId && (
            <button type="button" onClick={() => {
              setEditingId(null);
              setNewGoal({
                name: "",
                targetAmount: "",
                deadline: "",
                currentAmount: "0",
              });
            }}>Cancel</button>
          )}
        </form>
      </div>

      {/* Goals List */}
      <div className="goals-list">
        <h2>📋 Your Goals</h2>
        {goals.length === 0 ? (
          <p className="no-goals">No goals yet. Create one above to get started!</p>
        ) : (
          goals.map(goal => {
            const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
            const daysLeft = calculateDaysRemaining(goal.deadline);
            const isCompleted = progress >= 100;
            const isUrgent = daysLeft < 30 && !isCompleted;

            return (
              <div key={goal._id} className={`goal-card ${isCompleted ? 'completed' : ''} ${isUrgent ? 'urgent' : ''}`}>
                <div className="goal-header">
                  <h3>{isCompleted ? '✅ ' : ''}{goal.name}</h3>
                  <div className="goal-actions">
                    <button onClick={() => handleEdit(goal)} className="edit-btn">✏️</button>
                    <button onClick={() => handleDelete(goal._id)} className="delete-btn">🗑️</button>
                  </div>
                </div>

                <div className="goal-amounts">
                  <div>
                    <span className="label">Current:</span>
                    <span className="value">₹{goal.currentAmount.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="label">Target:</span>
                    <span className="value target">₹{goal.targetAmount.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="label">Remaining:</span>
                    <span className="value remaining">₹{(goal.targetAmount - goal.currentAmount).toFixed(2)}</span>
                  </div>
                </div>

                <div className="progress-section">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${progress}%`,
                        backgroundColor: isCompleted ? '#4CAF50' : (isUrgent ? '#ffaa00' : '#667eea')
                      }}
                    ></div>
                  </div>
                  <span className="percentage">{progress.toFixed(1)}%</span>
                </div>

                <div className="goal-footer">
                  <div className="deadline">
                    📅 {daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'}
                  </div>
                  
                  {!isCompleted && addingMoneyId === goal._id ? (
                    <div className="add-money-form">
                      <input
                        type="number"
                        placeholder="Amount"
                        value={moneyToAdd}
                        onChange={(e) => setMoneyToAdd(e.target.value)}
                        min="0"
                        step="0.01"
                      />
                      <button onClick={() => handleAddMoney(goal._id)}>Add</button>
                      <button onClick={() => { setAddingMoneyId(null); setMoneyToAdd(''); }}>Cancel</button>
                    </div>
                  ) : (
                    <button 
                      className="add-money-btn" 
                      onClick={() => setAddingMoneyId(goal._id)}
                      disabled={isCompleted}
                    >
                      💰 Add Money
                    </button>
                  )}
                </div>

                {isCompleted && (
                  <div className="celebration">🎉 Goal Achieved! Congratulations!</div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default GoalsPage;
