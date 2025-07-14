import React, { useState } from 'react';
import { useBudget } from '../contexts/BudgetContext';
import { InsightsSection } from '../components/InsightsSection';

const categoryOptions = [
  { value: 'Other', label: 'Other' },
  { value: 'Food & Dining', label: 'Food & Dining' },
  { value: 'Transportation', label: 'Transportation' },
  { value: 'Shopping', label: 'Shopping' },
  { value: 'Entertainment', label: 'Entertainment' },
  { value: 'Utilities', label: 'Utilities' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Education', label: 'Education' },
  { value: 'Travel', label: 'Travel' },
  { value: 'Housing', label: 'Housing' },
  { value: 'Insurance', label: 'Insurance' },
  { value: 'Personal Care', label: 'Personal Care' }
];

const modalBackdrop = "fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 transition-opacity duration-200";
const modalPanel = "bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-lg min-h-fit space-y-6 transform transition-all duration-300 scale-95 opacity-0 animate-fadeInScale max-h-[90vh] overflow-y-auto";

// Add keyframes for fadeInScale animation
const style = document.createElement('style');
style.innerHTML = `
@keyframes fadeInScale {
  0% { opacity: 0; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
}
.animate-fadeInScale { animation: fadeInScale 0.25s cubic-bezier(0.4,0,0.2,1) forwards; }
`;
document.head.appendChild(style);

export const OverviewSection = () => {
  const { budgets, transactions } = useBudget();

  // Calculate totals
  const totalBudget = budgets.reduce((sum, b) => sum + (b.total_amount || 0), 0);
  const totalSpent = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + (t.amount || 0), 0);
  const remaining = totalBudget - totalSpent;

  // Status counts
  let onTrack = 0, approaching = 0, overBudget = 0;
  budgets.forEach(b => {
    const spent = transactions.filter(t => t.budget_id === b.id && t.type === 'expense').reduce((sum, t) => sum + (t.amount || 0), 0);
    if (spent < b.total_amount * 0.8) onTrack++;
    else if (spent < b.total_amount) approaching++;
    else overBudget++;
  });

  // Alerts (example: over budget)
  const alerts = overBudget;

  // Progress
  const progress = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 transition-colors">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-center transition-colors">
          <div className="text-3xl mr-3 text-blue-500 dark:text-blue-300">$
          </div>
          <div>
            <div className="text-blue-700 dark:text-blue-200 font-semibold text-sm">Total Budget</div>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">₹{totalBudget.toLocaleString()}</div>
          </div>
        </div>
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center transition-colors">
          <div className="text-3xl mr-3 text-red-500 dark:text-red-300">
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 17l6-6 4 4 8-8" /></svg>
          </div>
          <div>
            <div className="text-red-700 dark:text-red-200 font-semibold text-sm">Total Spent</div>
            <div className="text-2xl font-bold text-red-900 dark:text-red-100">₹{totalSpent.toLocaleString()}</div>
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center transition-colors">
          <div className="text-3xl mr-3 text-green-500 dark:text-green-300">
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 18a5 5 0 0 1-10 0V7a5 5 0 0 1 10 0v11z" /></svg>
          </div>
          <div>
            <div className="text-green-700 dark:text-green-200 font-semibold text-sm">Remaining</div>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">₹{remaining.toLocaleString()}</div>
          </div>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-center transition-colors">
          <div className="text-3xl mr-3 text-yellow-500 dark:text-yellow-300">
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
          </div>
          <div>
            <div className="text-yellow-700 dark:text-yellow-200 font-semibold text-sm">Alerts</div>
            <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{alerts}</div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="font-semibold text-lg mb-2 dark:text-gray-100">Overall Progress</h3>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-600 dark:text-gray-300">Budget Progress</span>
            <span className="text-sm font-semibold dark:text-gray-100">{progress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3 mb-2 transition-colors">
            <div
              className="bg-blue-500 dark:bg-blue-400 h-3 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex space-x-8 mt-2">
            <div className="flex flex-col items-center">
              <span className="text-green-600 dark:text-green-300 font-bold">{onTrack}</span>
              <span className="text-xs text-gray-600 dark:text-gray-300">On Track</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-yellow-600 dark:text-yellow-300 font-bold">{approaching}</span>
              <span className="text-xs text-gray-600 dark:text-gray-300">Approaching</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-red-600 dark:text-red-300 font-bold">{overBudget}</span>
              <span className="text-xs text-gray-600 dark:text-gray-300">Over Budget</span>
            </div>
          </div>
        </div>
        {/* Removed Spending Distribution section */}
      </div>
    </div>
  );
};

