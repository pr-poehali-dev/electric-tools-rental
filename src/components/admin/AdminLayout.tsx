
import { ReactNode } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingBag, 
  Settings, 
  LogOut,
  ChevronLeft
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const navigate = useNavigate();
  
  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  // Если пользователь не админ, перенаправляем на главную
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Боковая панель */}
      <aside className="w-full md:w-64 bg-gray-900 text-white">
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-xl font-bold">Админ-панель</h2>
          <p className="text-gray-400 text-sm">Привет, {user?.name}</p>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link to="/admin/dashboard" className="flex items-center gap-3 p-2 rounded hover:bg-gray-800 transition">
                <LayoutDashboard className="h-5 w-5" />
                Дашборд
              </Link>
            </li>
            <li>
              <Link to="/admin/tools" className="flex items-center gap-3 p-2 rounded hover:bg-gray-800 transition">
                <Package className="h-5 w-5" />
                Инструменты
              </Link>
            </li>
            <li>
              <Link to="/admin/orders" className="flex items-center gap-3 p-2 rounded hover:bg-gray-800 transition">
                <ShoppingBag className="h-5 w-5" />
                Заказы
              </Link>
            </li>
            <li>
              <Link to="/admin/users" className="flex items-center gap-3 p-2 rounded hover:bg-gray-800 transition">
                <Users className="h-5 w-5" />
                Пользователи
              </Link>
            </li>
            <li>
              <Link to="/admin/settings" className="flex items-center gap-3 p-2 rounded hover:bg-gray-800 transition">
                <Settings className="h-5 w-5" />
                Настройки
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="p-4 mt-auto">
          <Button 
            variant="outline" 
            className="w-full flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white border-gray-700"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Выйти
          </Button>
          
          <Link to="/" className="mt-4 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition">
            <ChevronLeft className="h-4 w-4" />
            На сайт
          </Link>
        </div>
      </aside>
      
      {/* Основной контент */}
      <main className="flex-grow bg-gray-100 min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
