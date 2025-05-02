
import { useState, FormEvent } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, Mail, MapPin, Clock, Send, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Contacts = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Имитация отправки формы
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      toast({
        title: "Сообщение отправлено",
        description: "Мы свяжемся с вами в ближайшее время",
      });
      
      // Сброс формы
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
      
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Заголовок */}
        <section className="bg-primary text-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Контакты</h1>
            <p className="text-xl max-w-3xl">
              Свяжитесь с нами, чтобы узнать больше о наших услугах или получить консультацию по выбору инструмента
            </p>
          </div>
        </section>
        
        {/* Основной контент */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Контактная информация */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Наши контакты</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-primary/10 rounded-full p-3 mr-4">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Телефон</h3>
                      <p className="text-gray-700 mb-1">+7 (999) 123-45-67</p>
                      <p className="text-gray-500 text-sm">Ежедневно с 9:00 до 20:00</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary/10 rounded-full p-3 mr-4">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Email</h3>
                      <p className="text-gray-700 mb-1">info@electro-prokat.ru</p>
                      <p className="text-gray-500 text-sm">Отвечаем в течение 24 часов</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary/10 rounded-full p-3 mr-4">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Адрес</h3>
                      <p className="text-gray-700 mb-1">г. Москва, ул. Строителей, д. 10</p>
                      <p className="text-gray-500 text-sm">Метро Университет, 5 минут пешком</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary/10 rounded-full p-3 mr-4">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Часы работы</h3>
                      <p className="text-gray-700 mb-1">Пн-Пт: 9:00-18:00</p>
                      <p className="text-gray-700 mb-1">Сб: 10:00-15:00</p>
                      <p className="text-gray-700">Вс: выходной</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Мы в социальных сетях</h3>
                  <div className="flex space-x-4">
                    <a 
                      href="#" 
                      className="bg-gray-100 hover:bg-primary hover:text-white p-3 rounded-full transition-colors"
                      aria-label="ВКонтакте"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21.547 7.047c.13-.258.216-.538.258-.839.034-.236-.08-.44-.302-.531a2.21 2.21 0 0 0-.453-.134 23.54 23.54 0 0 0-3.001-.14c-.67 0-1.021.201-1.276.492-.47.414-.782 1.12-1.114 1.954-.72 1.779-1.839 3.48-2.837 3.48-.2 0-.239-.033-.239-.2V7.675c0-1.12-.492-1.782-1.332-1.782H8.24c-.608 0-.968.201-1.147.56-.216.414-.12.677.29.806.393.134.632.35.632.656 0 .085-.17.153-.17.22-.84 2.298-.258 3.87-.258 4.742 0 .594.184 1.232.505 1.706.388.57.962.878 1.622.878.996 0 1.721-.707 2.133-1.328.35-.521.603-1.074.832-1.613.216-.492.415-.998.629-1.49.11-.255.294-.39.563-.39.24 0 .384.115.384.343 0 .067-.17.134-.34.184a7.2 7.2 0 0 0-.05 1.858c.1.593.368 1.168.755 1.62.387.453.893.762 1.481.762 1.05 0 1.738-.792 2.24-1.866.351-.74.66-1.611.924-2.42.063-.198.21-.313.416-.313.203 0 .38.115.38.33 0 .05-.1.115-.3.2a5.895 5.895 0 0 0-.048 1.596c.08 1.06.606 2.004 1.765 2.004.88 0 1.513-.606 1.83-1.328.337-.74.558-1.577.756-2.37.063-.25.21-.383.433-.383.239 0 .38.15.38.416a.454.454 0 0 1-.33.168c-.383 1.913-.944 3.91-1.866 5.431-.924 1.52-2.35 2.47-4.198 2.47-1.785 0-3.14-1.1-3.868-2.452-.738 1.367-2.065 2.452-3.85 2.452-1.798 0-3.124-1.151-3.867-2.618-.756 1.52-2.22 2.634-4.133 2.634-2.35 0-4.1-1.913-4.1-4.763 0-2.835 1.816-4.764 4.166-4.764 1.948 0 3.35 1.247 3.85 2.898.08-.705.13-1.427.13-2.166 0-.772-.05-1.563-.132-2.401-.085-.806-.339-1.396-.845-1.81a2.05 2.05 0 0 0-1.43-.493L3.5 5.562c-.654 0-1.194.25-1.479.712-.267.51-.084.915.368 1.052a.758.758 0 0 1 .502.607c.32.973.504 4.796.504 6.254 0 1.375-.134 2.75-.537 4.125-.117.438-.47.64-.908.64-.57 0-.957-.421-.957-.943 0-.1.017-.201.05-.302.114-.352.183-.755.23-1.157.12-1.444.103-2.887.103-4.33 0-1.475-.12-3-.289-4.477-.118-.857-.64-1.527-1.53-1.56-.62-.017-1.09.268-1.292.772-.219.556.05.99.554 1.14.32.1.404.32.252.622-.22.438-.27.824-.337 1.275-.151.975-.202 1.95-.202 2.924 0 .975.05 1.95.186 2.908.05.404.168.79.353 1.161.47.941 1.376 1.527 2.485 1.527 1.932 0 3.273-1.678 3.776-3.372.235-.79.336-1.61.336-2.434 0-2.233-.857-3.996-3.056-3.996-.57 0-1.075.201-1.479.59-.37.355-.471.757-.32 1.212.117.337.387.455.723.354.235-.67.487-.084.723-.34.436-.134.839.05.974.455.1.303.033.605-.218.89-.284.337-.67.605-1.108.723a1.694 1.694 0 0 1-1.56-.269 2.378 2.378 0 0 1-.739-1.009 3.396 3.396 0 0 1-.219-.84 3.1 3.1 0 0 1 .202-1.728c.37-.89 1.058-1.546 2.05-1.746.387-.084.79-.1 1.176-.067a3.946 3.946 0 0 1 3.578 3.103v-.42c0-.403.035-.823.118-1.227.169-.856.64-1.493 1.53-1.526h3.695c.57 0 1.04.235 1.24.79.15.387.1.74-.167 1.075z" />
                      </svg>
                    </a>
                    <a 
                      href="#" 
                      className="bg-gray-100 hover:bg-primary hover:text-white p-3 rounded-full transition-colors"
                      aria-label="Telegram"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.05-.2-.06-.06-.17-.04-.25-.02-.11.02-1.84 1.17-5.2 3.42-.49.33-.94.5-1.35.48-.44-.01-1.29-.25-1.92-.46-.78-.26-1.39-.4-1.34-.85.03-.22.38-.45 1.03-.68 4.04-1.76 6.73-2.92 8.07-3.48 3.84-1.61 4.64-1.89 5.15-1.9.12 0 .37.03.54.17.14.12.18.28.2.46-.03.06-.03.12-.03.18z" />
                      </svg>
                    </a>
                    <a 
                      href="#" 
                      className="bg-gray-100 hover:bg-primary hover:text-white p-3 rounded-full transition-colors"
                      aria-label="WhatsApp"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287L6.7 17.752l2.58-.673c.937.58 1.99.925 3.156.925 3.18 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.766-5.767-5.766zm3.392 8.13c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.036c.101-.108.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.289.131.332.202.043.72.043.376-.1.682zm-3.408-14.3c-5.42 0-9.81 4.39-9.81 9.81s4.39 9.809 9.81 9.809c5.419 0 9.809-4.39 9.809-9.81s-4.39-9.808-9.81-9.808zm0 18.33c-4.698 0-8.52-3.822-8.52-8.52s3.822-8.519 8.52-8.519 8.52 3.82 8.52 8.52-3.823 8.52-8.52 8.52z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Форма обратной связи */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Напишите нам</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Ваше имя</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Иван Иванов"
                      required
                    />
                  </div>
                  
                  <div>
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
                  
                  <div>
                    <Label htmlFor="phone">Телефон</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+7 (999) 123-45-67"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Сообщение</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Напишите ваш вопрос или сообщение..."
                      rows={5}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting || isSubmitted}
                  >
                    {isSubmitting ? (
                      "Отправка..."
                    ) : isSubmitted ? (
                      <span className="flex items-center">
                        <Check className="mr-2 h-4 w-4" /> Отправлено
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Send className="mr-2 h-4 w-4" /> Отправить сообщение
                      </span>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
        
        {/* Карта */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-center">Мы на карте</h2>
            <div className="h-96 bg-gray-200 rounded-lg overflow-hidden">
              {/* Здесь будет карта, например, Google Maps или Яндекс Карты */}
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-primary mx-auto mb-3" />
                  <p className="text-gray-500">
                    г. Москва, ул. Строителей, д. 10
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Филиалы */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center">Наши филиалы</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Главный офис</h3>
                <div className="space-y-3 text-gray-700">
                  <p className="flex items-start">
                    <MapPin className="h-5 w-5 text-primary mr-2 shrink-0" />
                    г. Москва, ул. Строителей, д. 10
                  </p>
                  <p className="flex items-start">
                    <Phone className="h-5 w-5 text-primary mr-2 shrink-0" />
                    +7 (999) 123-45-67
                  </p>
                  <p className="flex items-start">
                    <Clock className="h-5 w-5 text-primary mr-2 shrink-0" />
                    Пн-Пт: 9:00-18:00, Сб: 10:00-15:00
                  </p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Филиал Западный</h3>
                <div className="space-y-3 text-gray-700">
                  <p className="flex items-start">
                    <MapPin className="h-5 w-5 text-primary mr-2 shrink-0" />
                    г. Москва, ул. Лесная, д. 25
                  </p>
                  <p className="flex items-start">
                    <Phone className="h-5 w-5 text-primary mr-2 shrink-0" />
                    +7 (999) 234-56-78
                  </p>
                  <p className="flex items-start">
                    <Clock className="h-5 w-5 text-primary mr-2 shrink-0" />
                    Пн-Пт: 9:00-18:00, Сб: 10:00-15:00
                  </p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Филиал Восточный</h3>
                <div className="space-y-3 text-gray-700">
                  <p className="flex items-start">
                    <MapPin className="h-5 w-5 text-primary mr-2 shrink-0" />
                    г. Москва, ул. Мастеров, д. 42
                  </p>
                  <p className="flex items-start">
                    <Phone className="h-5 w-5 text-primary mr-2 shrink-0" />
                    +7 (999) 345-67-89
                  </p>
                  <p className="flex items-start">
                    <Clock className="h-5 w-5 text-primary mr-2 shrink-0" />
                    Пн-Пт: 9:00-18:00, Сб: 10:00-15:00
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contacts;
