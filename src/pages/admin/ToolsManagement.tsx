
import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { mockTools, toolCategories } from '@/data/mockTools';
import { Tool } from '@/types/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  Search,
  Eye,
  Check,
  X
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger 
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

// В реальном приложении это была бы часть API-интерфейса
let toolsData = [...mockTools];

const ToolsManagement = () => {
  const [tools, setTools] = useState<Tool[]>(toolsData);
  const [searchQuery, setSearchQuery] = useState('');
  
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
  
  const { toast } = useToast();
  
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
  const handleAddTool = () => {
    const newTool: Tool = {
      id: tools.length > 0 ? Math.max(...tools.map(t => t.id)) + 1 : 1,
      name: formData.name || '',
      description: formData.description || '',
      price: formData.price || 0,
      image: formData.image || '',
      category: formData.category || toolCategories[0],
      available: formData.available ?? true
    };
    
    const updatedTools = [...tools, newTool];
    setTools(updatedTools);
    toolsData = updatedTools;
    
    setIsAddDialogOpen(false);
    
    toast({
      title: "Инструмент добавлен",
      description: `${newTool.name} успешно добавлен в каталог`,
    });
  };
  
  // Редактировать инструмент
  const handleEditTool = () => {
    if (!currentTool) return;
    
    const updatedTools = tools.map(tool => 
      tool.id === currentTool.id 
        ? { ...tool, ...formData } 
        : tool
    );
    
    setTools(updatedTools);
    toolsData = updatedTools;
    
    setIsEditDialogOpen(false);
    
    toast({
      title: "Инструмент обновлен",
      description: `${formData.name} успешно обновлен`,
    });
  };
  
  // Удалить инструмент
  const handleDeleteTool = () => {
    if (!currentTool) return;
    
    const updatedTools = tools.filter(tool => tool.id !== currentTool.id);
    setTools(updatedTools);
    toolsData = updatedTools;
    
    setIsDeleteDialogOpen(false);
    
    toast({
      title: "Инструмент удален",
      description: `${currentTool.name} успешно удален из каталога`,
    });
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
        
        {/* Таблица инструментов */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
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
                    Инструменты не найдены
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Отмена
              </Button>
              <Button onClick={handleAddTool}>Добавить</Button>
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
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Отмена
              </Button>
              <Button onClick={handleEditTool}>Сохранить</Button>
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
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Отмена
              </Button>
              <Button variant="destructive" onClick={handleDeleteTool}>
                Удалить
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default ToolsManagement;
