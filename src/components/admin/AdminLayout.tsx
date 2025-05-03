
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Проверка прав доступа при монтировании компонента
  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
    }
  }, [isAdmin, navigate]);
  
  const navigationItems = [
    { name: 'Дашборд', path: '/admin/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: 'Управление инструментами', path: '/admin/tools', icon: <Package className="h-5 w-5" /> },
    { name: 'Управление пользователями', path: '/admin/users', icon: <Users className="h-5 w-5" /> },
    { name: 'Управление заказами', path: '/admin/orders', icon: <ShoppingCart className="h-5 w-5" /> },
    { name: 'Управление бронированиями', path: '/admin/bookings', icon: <Calendar className="h-5 w-5" /> },
  ];
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  if (!isAdmin) {
    return null; // useEffect перенаправит на страницу входа
  }
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Верхняя панель */}
      <header className="bg-white shadow-sm z-10">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden mr-2"
              onClick={toggleSidebar}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <Link to="/admin/dashboard" className="text-xl font-bold text-primary">
              Панель администратора
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/')}
              className="hidden md:flex"
            >
              На сайт
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                      {user?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/')}>
                  На сайт
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  Личный кабинет
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Выйти
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1">
        {/* Боковая панель */}
        <aside 
          className={`
            bg-white shadow-md w-64 fixed inset-y-0 mt-16 z-30 transition-transform duration-300 md:translate-x-0
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <div className="pt-5 pb-4 flex flex-col h-[calc(100%-4rem)]">
            <div className="md:hidden px-4 mb-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="float-right"
                onClick={toggleSidebar}
              >
                <X className="h-6 w-6" />
              </Button>
              <div className="clear-both"></div>
            </div>
            
            <nav className="flex-1 px-2 space-y-1">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      group flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                      ${isActive 
                        ? 'bg-primary text-white' 
                        : 'text-gray-700 hover:bg-gray-100'}
                    `}
                    onClick={() => {
                      if (window.innerWidth < 768) {
                        setIsSidebarOpen(false);
                      }
                    }}
                  >
                    <span className={`mr-3 ${isActive ? 'text-white' : 'text-gray-500'}`}>
                      {item.icon}
                    </span>
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            
            <div className="px-3 py-4 border-t">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full flex items-center justify-center gap-2"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Выйти
              </Button>
            </div>
          </div>
        </aside>
        
        {/* Мобильное затемнение для закрытия сайдбара */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        {/* Основной контент */}
        <main className="flex-1 ml-0 md:ml-64 transition-all duration-300">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
