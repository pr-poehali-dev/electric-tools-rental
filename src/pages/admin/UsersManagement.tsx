
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { userApi } from '@/lib/api';
import { User } from '@/types/types';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Search, 
  UserPlus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Loader2
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

const UsersManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user' as 'admin' | 'user',
    password: '',
    confirmPassword: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  
  // Загрузка пользователей
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await userApi.getAllUsers();
        setUsers(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Не удалось загрузить пользователей';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  // Фильтрация пользователей по поисковому запросу
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.phone && user.phone.includes(searchQuery))
  );
  
  // Обработчик изменения полей формы
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Обработчик изменения роли пользователя
  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, role: value as 'admin' | 'user' }));
  };
  
  // Открытие диалога добавления пользователя
  const openAddDialog = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'user',
      password: '',
      confirmPassword: ''
    });
    setIsAddDialogOpen(true);
  };
  
  // Открытие диалога редактирования пользователя
  const openEditDialog = (user: User) => {
    setCurrentUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      password: '',
      confirmPassword: ''
    });
    setIsEditDialogOpen(true);
  };
  
  // Открытие диалога удаления пользователя
  const openDeleteDialog = (user: User) => {
    setCurrentUser(user);
    setIsDeleteDialogOpen(true);
  };
  
  // Добавление нового пользователя
  const handleAddUser = async () => {
    // Проверка на совпадение паролей
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Ошибка",
        description: "Пароли не совпадают",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newUser = await userApi.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined
      });
      
      // Обновляем список пользователей
      setUsers(prevUsers => [...prevUsers, newUser]);
      
      toast({
        title: "Пользователь добавлен",
        description: `Пользователь ${newUser.name} успешно создан`
      });
      
      setIsAddDialogOpen(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Не удалось создать пользователя';
      toast({
        title: "Ошибка",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Редактирование пользователя
  const handleEditUser = async () => {
    if (!currentUser) return;
    
    setIsSubmitting(true);
    
    try {
      const updatedUser = await userApi.updateProfile(currentUser.id, {
        name: formData.name,
        phone: formData.phone || undefined,
        role: formData.role
      });
      
      // Обновляем список пользователей
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === currentUser.id ? updatedUser : user
        )
      );
      
      toast({
        title: "Пользователь обновлен",
        description: `Данные пользователя ${updatedUser.name} успешно обновлены`
      });
      
      setIsEditDialogOpen(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Не удалось обновить пользователя';
      toast({
        title: "Ошибка",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Удаление пользователя
  const handleDeleteUser = async () => {
    if (!currentUser) return;
    
    setIsSubmitting(true);
    
    try {
      // В реальном приложении здесь был бы API-запрос на удаление
      // Для демо просто удаляем из локального состояния
      setUsers(prevUsers => prevUsers.filter(user => user.id !== currentUser.id));
      
      toast({
        title: "Пользователь удален",
        description: `Пользователь ${currentUser.name} успешно удален`
      });
      
      setIsDeleteDialogOpen(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Не удалось удалить пользователя';
      toast({
        title: "Ошибка",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Управление пользователями</h1>
            <p className="text-gray-600">Добавление, редактирование и управление пользователями системы</p>
          </div>
          <Button onClick={openAddDialog} className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Добавить пользователя
          </Button>
        </div>
        
        {/* Поиск */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              className="pl-10"
              placeholder="Поиск по имени, email или телефону..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Ошибка загрузки */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* Таблица пользователей */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-gray-600">Загрузка пользователей...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Пользователь</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Телефон</TableHead>
                  <TableHead>Роль</TableHead>
                  <TableHead>Дата регистрации</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>{user.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone || '-'}</TableCell>
                      <TableCell>
                        {user.role === 'admin' ? (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                            Администратор
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            Пользователь
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => openEditDialog(user)}
                            className="h-8 w-8 text-gray-600"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => openDeleteDialog(user)}
                            className="h-8 w-8 text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      {searchQuery ? 'Пользователи не найдены' : 'Список пользователей пуст'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
        
        {/* Диалог добавления пользователя */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Добавить пользователя</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="name">Имя</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Иван Иванов"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="example@mail.ru"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="phone">Телефон (необязательно)</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+7 (999) 123-45-67"
                />
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="role">Роль</Label>
                <Select value={formData.role} onValueChange={handleRoleChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Пользователь</SelectItem>
                    <SelectItem value="admin">Администратор</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="confirmPassword">Подтверждение пароля</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                />
                {formData.password !== formData.confirmPassword && formData.confirmPassword && (
                  <p className="text-sm text-red-500">Пароли не совпадают</p>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsAddDialogOpen(false)}
                disabled={isSubmitting}
              >
                Отмена
              </Button>
              <Button 
                onClick={handleAddUser}
                disabled={isSubmitting || 
                  !formData.name || 
                  !formData.email || 
                  !formData.password || 
                  formData.password !== formData.confirmPassword}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Добавление...
                  </>
                ) : (
                  'Добавить'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Диалог редактирования пользователя */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Редактировать пользователя</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="edit-name">Имя</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled
                />
                <p className="text-xs text-gray-500">Email нельзя изменить</p>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="edit-phone">Телефон</Label>
                <Input
                  id="edit-phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="edit-role">Роль</Label>
                <Select value={formData.role} onValueChange={handleRoleChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Пользователь</SelectItem>
                    <SelectItem value="admin">Администратор</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
                disabled={isSubmitting}
              >
                Отмена
              </Button>
              <Button 
                onClick={handleEditUser}
                disabled={isSubmitting || !formData.name}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Сохранение...
                  </>
                ) : (
                  'Сохранить'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Диалог удаления пользователя */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Удалить пользователя</DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <p className="text-gray-700">
                Вы уверены, что хотите удалить пользователя "{currentUser?.name}"?
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Это действие невозможно отменить. Все данные пользователя будут удалены.
              </p>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={isSubmitting}
              >
                Отмена
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteUser}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Удаление...
                  </>
                ) : (
                  'Удалить'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default UsersManagement;
