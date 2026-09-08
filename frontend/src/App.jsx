import { createContext, useContext, useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';

const AppContext = createContext(null);

export function useAppContext() {
  const ctx = useContext(AppContext);

  if (!ctx) {
    throw new Error('useAppContext must be used within AppProvider');
  }

  return ctx;
}

function AppProvider({ children }) {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [analysisDefaults, setAnalysisDefaults] = useState({
    quantity: 100,
    selling_price_mmk: 8500,
    urgency: 'normal',
  });

  const value = useMemo(
    () => ({
      selectedProduct,
      setSelectedProduct,
      analysisDefaults,
      setAnalysisDefaults,
    }),
    [selectedProduct, analysisDefaults],
  );

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-transparent text-white">

        <Navbar />

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </main>

        <footer className="mt-10 border-t border-[#dcd5e2] bg-[#ebe6ef] py-6 text-center text-sm text-[#756d7c]">
          ShopAI &copy; {new Date().getFullYear()}
        </footer>

      </div>
    </AppProvider>
  );
}