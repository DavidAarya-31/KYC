import { DashboardSummary } from '../components/DashboardSummary';
import { PageHeader } from '../components/PageHeader';
import { useState } from 'react';
import { CardsOverview, YourCards } from '../components/DashboardSummary';
import { OverviewSection } from './Finances';

export function Dashboard() {
  return (
    <div>
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Overview of Finances</h2>
        <OverviewSection />
      </div>
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Overview of Cards</h2>
        <CardsOverview />
      </div>
      <div className="mb-10">
        <YourCards />
      </div>
    </div>
  );
}