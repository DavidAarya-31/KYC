import React, { useState, useEffect } from 'react';
import { useBudget } from '../contexts/BudgetContext';

interface Props {
  budget?: any;
  onClose: () => void;
}

const BudgetForm: React.FC<Props> = ({ budget, onClose }) => {
  const { addBudget, editBudget, loading, error } = useBudget();
  const [name, setName] = useState(budget?.name || '');
  const [totalAmount, setTotalAmount] = useState(budget?.total_amount || '');
  const [periodType, setPeriodType] = useState(budget?.period_type || 'monthly');
  const [startDate, setStartDate] = useState(budget?.start_date || '');
  const [endDate, setEndDate] = useState(budget?.end_date || '');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    setFormError('');
  }, [name, totalAmount, periodType, startDate, endDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setFormError('Name is required');
    if (!totalAmount || isNaN(Number(totalAmount)) || Number(totalAmount) <= 0) return setFormError('Total amount must be a positive number');
    if (!startDate) return setFormError('Start date is required');
    const data = {
      name: name.trim(),
      total_amount: Number(totalAmount),
      period_type: periodType,
      start_date: startDate,
      end_date: endDate || null,
    };
    if (budget) {
      await editBudget(budget.id, data);
    } else {
      await addBudget(data);
    }
    if (!error) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <form className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4" onSubmit={handleSubmit}>
        <h2 className="text-xl font-semibold mb-2">{budget ? 'Edit Budget' : 'Create Budget'}</h2>
        <div>
          <label className="block mb-1">Name</label>
          <input className="w-full border px-2 py-1 rounded" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <label className="block mb-1">Total Amount</label>
          <input className="w-full border px-2 py-1 rounded" type="number" min="0" value={totalAmount} onChange={e => setTotalAmount(e.target.value)} required />
        </div>
        <div>
          <label className="block mb-1">Period</label>
          <select className="w-full border px-2 py-1 rounded" value={periodType} onChange={e => setPeriodType(e.target.value)}>
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Start Date</label>
          <input className="w-full border px-2 py-1 rounded" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
        </div>
        {periodType === 'custom' && (
          <div>
            <label className="block mb-1">End Date</label>
            <input className="w-full border px-2 py-1 rounded" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
        )}
        {formError && <div className="text-red-500">{formError}</div>}
        {error && <div className="text-red-500">{error}</div>}
        <div className="flex justify-end space-x-2">
          <button type="button" className="px-4 py-1 rounded border" onClick={onClose}>Cancel</button>
          <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded" disabled={loading}>{budget ? 'Update' : 'Create'}</button>
        </div>
      </form>
    </div>
  );
};

export default BudgetForm; 