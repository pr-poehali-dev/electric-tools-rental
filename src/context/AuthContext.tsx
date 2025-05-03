
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/types';
import { userApi } from '@/lib/api';

interface AuthContextProps {
  user: User | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: { email: string, password: string, name: string, phone?: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Проверяем наличие сохраненной сессии при загрузке
  useEffect(() => {
    const loadUserSession = async () => {
      const storedToken = localStorage.getItem('auth_token');
      
      if (storedToken) {
        try {
          setIsLoading(true);
          const userData = await userApi.getCurrentUser(storedToken);
          
          if (userData) {
            setUser(userData);
            setToken(storedToken);
          } else {
            // Токен недействителен, удаляем его
            localStorage.removeItem('auth_token');
          }
        } catch (err) {
          console.error('Failed to restore user session:', err);
          localStorage.removeItem('auth_token');
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    
    loadUserSession();
  }, []);
  
  // Проверка роли администратора
  const isAdmin = !!user && user.role === 'admin';
  
  // Проверка аутентификации
  const isAuthenticated = !!user;
  
  // Регистрация нового пользователя
  const register = async (userData: { email: string, password: string, name: string, phone?: string }): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newUser = await userApi.register(userData);
      
      // Автоматический вход после регистрации
      const { token } = await userApi.login(userData.email, userData.password);
      
      setUser(newUser);
      setToken(token);
      
      // Сохраняем токен в localStorage
      localStorage.setItem('auth_token', token);
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при регистрации';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Вход в систему
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { user: userData, token: authToken } = await userApi.login(email, password);
      
      setUser(userData);
      setToken(authToken);
      
      // Сохраняем токен в localStorage
      localStorage.setItem('auth_token', authToken);
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при входе';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Выход из системы
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
  };
  
  // Обновление профиля пользователя
  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) {
      setError('Пользователь не аутентифицирован');
      return false;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedUser = await userApi.updateProfile(user.id, updates);
      setUser(updatedUser);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при обновлении профиля';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Изменение пароля
  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!user) {
      setError('Пользователь не аутентифицирован');
      return false;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await userApi.changePassword(user.id, currentPassword, newPassword);
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при изменении пароля';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider value={{
      user,
      isAdmin,
      isAuthenticated,
      isLoading,
      error,
      login,
      register,
      logout,
      updateProfile,
      changePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