const inputBase = "w-full border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all placeholder-gray-400 dark:placeholder-gray-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100";
const labelBase = "block mb-1 font-semibold text-gray-700 dark:text-gray-300";
const buttonBase = "px-6 py-2 rounded-xl font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800";

const closeButton = "text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl absolute top-4 right-6 cursor-pointer transition-colors";

const BudgetFormModal = ({ open, onClose, budget }: { open: boolean; onClose: () => void; budget?: any }) => {
  const { addBudget, editBudget, loading, error, categories } = useBudget();
  const allCategories = categories.length > 0
    ? categories.map(c => ({ value: c.id, label: c.name }))
    : categoryOptions;
  const [categoryId, setCategoryId] = useState(budget?.category_id || (allCategories[0]?.value || ''));
  const [totalAmount, setTotalAmount] = useState(budget?.total_amount || '');
  const [periodType, setPeriodType] = useState(budget?.period_type || 'monthly');
  const [startDate, setStartDate] = useState(budget?.start_date || '');
  const [formError, setFormError] = useState('');

  React.useEffect(() => {
    setCategoryId(budget?.category_id || (allCategories[0]?.value || ''));
    setTotalAmount(budget?.total_amount || '');
    setPeriodType(budget?.period_type || 'monthly');
    setStartDate(budget?.start_date || '');
    setFormError('');
    // eslint-disable-next-line
  }, [budget, open, categories]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) return setFormError('Category is required');
    if (!totalAmount || isNaN(Number(totalAmount)) || Number(totalAmount) <= 0) return setFormError('Budget amount must be a positive number');
    if (!startDate) return setFormError('Start date is required');
    const selectedCategory = allCategories.find(c => c.value === categoryId);
    const data: any = {
      name: selectedCategory ? selectedCategory.label : 'Other',
      total_amount: Number(totalAmount),
      period_type: periodType,
      start_date: startDate,
    };
    if (budget && budget.end_date) {
      data.end_date = budget.end_date;
    }
    if (budget) {
      await editBudget(budget.id, data);
    } else {
      await addBudget(data);
    }
    if (!error) onClose();
  };

  return (
    <div className={modalBackdrop}>
      <form className={modalPanel} onSubmit={handleSubmit} style={{ position: 'relative' }}>
        <button type="button" className={closeButton} onClick={onClose} aria-label="Close">&times;</button>
        <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">Create New Budget</h2>
        <div>
          <label className={labelBase}>Category</label>
          <select
            className={inputBase}
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            required
          >
            {allCategories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelBase}>Budget Amount</label>
          <input
            className={inputBase}
            type="number"
            min="0"
            placeholder="Enter amount"
            value={totalAmount}
            onChange={e => setTotalAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label className={labelBase}>Period</label>
          <select
            className={inputBase}
            value={periodType}
            onChange={e => setPeriodType(e.target.value)}
            required
          >
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        <div>
          <label className={labelBase}>Start Date</label>
          <input
            className={inputBase}
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            required
          />
        </div>
        {formError && <div className="text-red-500 text-sm font-medium">{formError}</div>}
        {error && <div className="text-red-500 dark:text-red-300 text-sm font-medium">{error}</div>}
        <div className="flex justify-end space-x-3 mt-6">
          <button type="button" className={buttonBase + " bg-gray-100 text-gray-700 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800"} onClick={onClose}>Cancel</button>
          <button type="submit" className={buttonBase + " bg-blue-600 text-white dark:text-gray-100 hover:bg-blue-700 shadow-md"} disabled={loading}>{budget ? 'Update Budget' : 'Create Budget'}</button>
        </div>
      </form>
    </div>
  );
};

