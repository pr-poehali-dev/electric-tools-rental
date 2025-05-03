
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Menu, X, User, LogIn, Calendar } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const navigationItems = [
    { name: 'Главная', path: '/' },
    { name: 'Каталог', path: '/catalog' },
    { name: 'Услуги', path: '/services' },
    { name: 'О нас', path: '/about' },
    { name: 'Контакты', path: '/contacts' },
  ];
  
  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Логотип */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold text-primary">ИнструментПро</Link>
          </div>
          
          {/* Навигация для десктопа */}
          <nav className="hidden md:flex space-x-6">
            {navigationItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path}
                className="text-gray-700 hover:text-primary transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          {/* Правая часть панели навигации */}
          <div className="flex items-center space-x-2">
            {/* Корзина */}
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center" 
                    variant="destructive"
                  >
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>
            
            {/* Бронирования (для аутентифицированных пользователей) */}
            {isAuthenticated && (
              <Link to="/profile?tab=bookings">
                <Button variant="ghost" size="icon">
                  <Calendar className="h-5 w-5" />
                </Button>
              </Link>
            )}
            
            {/* Профиль пользователя */}
            {isAuthenticated ? (
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
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Личный кабинет
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate('/admin/dashboard')}>
                      Админ-панель
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Выйти
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/login')}
              >
                <LogIn className="h-5 w-5" />
              </Button>
            )}
            
            {/* Кнопка мобильного меню */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={toggleMobileMenu}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Мобильное меню */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="bg-white h-full w-4/5 max-w-xs p-5 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <Link to="/" className="text-xl font-bold text-primary" onClick={closeMobileMenu}>
                ИнструментПро
              </Link>
              <Button variant="ghost" size="icon" onClick={closeMobileMenu}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            
            <nav className="space-y-4">
              {navigationItems.map((item) => (
                <Link 
                  key={item.path} 
                  to={item.path}
                  className="block py-2 text-gray-700 hover:text-primary transition-colors duration-200"
                  onClick={closeMobileMenu}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="pt-4 border-t">
                {isAuthenticated ? (
                  <>
                    <Link 
                      to="/profile"
                      className="flex items-center py-2 text-gray-700 hover:text-primary"
                      onClick={closeMobileMenu}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Личный кабинет
                    </Link>
                    {isAdmin && (
                      <Link 
                        to="/admin/dashboard"
                        className="flex items-center py-2 text-gray-700 hover:text-primary"
                        onClick={closeMobileMenu}
                      >
                        Админ-панель
                      </Link>
                    )}
                    <button 
                      className="flex items-center py-2 text-gray-700 hover:text-primary w-full text-left"
                      onClick={() => {
                        handleLogout();
                        closeMobileMenu();
                      }}
                    >
                      Выйти
                    </button>
                  </>
                ) : (
                  <Link 
                    to="/login"
                    className="flex items-center py-2 text-gray-700 hover:text-primary"
                    onClick={closeMobileMenu}
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Войти / Зарегистрироваться
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
