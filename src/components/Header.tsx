
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { isAuthenticated, isAdmin, logout, user } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src="/public/logo-b.svg" alt="ЭлектроПрокат" className="h-10 w-10" />
            <span className="text-xl font-bold">ЭлектроПрокат</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`hover:text-gray-200 transition ${isActive('/') ? 'font-semibold' : ''}`}
            >
              Главная
            </Link>
            <Link 
              to="/catalog" 
              className={`hover:text-gray-200 transition ${isActive('/catalog') ? 'font-semibold' : ''}`}
            >
              Каталог
            </Link>
            <Link 
              to="/about" 
              className={`hover:text-gray-200 transition ${isActive('/about') ? 'font-semibold' : ''}`}
            >
              О нас
            </Link>
            <Link 
              to="/contacts" 
              className={`hover:text-gray-200 transition ${isActive('/contacts') ? 'font-semibold' : ''}`}
            >
              Контакты
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" className="text-white hover:bg-primary/80">
                <ShoppingCart className="h-6 w-6" />
                {totalItems > 0 && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 px-1.5 py-0.5 min-w-[1.5rem] flex items-center justify-center">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:bg-primary/80 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {user?.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Мой аккаунт</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate('/admin/dashboard')}>
                      Админ-панель
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout}>
                    Выйти
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="secondary"
                onClick={() => navigate('/admin/login')}
                className="flex items-center gap-2"
              >
                <LogIn className="h-4 w-4" />
                Войти
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Link to="/cart" className="mr-3 relative">
              <Button variant="ghost" size="icon" className="text-white hover:bg-primary/80">
                <ShoppingCart className="h-6 w-6" />
                {totalItems > 0 && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 px-1.5 py-0.5 min-w-[1.5rem] flex items-center justify-center">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:bg-primary/80"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-3 space-y-3">
            <Link 
              to="/" 
              className={`block px-3 py-2 hover:bg-primary/80 rounded transition ${isActive('/') ? 'font-semibold' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Главная
            </Link>
            <Link 
              to="/catalog" 
              className={`block px-3 py-2 hover:bg-primary/80 rounded transition ${isActive('/catalog') ? 'font-semibold' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Каталог
            </Link>
            <Link 
              to="/about" 
              className={`block px-3 py-2 hover:bg-primary/80 rounded transition ${isActive('/about') ? 'font-semibold' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              О нас
            </Link>
            <Link 
              to="/contacts" 
              className={`block px-3 py-2 hover:bg-primary/80 rounded transition ${isActive('/contacts') ? 'font-semibold' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Контакты
            </Link>
            
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link 
                    to="/admin/dashboard" 
                    className="block px-3 py-2 hover:bg-primary/80 rounded transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Админ-панель
                  </Link>
                )}
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Выйти
                </Button>
              </>
            ) : (
              <Link 
                to="/admin/login" 
                onClick={() => setIsMenuOpen(false)}
              >
                <Button variant="secondary" className="w-full">
                  <LogIn className="mr-2 h-4 w-4" />
                  Войти
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
