import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { Cards } from './pages/Cards';
import { NewCard } from './pages/NewCard';
import { CardDetail } from './pages/CardDetail';
import { EditCard } from './pages/EditCard';
import { BudgetProvider } from './contexts/BudgetContext';
import Finances from './pages/Finances';

function App() {
  return (
    <AuthProvider>
      <BudgetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="cards" element={<Cards />} />
            <Route path="cards/new" element={<NewCard />} />
            <Route path="cards/:id" element={<CardDetail />} />
            <Route path="cards/:id/edit" element={<EditCard />} />
              <Route path="finances" element={<Finances />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      </BudgetProvider>
    </AuthProvider>
  );
}

export default App;