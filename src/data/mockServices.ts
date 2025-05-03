
import { BookingService } from '@/types/types';

export const mockServices: BookingService[] = [
  {
    id: 1,
    name: "Консультация по выбору инструмента",
    description: "Профессиональная консультация по выбору инструмента для ваших задач. Поможем подобрать оптимальный вариант с учетом бюджета и требований.",
    price: 1000,
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=800&auto=format&fit=crop",
    category: "Консультации",
    duration: 60,
    available: true
  },
  {
    id: 2,
    name: "Обучение работе с перфоратором",
    description: "Практическое занятие по правильному и безопасному использованию перфоратора. Обучение базовым техникам работы и советы от профессионалов.",
    price: 1500,
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=800&auto=format&fit=crop",
    category: "Обучение",
    duration: 90,
    available: true
  },
  {
    id: 3,
    name: "Мастер-класс по укладке плитки",
    description: "Практический мастер-класс по укладке кафельной плитки. От подготовки поверхности до финишной обработки швов.",
    price: 2500,
    image: "https://images.unsplash.com/photo-1534533983688-c7b8e13fd3b6?q=80&w=800&auto=format&fit=crop",
    category: "Мастер-классы",
    duration: 180,
    available: true
  },
  {
    id: 4,
    name: "Диагностика электроинструмента",
    description: "Профессиональная диагностика состояния вашего электроинструмента. Выявление неисправностей и рекомендации по ремонту.",
    price: 800,
    image: "https://images.unsplash.com/photo-1590959651373-a3db0f38a961?q=80&w=800&auto=format&fit=crop",
    category: "Диагностика",
    duration: 45,
    available: true
  },
  {
    id: 5,
    name: "Консультация по ремонту помещения",
    description: "Выезд специалиста на объект для оценки объема работ, составления плана ремонта и подбора необходимых инструментов и материалов.",
    price: 3000,
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop",
    category: "Консультации",
    duration: 120,
    available: true
  }
];

export const serviceCategories = [
  "Консультации",
  "Обучение",
  "Мастер-классы",
  "Диагностика",
  "Ремонт",
  "Установка"
];
