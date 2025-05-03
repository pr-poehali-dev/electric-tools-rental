
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';

// Страницы
import Index from '@/pages/Index';
import Catalog from '@/pages/Catalog';
import ToolDetail from '@/pages/ToolDetail';
import Cart from '@/pages/Cart';
import About from '@/pages/About';
import Contacts from '@/pages/Contacts';
import NotFound from '@/pages/NotFound';

// Страницы аутентификации
import Login from '@/pages/Auth/Login';
import Register from '@/pages/Auth/Register';

// Страницы пользователя
import Profile from '@/pages/User/Profile';

// Страницы услуг
import ServicesIndex from '@/pages/Services/ServicesIndex';
import ServiceDetail from '@/pages/Services/ServiceDetail';

// Страницы админки
import Dashboard from '@/pages/admin/Dashboard';
import ToolsManagement from '@/pages/admin/ToolsManagement';
import UsersManagement from '@/pages/admin/UsersManagement';
import OrdersManagement from '@/pages/admin/OrdersManagement';
import BookingsManagement from '@/pages/admin/BookingsManagement';
import ServicesManagement from '@/pages/admin/ServicesManagement';
import APILogs from '@/pages/admin/APILogs';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Основные страницы */}
            <Route path="/" element={<Index />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/catalog/:id" element={<ToolDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/about" element={<About />} />
            <Route path="/contacts" element={<Contacts />} />
            
            {/* Аутентификация */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Профиль пользователя */}
            <Route path="/profile" element={<Profile />} />
            
            {/* Услуги */}
            <Route path="/services" element={<ServicesIndex />} />
            <Route path="/services/:id" element={<ServiceDetail />} />
            
            {/* Админ-панель */}
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/tools" element={<ToolsManagement />} />
            <Route path="/admin/users" element={<UsersManagement />} />
            <Route path="/admin/orders" element={<OrdersManagement />} />
            <Route path="/admin/bookings" element={<BookingsManagement />} />
            <Route path="/admin/services" element={<ServicesManagement />} />
            <Route path="/admin/api-logs" element={<APILogs />} />
            
            {/* Страница не найдена */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
