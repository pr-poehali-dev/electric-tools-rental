
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Loader2, UserPlus } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [isValidated, setIsValidated] = useState(false);
  
  const { register, isAuthenticated, isLoading, error } = useAuth();
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
  
  // Валидация формы при изменении полей
  useEffect(() => {
    const isAllFieldsValid = 
      name.trim() !== '' && 
      email.trim() !== '' && 
      password.trim() !== '' && 
      confirmPassword.trim() !== '' && 
      password === confirmPassword;
    
    setIsValidated(isAllFieldsValid);
  }, [name, email, password, confirmPassword]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    
    if (!isValidated) {
      setLocalError('Пожалуйста, заполните все поля корректно');
      return;
    }
    
    if (password !== confirmPassword) {
      setLocalError('Пароли не совпадают');
      return;
    }
    
    try {
      const success = await register({
        name,
        email,
        password,
        phone: phone || undefined
      });
      
      if (success) {
        // Перенаправление выполняется через useEffect при изменении isAuthenticated
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при регистрации';
      setLocalError(errorMessage);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Создание аккаунта</CardTitle>
            <CardDescription>
              Зарегистрируйтесь для доступа ко всем возможностям сервиса
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
                <Label htmlFor="name">Имя</Label>
                <Input
                  id="name"
                  placeholder="Иван Иванов"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
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
                <Label htmlFor="phone">Телефон (необязательно)</Label>
                <Input
                  id="phone"
                  placeholder="+7 (999) 123-45-67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Подтвердите пароль</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                {password !== confirmPassword && confirmPassword && (
                  <p className="text-sm text-red-500">Пароли не совпадают</p>
                )}
              </div>
              
              <p className="text-xs text-gray-500">
                Регистрируясь, вы соглашаетесь с{' '}
                <Link to="/terms" className="text-primary hover:underline">
                  условиями использования
                </Link>{' '}
                и{' '}
                <Link to="/privacy" className="text-primary hover:underline">
                  политикой конфиденциальности
                </Link>.
              </p>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full flex items-center gap-2" 
                disabled={isLoading || !isValidated}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Регистрация...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    Зарегистрироваться
                  </>
                )}
              </Button>
              
              <div className="text-center text-sm">
                Уже есть аккаунт?{' '}
                <Link to="/login" className="text-primary hover:underline">
                  Войти
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

export default Register;
