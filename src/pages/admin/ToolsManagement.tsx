
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { toolCategories } from '@/data/mockTools';
import { Tool } from '@/types/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  Search,
  Check,
  X,
  Loader2
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { toolsApi } from '@/lib/api';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ToolsManagement = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [currentTool, setCurrentTool] = useState<Tool | null>(null);
  const [formData, setFormData] = useState<Partial<Tool>>({
    name: '',
    description: '',
    price: 0,
    image: '',
    category: toolCategories[0],
    available: true
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  
  // Загрузка инструментов при монтировании компонента
  useEffect(() => {
    fetchTools();
  }, []);
  
  // Получение списка инструментов
  const fetchTools = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await toolsApi.getAll();
      setTools(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Не удалось загрузить инструменты';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Поиск по инструментам
  const filteredTools = tools.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Управление формой
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    });
  };
  
  // Открыть диалоговое окно добавления
  const openAddDialog = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      image: 'https://images.unsplash.com/photo-1572981986848-b6f1c98bd336?q=80&w=800&auto=format&fit=crop',
      category: toolCategories[0],
      available: true
    });
    setIsAddDialogOpen(true);
  };
  
  // Открыть диалоговое окно редактирования
  const openEditDialog = (tool: Tool) => {
    setCurrentTool(tool);
    setFormData({ ...tool });
    setIsEditDialogOpen(true);
  };
  
  // Открыть диалоговое окно удаления
  const openDeleteDialog = (tool: Tool) => {
    setCurrentTool(tool);
    setIsDeleteDialogOpen(true);
  };
  
  // Добавить инструмент
  const handleAddTool = async () => {
    setIsSubmitting(true);
    
    try {
      const newTool = await toolsApi.create({
        name: formData.name || '',
        description: formData.description || '',
        price: formData.price || 0,
        image: formData.image || '',
        category: formData.category || toolCategories[0],
        available: formData.available ?? true
      });
      
      setTools([...tools, newTool]);
      setIsAddDialogOpen(false);
      
      toast({
        title: "Инструмент добавлен",
        description: `${newTool.name} успешно добавлен в каталог`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Не удалось добавить инструмент';
      toast({
        title: "Ошибка",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Редактировать инструмент
  const handleEditTool = async () => {
    if (!currentTool) return;
    
    setIsSubmitting(true);
    
    try {
      const updatedTool = await toolsApi.update(currentTool.id, formData);
      
      setTools(tools.map(tool => 
        tool.id === currentTool.id ? updatedTool : tool
      ));
      
      setIsEditDialogOpen(false);
      
      toast({
        title: "Инструмент обновлен",
        description: `${updatedTool.name} успешно обновлен`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Не удалось обновить инструмент';
      toast({
        title: "Ошибка",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Удалить инструмент
  const handleDeleteTool = async () => {
    if (!currentTool) return;
    
    setIsSubmitting(true);
    
    try {
      const success = await toolsApi.delete(currentTool.id);
      
      if (success) {
        setTools(tools.filter(tool => tool.id !== currentTool.id));
        
        toast({
          title: "Инструмент удален",
          description: `${currentTool.name} успешно удален из каталога`,
        });
      } else {
        toast({
          title: "Ошибка",
          description: "Инструмент не найден или уже удален",
          variant: "destructive"
        });
      }
      
      setIsDeleteDialogOpen(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Не удалось удалить инструмент';
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
            <h1 className="text-2xl font-bold mb-2">Управление инструментами</h1>
            <p className="text-gray-600">Добавление, редактирование и удаление инструментов</p>
          </div>
          <Button onClick={openAddDialog} className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Добавить инструмент
          </Button>
        </div>
        
        {/* Поиск */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              className="pl-10"
              placeholder="Поиск по названию или категории..."
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
        
        {/* Таблица инструментов */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-gray-600">Загрузка инструментов...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">ID</TableHead>
                  <TableHead>Название</TableHead>
                  <TableHead>Категория</TableHead>
                  <TableHead className="text-right">Цена (₽/день)</TableHead>
                  <TableHead className="text-center">Доступность</TableHead>
                  <TableHead className="w-36 text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTools.length > 0 ? (
                  filteredTools.map((tool) => (
                    <TableRow key={tool.id}>
                      <TableCell className="font-medium">{tool.id}</TableCell>
                      <TableCell>{tool.name}</TableCell>
                      <TableCell>{tool.category}</TableCell>
                      <TableCell className="text-right">{tool.price}</TableCell>
                      <TableCell className="text-center">
                        {tool.available ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-red-500 mx-auto" />
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => openEditDialog(tool)}
                            className="h-8 w-8 text-gray-600"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => openDeleteDialog(tool)}
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
                      {searchQuery ? 'Инструменты не найдены' : 'Список инструментов пуст'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
        
        {/* Диалоговое окно добавления инструмента */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Добавить инструмент</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="name">Название инструмента</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  placeholder="Например: Перфоратор Bosch GBH 2-26"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  placeholder="Подробное описание инструмента..."
                  rows={3}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="price">Цена в день (₽)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price || 0}
                    onChange={handleInputChange}
                    min={0}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="category">Категория</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      {toolCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="image">URL изображения</Label>
                <Input
                  id="image"
                  name="image"
                  value={formData.image || ''}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="available"
                  checked={formData.available ?? true}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, available: checked as boolean })
                  }
                />
                <Label htmlFor="available">Доступен для аренды</Label>
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
                onClick={handleAddTool}
                disabled={isSubmitting}
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
        
        {/* Диалоговое окно редактирования инструмента */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Редактировать инструмент</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="edit-name">Название инструмента</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="edit-description">Описание</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  rows={3}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="edit-price">Цена в день (₽)</Label>
                  <Input
                    id="edit-price"
                    name="price"
                    type="number"
                    value={formData.price || 0}
                    onChange={handleInputChange}
                    min={0}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="edit-category">Категория</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      {toolCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="edit-image">URL изображения</Label>
                <Input
                  id="edit-image"
                  name="image"
                  value={formData.image || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-available"
                  checked={formData.available ?? true}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, available: checked as boolean })
                  }
                />
                <Label htmlFor="edit-available">Доступен для аренды</Label>
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
                onClick={handleEditTool}
                disabled={isSubmitting}
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
        
        {/* Диалоговое окно удаления инструмента */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Удалить инструмент</DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <p className="text-gray-700">
                Вы уверены, что хотите удалить инструмент "{currentTool?.name}"?
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Это действие невозможно отменить.
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
                onClick={handleDeleteTool}
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

export default ToolsManagement;