const BudgetCards = () => {
  const { budgets, transactions, removeBudget } = useBudget();
  const [showForm, setShowForm] = useState(false);
  const [editBudget, setEditBudget] = useState<any | null>(null);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded font-semibold" onClick={() => { setEditBudget(null); setShowForm(true); }}>+ Create Budget</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {budgets.map(budget => {
          const spent = transactions.filter(t => t.budget_id === budget.id && t.type === 'expense').reduce((sum, t) => sum + (t.amount || 0), 0);
          const remaining = Math.max(0, budget.total_amount - spent);
          const percent = budget.total_amount > 0 ? (spent / budget.total_amount) * 100 : 0;
          let status = 'On Track', statusColor = 'green';
          if (spent >= budget.total_amount) { status = 'Over Budget'; statusColor = 'red'; }
          else if (spent >= budget.total_amount * 0.8) { status = 'Approaching'; statusColor = 'yellow'; }
          return (
            <div key={budget.id} className="bg-white dark:bg-gray-900 dark:text-gray-100 rounded shadow p-6 flex flex-col border border-gray-200 dark:border-gray-800 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-bold text-lg dark:text-gray-100">{budget.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-300 capitalize">{budget.period_type} Budget</div>
                </div>
                <div className="flex space-x-2">
                  <button className="text-blue-600" onClick={() => { setEditBudget(budget); setShowForm(true); }}>Edit</button>
                  <button className="text-red-600" onClick={() => removeBudget(budget.id)}>Delete</button>
                </div>
              </div>
              <div className="mb-2">
                <div className="text-gray-500 dark:text-gray-300 text-sm">Budget Amount</div>
                <div className="font-semibold text-xl dark:text-gray-100">₹{budget.total_amount.toLocaleString()}</div>
              </div>
              <div className="mb-2">
                <div className="text-gray-500 dark:text-gray-300 text-sm">Spent</div>
                <div className="font-semibold text-lg dark:text-gray-100">₹{spent.toLocaleString()}</div>
              </div>
              <div className="mb-2">
                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 transition-colors">
                  <div className={`h-2 rounded-full transition-all ${statusColor === 'green' ? 'bg-green-500 dark:bg-green-400' : statusColor === 'yellow' ? 'bg-yellow-400 dark:bg-yellow-300' : 'bg-red-500 dark:bg-red-400'}`}
                    style={{ width: `${percent}%` }}></div>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span>{percent.toFixed(1)}% used</span>
                  <span className="text-gray-500 dark:text-gray-300">Remaining: ₹{remaining.toLocaleString()}</span>
                </div>
              </div>
              <div className={`mt-auto px-2 py-1 rounded text-xs font-semibold w-fit ${statusColor === 'green' ? 'bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300' : statusColor === 'yellow' ? 'bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300' : 'bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300'}`}>
                Status: {status}
              </div>
            </div>
          );
        })}
      </div>
      <BudgetFormModal open={showForm} onClose={() => { setShowForm(false); setEditBudget(null); }} budget={editBudget} />
      {budgets.length === 0 && <div className="text-gray-500 dark:text-gray-300 mt-8 text-center">No budgets found. Click "Create Budget" to add one.</div>}
    </div>
  );
};

const TransactionFormModal = ({ open, onClose, transaction }: { open: boolean; onClose: () => void; transaction?: any }) => {
  const { addTransaction, editTransaction, loading, error, categories } = useBudget();
  const allCategories = categories.length > 0
    ? categories.map(c => ({ value: c.id, label: c.name }))
    : categoryOptions;
  const [type, setType] = useState(transaction?.type || 'expense');
  const [amount, setAmount] = useState(transaction?.amount || '');
  const [categoryId, setCategoryId] = useState(transaction?.category_id || (allCategories[0]?.value || ''));
  const [note, setNote] = useState(transaction?.description || '');
  const [date, setDate] = useState(transaction?.date ? transaction.date.slice(0, 10) : '');
  const [formError, setFormError] = useState('');

  React.useEffect(() => {
    setType(transaction?.type || 'expense');
    setAmount(transaction?.amount || '');
    setCategoryId(transaction?.category_id || (allCategories[0]?.value || ''));
    setNote(transaction?.description || '');
    setDate(transaction?.date ? transaction.date.slice(0, 10) : '');
    setFormError('');
    // eslint-disable-next-line
  }, [transaction, open, categories]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return setFormError('Amount must be a positive number');
    if (!categoryId) return setFormError('Category is required');
    if (!date) return setFormError('Date is required');
    const selectedCategory = allCategories.find(c => c.value === categoryId);
    const data = {
      type,
      amount: Number(amount),
      category_id: categoryId,
      description: note,
      date,
    };
    if (transaction) {
      await editTransaction(transaction.id, data);
    } else {
      await addTransaction(data);
    }
    if (!error) onClose();
  };

  return (
    <div className={modalBackdrop}>
      <form className={modalPanel} onSubmit={handleSubmit} style={{ position: 'relative' }}>
        <button type="button" className={closeButton} onClick={onClose} aria-label="Close">&times;</button>
        <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">Add New Transaction</h2>
        <div>
          <label className={labelBase}>Type</label>
          <select
            className={inputBase}
            value={type}
            onChange={e => setType(e.target.value)}
            required
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <div>
          <label className={labelBase}>Amount</label>
          <input
            className={inputBase}
            type="number"
            min="0"
            placeholder="Enter amount"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label className={labelBase}>Category</label>
          <select
            className={inputBase}
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            required
          >
            {allCategories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelBase}>Note</label>
          <input
            className={inputBase}
            type="text"
            placeholder="Enter transaction note"
            value={note}
            onChange={e => setNote(e.target.value)}
          />
        </div>
        <div>
          <label className={labelBase}>Date</label>
          <input
            className={inputBase}
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
          />
        </div>
        {formError && <div className="text-red-500 text-sm font-medium">{formError}</div>}
        {error && <div className="text-red-500 dark:text-red-300 text-sm font-medium">{error}</div>}
        <div className="flex justify-end space-x-3 mt-6">
          <button type="button" className={buttonBase + " bg-gray-100 text-gray-700 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800"} onClick={onClose}>Cancel</button>
          <button type="submit" className={buttonBase + " bg-blue-600 text-white dark:text-gray-100 hover:bg-blue-700 shadow-md"} disabled={loading}>{transaction ? 'Update Transaction' : 'Add Transaction'}</button>
        </div>
      </form>
    </div>
  );
};

