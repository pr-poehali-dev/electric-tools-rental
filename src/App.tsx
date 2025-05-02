
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Index from './pages/Index';
import Catalog from './pages/Catalog';
import ToolDetail from './pages/ToolDetail';
import Cart from './pages/Cart';
import About from './pages/About';
import Contacts from './pages/Contacts';
import NotFound from './pages/NotFound';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ToolsManagement from './pages/admin/ToolsManagement';
import OrdersManagement from './pages/admin/OrdersManagement';
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Пользовательские маршруты */}
        <Route path="/" element={<Index />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/tool/:id" element={<ToolDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/about" element={<About />} />
        <Route path="/contacts" element={<Contacts />} />
        
        {/* Административные маршруты */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/tools" element={<ToolsManagement />} />
        <Route path="/admin/orders" element={<OrdersManagement />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        
        {/* Маршруты ошибок */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
