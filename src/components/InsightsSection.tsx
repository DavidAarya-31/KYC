import React from 'react';
import { useBudget } from '../contexts/BudgetContext';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = [
  '#2563eb', '#16a34a', '#f59e42', '#e11d48', '#a21caf', '#0e7490', '#facc15', '#7c3aed', '#f472b6', '#10b981', '#fbbf24', '#6366f1'
];

function getSpendingTrends(transactions: any[], period = 'monthly'): any[] {
  // Group by month (YYYY-MM)
  const map: Record<string, number> = {};
  transactions.filter((t: any) => t.type === 'expense').forEach((t: any) => {
    const date = new Date(t.date);
    let key;
    if (period === 'monthly') key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    else if (period === 'weekly') key = `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`;
    else key = date.toISOString().slice(0, 10);
    map[key] = (map[key] || 0) + t.amount;
  });
  return Object.entries(map).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => ({ period: k, amount: v }));
}

function getCategoryBreakdown(transactions: any[], categories: any[]): any[] {
  const map: Record<string, number> = {};
  transactions.filter((t: any) => t.type === 'expense').forEach((t: any) => {
    const cat = categories.find((c: any) => c.id === t.category_id)?.name || 'Other';
    map[cat] = (map[cat] || 0) + t.amount;
  });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

// --- Budget vs. Actual by Category (always show all budget categories) ---
function getBudgetVsActualByCategory(categories: any[], transactions: any[], budgetCategories: any[]): any[] {
  // Map category_id to category name
  const categoryMap: Record<string, string> = categories.reduce((acc: Record<string, string>, c: any) => {
    acc[c.id] = c.name;
    return acc;
  }, {});
  // Aggregate budgeted amounts per category (from budgetCategories)
  const budgetedByCategory: Record<string, number> = {};
  budgetCategories.forEach((bc: any) => {
    budgetedByCategory[bc.category_id] = (budgetedByCategory[bc.category_id] || 0) + bc.allocated_amount;
  });
  // Aggregate spent per category (from transactions)
  const spentByCategory: Record<string, number> = {};
  transactions.filter((t: any) => t.type === 'expense').forEach((t: any) => {
    spentByCategory[t.category_id] = (spentByCategory[t.category_id] || 0) + t.amount;
  });
  // Always include all categories present in budgetCategories
  const allCategoryIds = Array.from(new Set([
    ...Object.keys(budgetedByCategory),
    ...Object.keys(spentByCategory)
  ]));
  // Build result: always show all budget categories, even if spent is zero
  const result = allCategoryIds.map((catId: string) => ({
    name: categoryMap[catId] || 'Other',
    Budget: budgetedByCategory[catId] || 0,
    Spent: spentByCategory[catId] || 0
  }));
  // Sort so budget categories come first, then categories with only spending
  result.sort((a, b) => {
    if (budgetedByCategory[a.name] && !budgetedByCategory[b.name]) return -1;
    if (!budgetedByCategory[a.name] && budgetedByCategory[b.name]) return 1;
    return a.name.localeCompare(b.name);
  });
  return result;
}

// --- Enhanced Forecasting: use both budgets and transactions, robust fallback ---
function getForecasting(budgets: any[], transactions: any[], period = 'monthly'): { forecast: any[]; message: string | null } {
  // Use spending trends for forecasting
  const trends = getSpendingTrends(transactions, period);
  if (trends.length < 2) return { forecast: [], message: 'Not enough transaction data to forecast.' };
  // Simple forecast: average of last 3 periods
  const avg = trends.slice(-3).reduce((sum: number, t: any) => sum + t.amount, 0) / Math.min(3, trends.length);
  const forecast = [...trends, { period: 'Forecast', amount: Math.round(avg) }];
  return { forecast, message: null };
}

function getMilestoneProgress(budgets: any[], transactions: any[]): any[] {
  return budgets.map((b: any) => {
    const spent = transactions.filter((t: any) => t.budget_id === b.id && t.type === 'expense').reduce((sum: number, t: any) => sum + t.amount, 0);
    return {
      name: b.name,
      percent: b.total_amount > 0 ? Math.min(100, (spent / b.total_amount) * 100) : 0,
      spent,
      total: b.total_amount
    };
  });
}

export function InsightsSection() {
  const { transactions, categories, loading, error } = useBudget();

  // Debug output for category matching (remove budgetCategories references)
  console.log('Transaction category IDs:', transactions.map((t: any) => ({ id: t.category_id, name: categories.find((c: any) => c.id === t.category_id)?.name })));

  // Find duplicate category names with different IDs
  const nameToIds: Record<string, Set<string>> = {};
  categories.forEach((c: any) => {
    if (!nameToIds[c.name]) nameToIds[c.name] = new Set();
    nameToIds[c.name].add(c.id);
  });
  const duplicateCategories = Object.entries(nameToIds).filter(([name, ids]) => ids.size > 1);

  // Data
  const trends = getSpendingTrends(transactions, 'monthly');
  const breakdown = getCategoryBreakdown(transactions, categories);

  if (loading) return <div className="text-center py-16 text-gray-400 dark:text-gray-500">Loading insights...</div>;
  if (error) return <div className="text-center py-16 text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Spending Trends */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 transition-colors">
        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Spending Trends</h3>
        {trends.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-gray-400 dark:text-gray-500">No data</div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={trends} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="period" stroke="#6b7280" className="text-xs" />
              <YAxis stroke="#6b7280" className="text-xs" />
              <Tooltip contentStyle={{ background: 'var(--tw-bg-opacity,1) #fff', color: '#111' }} wrapperClassName="dark:bg-gray-900 dark:text-gray-100" />
              <Line type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
      {/* Category Breakdown */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 transition-colors">
        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Category Breakdown</h3>
        {breakdown.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-gray-400 dark:text-gray-500">No data</div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={breakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {breakdown.map((entry: any, idx: number) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip contentStyle={{ background: 'var(--tw-bg-opacity,1) #fff', color: '#111' }} wrapperClassName="dark:bg-gray-900 dark:text-gray-100" />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
} 