const TransactionHistory = () => {
  const { transactions, categories, removeTransaction } = useBudget();
  const [showForm, setShowForm] = useState(false);
  const [editTransaction, setEditTransaction] = useState<any | null>(null);
  const [search, setSearch] = useState('');

  // Helper to get category name
  const getCategoryName = (id: string) => {
    const cat = categories.find(c => c.id === id);
    return cat ? cat.name : categoryOptions.find(c => c.value === id)?.label || 'Other';
  };

  const filteredTransactions = transactions.filter(tx => {
    const catName = getCategoryName(tx.category_id).toLowerCase();
    return (
      tx.description?.toLowerCase().includes(search.toLowerCase()) ||
      catName.includes(search.toLowerCase()) ||
      String(tx.amount).includes(search)
    );
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded font-semibold" onClick={() => { setEditTransaction(null); setShowForm(true); }}>+ Add Transaction</button>
        <div className="flex flex-col ml-4 w-64">
          <label htmlFor="search-transactions" className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Search Transactions</label>
          <div className="relative">
            <input
              id="search-transactions"
              type="text"
              className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
              placeholder="Search transactions..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4 dark:text-gray-100">Transaction History</h2>
        <div className="divide-y">
          {filteredTransactions.length === 0 && <div className="text-gray-500 dark:text-gray-300 py-8 text-center">No transactions found. Click "Add Transaction" to add one.</div>}
          {filteredTransactions.map(tx => (
            <div
              key={tx.id}
              className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-6 py-4 mb-4 shadow-sm transition-colors"
            >
              <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                <div className="flex items-center text-gray-500 dark:text-gray-300 mb-1 md:mb-0">
                  <span className="inline-block align-middle mr-2 text-lg">🏷️</span>
                  <span className="font-semibold text-base dark:text-gray-100 mr-2">{getCategoryName(tx.category_id)}</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <span className="text-gray-800 dark:text-gray-100 font-medium text-base">{tx.description}</span>
                  <span className="flex items-center text-gray-400 text-sm dark:text-gray-400 ml-0 md:ml-4">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                    {tx.date ? new Date(tx.date).toLocaleDateString() : ''}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-2 md:mt-0">
                <div className={
                  (tx.type === 'income'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400') +
                  ' text-xl font-bold min-w-[120px] text-right'
                }>
                  {tx.type === 'income' ? '+' : '-'}₹{Number(tx.amount).toLocaleString()}
                </div>
                <button
                  className="flex items-center px-3 py-1 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors border border-transparent hover:border-blue-200 dark:hover:border-blue-700 text-sm font-medium"
                  onClick={() => { setEditTransaction(tx); setShowForm(true); }}
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z" /></svg>
                  Edit
                </button>
                <button
                  className="flex items-center px-3 py-1 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-700 text-sm font-medium"
                  onClick={() => removeTransaction(tx.id)}
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><rect x="5" y="6" width="14" height="14" rx="2" /><path d="M10 11v6" /><path d="M14 11v6" /></svg>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <TransactionFormModal open={showForm} onClose={() => { setShowForm(false); setEditTransaction(null); }} transaction={editTransaction} />
    </div>
  );
};

const tabs = [
  { key: 'budgets', label: 'Budgets' },
  { key: 'transactions', label: 'Transactions' },
  { key: 'insights', label: 'Insights' },
];

const Finances: React.FC = () => {
  const [activeTab, setActiveTab] = useState('budgets');

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Finances</h1>
      <div className="flex space-x-4 border-b mb-6">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`px-4 py-2 font-medium border-b-2 transition-colors duration-150 ${activeTab === tab.key ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === 'budgets' && <BudgetCards />}
      {activeTab === 'transactions' && <TransactionHistory />}
      {activeTab === 'insights' && <InsightsSection />}
    </div>
  );
};

export default Finances; 