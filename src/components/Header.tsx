
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { Badge } from '@/components/ui/badge';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { totalItems } = useCart();

  const isActive = (path: string) => {
    return location.pathname === path;
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
            <Button variant="secondary">Войти</Button>
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
            <div className="pt-2">
              <Button variant="secondary" className="w-full">Войти</Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
