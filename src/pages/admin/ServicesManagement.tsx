
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { servicesApi } from '@/lib/api';
import { BookingService } from '@/types/types';
import { serviceCategories } from '@/data/mockServices';
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
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  Clock,
  Loader2,
  FilterX,
  CheckCircle2,
  XCircle,
  Filter
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';

const ServicesManagement = () => {
  const [services, setServices] = useState<BookingService[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBulkActionDialogOpen, setIsBulkActionDialogOpen] = useState(false);
  
  const [currentService, setCurrentService] = useState<BookingService | null>(null);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [bulkAction, setBulkAction] = useState<'available' | 'unavailable'>('available');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    duration: '',
    available: true
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  
  // Загрузка услуг
  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await servicesApi.getAll();
        setServices(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Не удалось загрузить услуги';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchServices();
  }, []);
  
  // Фильтрация услуг
  const filteredServices = services.filter(service => 
    (selectedCategory ? service.category === selectedCategory : true) &&
    (service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     service.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Обработчик изменения полей формы
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Обработчик изменения доступности услуги
  const handleAvailabilityChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, available: checked }));
  };
  
  // Обработчик изменения категории
  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };
  
  // Открытие диалога добавления услуги
  const openAddDialog = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image: '',
      category: '',
      duration: '',
      available: true
    });
    setIsAddDialogOpen(true);
  };
  
  // Открытие диалога редактирования услуги
  const openEditDialog = (service: BookingService) => {
    setCurrentService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      image: service.image,
      category: service.category,
      duration: service.duration.toString(),
      available: service.available
    });
    setIsEditDialogOpen(true);
  };
  
  // Открытие диалога удаления услуги
  const openDeleteDialog = (service: BookingService) => {
    setCurrentService(service);
    setIsDeleteDialogOpen(true);
  };
  
  // Открытие диалога массового действия
  const openBulkActionDialog = () => {
    if (selectedServices.length === 0) {
      toast({
        title: "Не выбраны услуги",
        description: "Выберите хотя бы одну услугу для выполнения массового действия",
        variant: "destructive"
      });
      return;
    }
    
    setIsBulkActionDialogOpen(true);
  };
  
  // Выбор/отмена выбора всех услуг
  const toggleSelectAll = () => {
    if (selectedServices.length === filteredServices.length) {
      setSelectedServices([]);
    } else {
      setSelectedServices(filteredServices.map(service => service.id));
    }
  };
  
  // Выбор/отмена выбора одной услуги
  const toggleSelectService = (id: number) => {
    if (selectedServices.includes(id)) {
      setSelectedServices(selectedServices.filter(serviceId => serviceId !== id));
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };
  
  // Создание новой услуги
  const handleAddService = async () => {
    if (!formData.name || !formData.price || !formData.duration || !formData.category) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newService = await servicesApi.create({
        name: formData.name,
        description: formData.description,
        price: parseInt(formData.price),
        image: formData.image || "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=800&auto=format&fit=crop",
        category: formData.category,
        duration: parseInt(formData.duration),
        available: formData.available
      });
      
      // Обновляем список услуг
      setServices([...services, newService]);
      
      toast({
        title: "Услуга добавлена",
        description: `Услуга "${newService.name}" успешно добавлена`
      });
      
      setIsAddDialogOpen(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Не удалось создать услугу';
      toast({
        title: "Ошибка",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Обновление услуги
  const handleEditService = async () => {
    if (!currentService) return;
    
    if (!formData.name || !formData.price || !formData.duration || !formData.category) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const updatedService = await servicesApi.update(currentService.id, {
        name: formData.name,
        description: formData.description,
        price: parseInt(formData.price),
        image: formData.image,
        category: formData.category,
        duration: parseInt(formData.duration),
        available: formData.available
      });
      
      // Обновляем список услуг
      setServices(services.map(service => 
        service.id === currentService.id ? updatedService : service
      ));
      
      toast({
        title: "Услуга обновлена",
        description: `Услуга "${updatedService.name}" успешно обновлена`
      });
      
      setIsEditDialogOpen(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Не удалось обновить услугу';
      toast({
        title: "Ошибка",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Удаление услуги
  const handleDeleteService = async () => {
    if (!currentService) return;
    
    setIsSubmitting(true);
    
    try {
      const success = await servicesApi.delete(currentService.id);
      
      if (success) {
        // Обновляем список услуг
        setServices(services.filter(service => service.id !== currentService.id));
        
        // Если услуга была выбрана, удаляем её из выбранных
        if (selectedServices.includes(currentService.id)) {
          setSelectedServices(selectedServices.filter(id => id !== currentService.id));
        }
        
        toast({
          title: "Услуга удалена",
          description: `Услуга "${currentService.name}" успешно удалена`
        });
      }
      
      setIsDeleteDialogOpen(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Не удалось удалить услугу';
      toast({
        title: "Ошибка",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Массовое обновление доступности услуг
  const handleBulkAction = async () => {
    setIsSubmitting(true);
    
    try {
      const success = await servicesApi.bulkUpdateAvailability(
        selectedServices, 
        bulkAction === 'available'
      );
      
      if (success) {
        // Обновляем список услуг
        setServices(services.map(service => 
          selectedServices.includes(service.id)
            ? { ...service, available: bulkAction === 'available' }
            : service
        ));
        
        toast({
          title: "Услуги обновлены",
          description: `${selectedServices.length} услуг успешно обновлены`
        });
        
        // Сбрасываем выбранные услуги
        setSelectedServices([]);
      }
      
      setIsBulkActionDialogOpen(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Не удалось обновить услуги';
      toast({
        title: "Ошибка",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Сброс фильтров
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
  };
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">Управление услугами</h1>
            <p className="text-gray-600">Добавление, редактирование и удаление услуг для бронирования</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={openBulkActionDialog} variant="outline" disabled={selectedServices.length === 0}>
              Массовое действие ({selectedServices.length})
            </Button>
            <Button onClick={openAddDialog} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Добавить услугу
            </Button>
          </div>
        </div>
        
        {/* Фильтры */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Поиск */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                className="pl-10"
                placeholder="Поиск по названию или описанию..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Фильтр по категории */}
            <div>
              <Select 
                value={selectedCategory || ''} 
                onValueChange={(value) => setSelectedCategory(value || null)}
              >
                <SelectTrigger>
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2 text-gray-500" />
                    <SelectValue placeholder="Все категории" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Все категории</SelectItem>
                  {serviceCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Кнопка сброса фильтров */}
            <div>
              <Button 
                variant="outline" 
                className="w-full flex items-center gap-2"
                onClick={resetFilters}
                disabled={!searchQuery && !selectedCategory}
              >
                <FilterX className="h-4 w-4" />
                Сбросить фильтры
              </Button>
            </div>
          </div>
        </div>
        
        {/* Ошибка загрузки */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* Таблица услуг */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-gray-600">Загрузка услуг...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox 
                        checked={filteredServices.length > 0 && selectedServices.length === filteredServices.length}
                        onCheckedChange={toggleSelectAll}
                        aria-label="Выбрать все"
                      />
                    </TableHead>
                    <TableHead>Название</TableHead>
                    <TableHead>Категория</TableHead>
                    <TableHead>Длительность</TableHead>
                    <TableHead>Цена</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServices.length > 0 ? (
                    filteredServices.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell>
                          <Checkbox 
                            checked={selectedServices.includes(service.id)}
                            onCheckedChange={() => toggleSelectService(service.id)}
                            aria-label={`Выбрать ${service.name}`}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{service.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-[200px]">
                            {service.description}
                          </div>
                        </TableCell>
                        <TableCell>{service.category}</TableCell>
                        <TableCell>
                          <div className="flex items-center text-gray-600">
                            <Clock className="h-4 w-4 mr-1" />
                            {service.duration < 60 
                              ? `${service.duration} мин.` 
                              : `${Math.floor(service.duration / 60)} ч. ${service.duration % 60 ? `${service.duration % 60} мин.` : ''}`}
                          </div>
                        </TableCell>
                        <TableCell>{service.price.toLocaleString()} ₽</TableCell>
                        <TableCell>
                          {service.available ? (
                            <div className="flex items-center text-green-600">
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              <span>Доступно</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-red-600">
                              <XCircle className="h-4 w-4 mr-1" />
                              <span>Недоступно</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-primary"
                              onClick={() => openEditDialog(service)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-red-600"
                              onClick={() => openDeleteDialog(service)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        {searchQuery || selectedCategory 
                          ? 'Услуги не найдены. Попробуйте изменить параметры фильтрации.'
                          : 'Список услуг пуст. Добавьте первую услугу, нажав на кнопку "Добавить услугу".'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
        
        {/* Диалог добавления услуги */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Добавить услугу</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="name">Название*</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Например: Консультация по выбору инструмента"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Подробное описание услуги"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="category">Категория*</Label>
                  <Select value={formData.category} onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="duration">Длительность (мин.)*</Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="Например: 60"
                    min="1"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="price">Цена (₽)*</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Например: 1500"
                    min="1"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="available">Доступность</Label>
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch
                      id="available"
                      checked={formData.available}
                      onCheckedChange={handleAvailabilityChange}
                    />
                    <Label htmlFor="available" className="cursor-pointer">
                      {formData.available ? 'Доступно для бронирования' : 'Недоступно для бронирования'}
                    </Label>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="image">Изображение (URL)</Label>
                <Input
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-gray-500">
                  Если поле пустое, будет использовано изображение по умолчанию
                </p>
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
                onClick={handleAddService}
                disabled={isSubmitting || !formData.name || !formData.price || !formData.duration || !formData.category}
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
        
        {/* Диалог редактирования услуги */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Редактировать услугу</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="edit-name">Название*</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="edit-description">Описание</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="edit-category">Категория*</Label>
                  <Select value={formData.category} onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="edit-duration">Длительность (мин.)*</Label>
                  <Input
                    id="edit-duration"
                    name="duration"
                    type="number"
                    value={formData.duration}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="edit-price">Цена (₽)*</Label>
                  <Input
                    id="edit-price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="edit-available">Доступность</Label>
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch
                      id="edit-available"
                      checked={formData.available}
                      onCheckedChange={handleAvailabilityChange}
                    />
                    <Label htmlFor="edit-available" className="cursor-pointer">
                      {formData.available ? 'Доступно для бронирования' : 'Недоступно для бронирования'}
                    </Label>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="edit-image">Изображение (URL)</Label>
                <Input
                  id="edit-image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                />
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
                onClick={handleEditService}
                disabled={isSubmitting || !formData.name || !formData.price || !formData.duration || !formData.category}
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
        
        {/* Диалог удаления услуги */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Удалить услугу</DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <p className="text-gray-700">
                Вы уверены, что хотите удалить услугу "{currentService?.name}"?
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Это действие невозможно отменить. Все существующие бронирования этой услуги также будут затронуты.
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
                onClick={handleDeleteService}
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
        
        {/* Диалог массового действия */}
        <Dialog open={isBulkActionDialogOpen} onOpenChange={setIsBulkActionDialogOpen}>
          <DialogContent className="max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Массовое действие</DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <p className="text-gray-700 mb-4">
                Выбрано услуг: <strong>{selectedServices.length}</strong>
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="make-available"
                    name="bulk-action"
                    checked={bulkAction === 'available'}
                    onChange={() => setBulkAction('available')}
                  />
                  <Label htmlFor="make-available">Сделать доступными для бронирования</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="make-unavailable"
                    name="bulk-action"
                    checked={bulkAction === 'unavailable'}
                    onChange={() => setBulkAction('unavailable')}
                  />
                  <Label htmlFor="make-unavailable">Сделать недоступными для бронирования</Label>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsBulkActionDialogOpen(false)}
                disabled={isSubmitting}
              >
                Отмена
              </Button>
              <Button 
                onClick={handleBulkAction}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Обработка...
                  </>
                ) : (
                  'Применить'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default ServicesManagement;
