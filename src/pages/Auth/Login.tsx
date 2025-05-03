
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, Loader2, LogIn } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [localError, setLocalError] = useState('');
  
  const { login, isAuthenticated, isLoading, error } = useAuth();
  const navigate = useNavigate();
  
  // При изменении глобальной ошибки обновляем локальную
  useEffect(() => {
    if (error) {
      setLocalError(error);
    }
  }, [error]);
  
  // Если пользователь уже аутентифицирован, перенаправляем на главную страницу
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    
    if (!email || !password) {
      setLocalError('Пожалуйста, заполните все поля');
      return;
    }
    
    try {
      const success = await login(email, password);
      
      if (success) {
        // Перенаправление выполняется через useEffect при изменении isAuthenticated
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при входе';
      setLocalError(errorMessage);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Вход в аккаунт</CardTitle>
            <CardDescription>
              Введите ваши учетные данные для доступа к личному кабинету
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {localError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{localError}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@mail.ru"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Пароль</Label>
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Забыли пароль?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember-me" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(!!checked)}
                />
                <Label htmlFor="remember-me" className="text-sm">Запомнить меня</Label>
              </div>
              
              <div className="text-sm text-gray-500">
                <p>Для демо-доступа используйте:</p>
                <p>Email: user@example.com</p>
                <p>Пароль: user123</p>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full flex items-center gap-2" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Вход...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    Войти
                  </>
                )}
              </Button>
              
              <div className="text-center text-sm">
                Еще нет аккаунта?{' '}
                <Link to="/register" className="text-primary hover:underline">
                  Зарегистрироваться
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
