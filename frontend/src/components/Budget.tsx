import React, { useState, useEffect } from 'react';
import { budgetAPI } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Edit, Save, X, PieChart, TrendingUp, Calendar, Trash2 } from "lucide-react";

export const Budget: React.FC = () => {
  const [budget, setBudget] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [newCategories, setNewCategories] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchBudget();
    }
  }, []);

  const fetchBudget = async () => {
    try {
      const response = await budgetAPI.get();
      // Backend returns array of budgets directly
      const budgets = Array.isArray(response.data) ? response.data : [];
      setBudget({ categories: budgets });
      // Map backend budget objects to frontend category format
      const categories = budgets.map((budget: any) => ({
        ...budget,
        name: budget.category,
        limit: budget.limit,
        spent: budget.spent || 0,
        month: budget.month
      }));
      setNewCategories(categories);
    } catch (error) {
      console.error('Error fetching budget:', error);
    }
  };

  const handleSave = async () => {
    try {
      // Map to backend format: category, limit, month
      const payloadCategories = newCategories.map(cat => ({
        category: cat.category,
        limit: cat.limit,
        month: cat.month || new Date().toISOString().slice(0, 7)
      }));
      await budgetAPI.update({ categories: payloadCategories });
      setEditMode(false);
      await fetchBudget();
    } catch (error) {
      console.error('Error updating budget:', error);
    }
  };

  const handleDelete = async (budgetId: string) => {
    try {
      await budgetAPI.delete(budgetId);
      await fetchBudget();
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };

  if (!budget) {
    return <div className="p-8 flex items-center justify-center min-h-[400px]">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading budget...</p>
      </div>
    </div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budget Overview</h1>
          <p className="text-muted-foreground">Manage your monthly spending categories</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <Input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-40"
            />
          </div>
          <Button
            onClick={() => setEditMode(!editMode)}
            variant={editMode ? "outline" : "default"}
            size="lg"
          >
            {editMode ? <X className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
            {editMode ? 'Cancel' : 'Edit Budget'}
          </Button>
        </div>
      </div>

      {/* Total Budget Summary Card */}
      <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-primary" />
            Total Budget Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold">
              ₹{newCategories.reduce((sum, cat) => sum + (cat.spent || 0), 0).toLocaleString()} spent
            </div>
            <div className="text-sm text-muted-foreground">
              of ₹{newCategories.reduce((sum, cat) => sum + (cat.limit || 0), 0).toLocaleString()} limit
            </div>
            <div className="text-sm text-muted-foreground">
              ₹{(newCategories.reduce((sum, cat) => sum + (cat.limit || 0), 0) - newCategories.reduce((sum, cat) => sum + (cat.spent || 0), 0)).toLocaleString()} remaining
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {newCategories.filter(category => category.month === selectedMonth).map((category, index) => {
          const percentage = category.limit > 0 ? Math.min((category.spent / category.limit) * 100, 100) : 0;
          const isOverBudget = category.spent > category.limit;

          return (
            <Card key={index} className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-3">
                    <PieChart className="w-5 h-5 text-primary" />
                    {editMode ? (
                      <Input
                        value={category.name}
                        onChange={(e) => {
                          const updated = [...newCategories];
                          updated[index].name = e.target.value;
                          updated[index].category = e.target.value;
                          setNewCategories(updated);
                        }}
                        className="h-8 font-semibold text-base"
                      />
                    ) : (
                      category.name
                    )}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {editMode && (
                      <Button
                        onClick={() => handleDelete(category._id)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                    {isOverBudget && (
                      <Badge variant="destructive" className="text-xs px-2 py-1">
                        Over Budget
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-4">
                {/* Amounts */}
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-foreground">
                    ₹{(category.spent || 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    / ₹{(category.limit || 0).toLocaleString()}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-mono text-sm">{percentage.toFixed(0)}%</span>
                  </div>
                  <Progress value={percentage} className="h-3" />
                </div>

                {editMode ? (
                  <Input
                    type="number"
                    value={category.limit}
                    onChange={(e) => {
                      const updated = [...newCategories];
                      updated[index].limit = parseInt(e.target.value) || 0;
                      setNewCategories(updated);
                    }}
                    className="w-full"
                    placeholder="New limit"
                    min="0"
                    step="0.01"
                  />
                ) : (
                  <div className="text-xs text-muted-foreground">
                    {isOverBudget
                      ? `Over by ₹${((category.spent || 0) - (category.limit || 0)).toLocaleString()}`
                      : `${Math.round((category.limit || 0) - (category.spent || 0)).toLocaleString()} remaining`
                    }
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {/* New Category Card */}
        <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-dashed border-2 border-muted-foreground/20">
          <CardContent className="p-6 flex items-center justify-center min-h-[200px]">
            <Button
              onClick={async () => {
                try {
                  // Create individual budget via POST for selected month
                  await budgetAPI.create({
                    category: 'New Category',
                    limit: 1000,
                    month: selectedMonth
                  });
                  // Refresh the budget list
                  await fetchBudget();
                } catch (error) {
                  console.error('Error creating budget:', error);
                }
              }}
              variant="outline"
              className="w-full h-full flex flex-col gap-2"
            >
              <PieChart className="w-8 h-8 text-muted-foreground" />
              <span className="text-lg font-semibold">New Budget +</span>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      {editMode && (
        <div className="flex gap-3 pt-4 border-t">
          <Button onClick={handleSave} className="flex-1 md:flex-none">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
          <Button onClick={() => setEditMode(false)} variant="outline">
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};
