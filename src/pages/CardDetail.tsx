import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Database } from '../lib/supabase';
import { getAnniversaryCycle, formatMonth, formatCurrency } from '../utils/cycles';
import { PageHeader } from '../components/PageHeader';
import { CardHeader } from '../components/CardHeader';
import { CycleSummary } from '../components/CycleSummary';
import { MonthlySpendTable } from '../components/MonthlySpendTable';

type Card = Database['public']['Tables']['cards']['Row'];

interface CardStats {
  totalSpent: number;
  cycleMonths: string[];
}

export function CardDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [card, setCard] = useState<Card | null>(null);
  const [stats, setStats] = useState<CardStats>({ totalSpent: 0, cycleMonths: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && id) {
      fetchCard();
    }
  }, [user, id]);

  const fetchCard = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      
      // Fetch card details
      const { data: cardData, error: cardError } = await supabase
        .from('cards')
        .select('*')
        .eq('id', id)
        .eq('user_id', user!.id)
        .single();

      if (cardError) throw cardError;
      if (!cardData) {
        navigate('/cards');
        return;
      }

      setCard(cardData);
      
      // Calculate cycle and spending
      await calculateStats(cardData);
    } catch (error) {
      console.error('Error fetching card:', error);
      navigate('/cards');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = async (cardData: Card) => {
    try {
      const cycle = getAnniversaryCycle(cardData.anniversary_month);
      // Fetch spending data for this cycle
      const { data: spends, error: spendsError } = await supabase
        .from('monthly_spends')
        .select('amount_spent')
        .eq('card_id', cardData.id)
        .in('month', cycle.months);
      if (spendsError) throw spendsError;
      const totalSpent = spends?.reduce((sum, spend) => sum + spend.amount_spent, 0) || 0;
      setStats({
        totalSpent,
        cycleMonths: cycle.months,
      });
    } catch (error) {
      console.error('Error calculating stats:', error);
    }
  };

  const handleSpendUpdate = () => {
    if (card) {
      calculateStats(card);
    }
  };

  const handleEdit = () => {
    if (card) {
      navigate(`/cards/${card.id}/edit`);
    }
  };

  const handleDelete = async () => {
    if (!card) return;
    
    try {
      const { error } = await supabase
        .from('cards')
        .delete()
        .eq('id', card.id)
        .eq('user_id', user!.id);

      if (error) throw error;
      
      navigate('/cards');
    } catch (error) {
      console.error('Error deleting card:', error);
      alert('Error deleting card. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!card) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Card not found</h2>
        <p className="text-gray-600 mb-4">The card you're looking for doesn't exist or you don't have access to it.</p>
        <button
          onClick={() => navigate('/cards')}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cards
        </button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="">
        <button
          onClick={() => navigate('/cards')}
          className="inline-flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cards
        </button>
      </PageHeader>

      <CardHeader card={card} onEdit={handleEdit} onDelete={handleDelete} />
      {/* Current Cycle Summary */}
      <CycleSummary
        milestone={card.milestone_amount}
        spent={stats.totalSpent}
        cycleEndMonth={stats.cycleMonths[stats.cycleMonths.length - 1] || ''}
      />
      <MonthlySpendTable
        cardId={card.id}
        cycleMonths={stats.cycleMonths}
        onSpendUpdate={handleSpendUpdate}
      />
    </div>
  );
}