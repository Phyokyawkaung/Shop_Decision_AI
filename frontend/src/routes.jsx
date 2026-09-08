import { Routes, Route } from 'react-router-dom';
import App from './App';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Analysis from './pages/Analysis';
import Inventory from './pages/Inventory';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="analysis" element={<Analysis />} />
        <Route path="inventory" element={<Inventory />} />
      </Route>
    </Routes>
  );
}
