import { Target, TrendingUp, Clock } from 'lucide-react';
import { formatCurrency, getProgressPercentage } from '../utils/cycles';

interface CycleSummaryProps {
  milestone: number;
  spent: number;
  cycleEndMonth: string;
}

export function CycleSummary({ milestone, spent, cycleEndMonth }: CycleSummaryProps) {
  const remaining = Math.max(0, milestone - spent);
  const progressPercentage = getProgressPercentage(spent, milestone);
  
  // Calculate end date for display
  const [year, month] = cycleEndMonth.split('-');
  const endDate = new Date(parseInt(year), parseInt(month), 0); // Last day of the month

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Current Cycle Summary</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="text-center p-4 bg-blue-50 rounded-xl">
          <Target className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-1">Milestone</p>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(milestone)}</p>
        </div>
        
        <div className="text-center p-4 bg-green-50 rounded-xl">
          <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-1">Spent</p>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(spent)}</p>
        </div>
        
        <div className="text-center p-4 bg-orange-50 rounded-xl">
          <Clock className="w-6 h-6 text-orange-600 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-1">Remaining</p>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(remaining)}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-bold text-gray-900">{progressPercentage.toFixed(1)}%</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        <p className="text-sm text-gray-600 text-center">
          Cycle ends on {endDate.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
          })}
        </p>
      </div>
    </div>
  );
}