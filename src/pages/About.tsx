
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Separator } from '@/components/ui/separator';
import { Award, Users, Clock, Percent, Shield, Settings } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Заголовок */}
        <section className="bg-primary text-white py-16 relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1581338834647-b0fb40704e21?q=80&w=1600&auto=format&fit=crop')"
            }}
          />
          <div className="container mx-auto px-4 relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">О компании</h1>
            <p className="text-xl max-w-3xl">
              ЭлектроПрокат — ваш надежный партнер в аренде профессионального 
              электроинструмента для любых строительных и ремонтных задач.
            </p>
          </div>
        </section>
        
        {/* О нас */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Кто мы</h2>
                <p className="text-gray-700 mb-4">
                  Компания ЭлектроПрокат работает на рынке аренды инструмента уже более 10 лет. 
                  За это время мы накопили огромный опыт и сформировали обширный парк 
                  качественного профессионального электроинструмента от ведущих мировых производителей.
                </p>
                <p className="text-gray-700 mb-4">
                  Наша цель — обеспечить клиентов надежным и современным инструментом 
                  для решения любых задач, избавив их от необходимости приобретать 
                  дорогостоящее оборудование для разовых или редких работ.
                </p>
                <p className="text-gray-700">
                  Мы помогаем строителям, ремонтным бригадам, компаниям и частным лицам 
                  экономить на покупке инструмента, при этом получая доступ к профессиональному 
                  оборудованию высокого класса.
                </p>
              </div>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=800&auto=format&fit=crop" 
                  alt="Наша команда" 
                  className="rounded-lg shadow-lg"
                />
                <div className="absolute -bottom-6 -left-6 bg-primary text-white p-4 rounded-lg shadow-lg">
                  <div className="text-4xl font-bold">10+</div>
                  <div className="text-sm">лет опыта</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Преимущества */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Почему нас выбирают</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="rounded-full bg-primary/10 w-14 h-14 flex items-center justify-center mb-4">
                  <Settings className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Профессиональное оборудование</h3>
                <p className="text-gray-600">
                  Мы предлагаем только качественный инструмент от проверенных производителей: 
                  Bosch, Makita, DeWALT, Hilti и других лидеров рынка.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="rounded-full bg-primary/10 w-14 h-14 flex items-center justify-center mb-4">
                  <Clock className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Оперативность</h3>
                <p className="text-gray-600">
                  Быстрое оформление и доставка инструмента в день заказа. 
                  Никаких задержек и простоев в работе.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="rounded-full bg-primary/10 w-14 h-14 flex items-center justify-center mb-4">
                  <Shield className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Гарантия качества</h3>
                <p className="text-gray-600">
                  Все инструменты проходят регулярное техническое обслуживание и 
                  проверку перед каждой выдачей клиенту.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="rounded-full bg-primary/10 w-14 h-14 flex items-center justify-center mb-4">
                  <Percent className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Выгодные условия</h3>
                <p className="text-gray-600">
                  Гибкая система скидок при долгосрочной аренде, а также специальные 
                  предложения для постоянных клиентов.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="rounded-full bg-primary/10 w-14 h-14 flex items-center justify-center mb-4">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Профессиональная консультация</h3>
                <p className="text-gray-600">
                  Наши специалисты помогут подобрать оптимальный инструмент для ваших задач 
                  и проконсультируют по его использованию.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="rounded-full bg-primary/10 w-14 h-14 flex items-center justify-center mb-4">
                  <Award className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Опыт и репутация</h3>
                <p className="text-gray-600">
                  Более 10 лет на рынке и тысячи довольных клиентов подтверждают 
                  нашу надежность и профессионализм.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Команда */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Наша команда</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="mb-4 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?q=80&w=400&auto=format&fit=crop" 
                    alt="Иван Петров" 
                    className="rounded-lg w-full aspect-square object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-1">Иван Петров</h3>
                <p className="text-gray-500 mb-2">Генеральный директор</p>
                <p className="text-sm text-gray-600">
                  Более 15 лет опыта в сфере строительного оборудования
                </p>
              </div>
              
              <div className="text-center">
                <div className="mb-4 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop" 
                    alt="Елена Сидорова" 
                    className="rounded-lg w-full aspect-square object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-1">Елена Сидорова</h3>
                <p className="text-gray-500 mb-2">Руководитель отдела продаж</p>
                <p className="text-sm text-gray-600">
                  Эксперт по клиентскому сервису и организации процессов
                </p>
              </div>
              
              <div className="text-center">
                <div className="mb-4 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop" 
                    alt="Алексей Смирнов" 
                    className="rounded-lg w-full aspect-square object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-1">Алексей Смирнов</h3>
                <p className="text-gray-500 mb-2">Технический директор</p>
                <p className="text-sm text-gray-600">
                  Отвечает за состояние и обслуживание всего парка инструментов
                </p>
              </div>
              
              <div className="text-center">
                <div className="mb-4 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=400&auto=format&fit=crop" 
                    alt="Марина Козлова" 
                    className="rounded-lg w-full aspect-square object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-1">Марина Козлова</h3>
                <p className="text-gray-500 mb-2">Менеджер по работе с клиентами</p>
                <p className="text-sm text-gray-600">
                  Всегда готова помочь с выбором оптимального инструмента
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* История компании */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">История компании</h2>
            
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-1/3">
                  <div className="text-center md:text-right">
                    <div className="text-2xl font-bold text-primary">2013</div>
                    <h3 className="text-xl font-semibold">Основание компании</h3>
                  </div>
                </div>
                <div className="hidden md:block w-px h-32 bg-primary/30 relative">
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary"></div>
                </div>
                <div className="md:w-2/3">
                  <p className="text-gray-700">
                    Компания ЭлектроПрокат была основана как небольшой пункт проката 
                    строительного инструмента с парком из 50 единиц оборудования. 
                    Основной фокус был на обслуживании частных клиентов и небольших строительных бригад.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-1/3">
                  <div className="text-center md:text-right">
                    <div className="text-2xl font-bold text-primary">2015</div>
                    <h3 className="text-xl font-semibold">Расширение ассортимента</h3>
                  </div>
                </div>
                <div className="hidden md:block w-px h-32 bg-primary/30 relative">
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary"></div>
                </div>
                <div className="md:w-2/3">
                  <p className="text-gray-700">
                    Значительное увеличение парка инструментов до 200 единиц. 
                    Начало работы с юридическими лицами и строительными компаниями. 
                    Открытие первого полноценного пункта проката с мастерской для обслуживания.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-1/3">
                  <div className="text-center md:text-right">
                    <div className="text-2xl font-bold text-primary">2018</div>
                    <h3 className="text-xl font-semibold">Запуск службы доставки</h3>
                  </div>
                </div>
                <div className="hidden md:block w-px h-32 bg-primary/30 relative">
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary"></div>
                </div>
                <div className="md:w-2/3">
                  <p className="text-gray-700">
                    Организация собственной службы доставки инструмента клиентам. 
                    Внедрение системы онлайн-бронирования. Расширение географии 
                    обслуживания на пригороды.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-1/3">
                  <div className="text-center md:text-right">
                    <div className="text-2xl font-bold text-primary">2021</div>
                    <h3 className="text-xl font-semibold">Открытие филиалов</h3>
                  </div>
                </div>
                <div className="hidden md:block w-px h-32 bg-primary/30 relative">
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary"></div>
                </div>
                <div className="md:w-2/3">
                  <p className="text-gray-700">
                    Открытие трех дополнительных пунктов выдачи в разных районах города. 
                    Парк инструментов увеличен до 500 единиц. Запуск программы лояльности 
                    для постоянных клиентов.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-1/3">
                  <div className="text-center md:text-right">
                    <div className="text-2xl font-bold text-primary">2023</div>
                    <h3 className="text-xl font-semibold">Сегодняшний день</h3>
                  </div>
                </div>
                <div className="hidden md:block w-px h-32 bg-primary/30 relative">
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary"></div>
                </div>
                <div className="md:w-2/3">
                  <p className="text-gray-700">
                    ЭлектроПрокат – современная компания с обширным парком профессионального 
                    инструмента, собственной службой доставки и квалифицированным персоналом. 
                    Мы продолжаем развиваться и совершенствовать наши услуги для вас.
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

export default About;
