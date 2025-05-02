
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            <Link to="/" className="hover:text-gray-200 transition">Главная</Link>
            <Link to="/catalog" className="hover:text-gray-200 transition">Каталог</Link>
            <Link to="/about" className="hover:text-gray-200 transition">О нас</Link>
            <Link to="/contacts" className="hover:text-gray-200 transition">Контакты</Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="text-white hover:bg-primary/80">
                <ShoppingCart className="h-6 w-6" />
              </Button>
            </Link>
            <Button variant="secondary">Войти</Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Link to="/cart" className="mr-3">
              <Button variant="ghost" size="icon" className="text-white hover:bg-primary/80">
                <ShoppingCart className="h-6 w-6" />
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
              className="block px-3 py-2 hover:bg-primary/80 rounded transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Главная
            </Link>
            <Link 
              to="/catalog" 
              className="block px-3 py-2 hover:bg-primary/80 rounded transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Каталог
            </Link>
            <Link 
              to="/about" 
              className="block px-3 py-2 hover:bg-primary/80 rounded transition"
              onClick={() => setIsMenuOpen(false)}
            >
              О нас
            </Link>
            <Link 
              to="/contacts" 
              className="block px-3 py-2 hover:bg-primary/80 rounded transition"
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
