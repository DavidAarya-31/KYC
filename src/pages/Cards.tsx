import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Database } from '../lib/supabase';
import { getAnniversaryCycle } from '../utils/cycles';
import { PageHeader } from '../components/PageHeader';
import { CardTile } from '../components/CardTile';

type Card = Database['public']['Tables']['cards']['Row'];

interface CardWithSpending extends Card {
  totalSpent: number;
}

export function Cards() {
  const { user } = useAuth();
  const [cards, setCards] = useState<CardWithSpending[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCards();
    }
  }, [user]);

  const fetchCards = async () => {
    try {
      setLoading(true);
      
      // Fetch all user's cards
      const { data: cardsData, error: cardsError } = await supabase
        .from('cards')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (cardsError) throw cardsError;

      // Calculate spending for each card
      const cardsWithSpending: CardWithSpending[] = [];
      
      for (const card of cardsData || []) {
        // Get anniversary cycle for this card
        const cycle = getAnniversaryCycle(card.anniversary_month);
        
        // Fetch spending data for this cycle
        const { data: spends, error: spendsError } = await supabase
          .from('monthly_spends')
          .select('amount_spent')
          .eq('card_id', card.id)
          .in('month', cycle.months);

        if (spendsError) throw spendsError;

        const totalSpent = spends?.reduce((sum, spend) => sum + spend.amount_spent, 0) || 0;
        
        cardsWithSpending.push({
          ...card,
          totalSpent,
        });
      }

      setCards(cardsWithSpending);
    } catch (error) {
      console.error('Error fetching cards:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <PageHeader title="Your Cards">
          <Link
            to="/cards/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Card
          </Link>
        </PageHeader>
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Your Cards">
        <Link
          to="/cards/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Card
        </Link>
      </PageHeader>

      {cards.length === 0 ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400 mx-auto mt-1" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No cards yet</h3>
            <p className="text-gray-600 mb-6">
              Add your first credit card to start tracking milestones and spending.
            </p>
            <Link
              to="/cards/new"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Card
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <CardTile key={card.id} card={card} spent={card.totalSpent} />
          ))}
        </div>
      )}
    </div>
  );
}