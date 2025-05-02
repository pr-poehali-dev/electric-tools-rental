
import { Tool } from '@/types/types';

export const mockTools: Tool[] = [
  {
    id: 1,
    name: "Перфоратор Bosch GBH 2-26",
    description: "Профессиональный перфоратор для сверления отверстий в бетоне, кирпиче и камне. Мощность 800 Вт, энергия удара 2.7 Дж.",
    price: 500,
    image: "https://images.unsplash.com/photo-1590957550747-d39dae3f2979?q=80&w=800&auto=format&fit=crop",
    category: "Дрели и перфораторы",
    available: true
  },
  {
    id: 2,
    name: "Шуруповерт Makita DDF482",
    description: "Аккумуляторный шуруповерт для профессионального использования. Аккумулятор 18В, 2 скорости.",
    price: 400,
    image: "https://images.unsplash.com/photo-1643760542531-b118e61efe8d?q=80&w=800&auto=format&fit=crop",
    category: "Шуруповерты",
    available: true
  },
  {
    id: 3,
    name: "Бетономешалка ЗУБР ЗБСМ-120",
    description: "Бетономешалка для приготовления растворов. Объем барабана 120 л, мощность 550 Вт.",
    price: 900,
    image: "https://images.unsplash.com/photo-1586528116493-a029325540fa?q=80&w=800&auto=format&fit=crop",
    category: "Строительная техника",
    available: false
  },
  {
    id: 4,
    name: "Болгарка DeWALT DWE4257",
    description: "Угловая шлифовальная машина для резки и шлифования. Мощность 1500 Вт, диаметр диска 125 мм.",
    price: 450,
    image: "https://images.unsplash.com/photo-1572981986848-b6f1c98bd336?q=80&w=800&auto=format&fit=crop",
    category: "Шлифовальные машины",
    available: true
  },
  {
    id: 5,
    name: "Генератор HONDA EU20i",
    description: "Инверторный генератор для дачи и дома. Мощность 2000 Вт, время работы до 10 часов.",
    price: 1500,
    image: "https://images.unsplash.com/photo-1523508685883-504193165d75?q=80&w=800&auto=format&fit=crop",
    category: "Генераторы",
    available: true
  },
  {
    id: 6,
    name: "Сварочный аппарат ESAB Rebel EMP 215ic",
    description: "Многофункциональный сварочный аппарат для MIG/MAG, MMA и TIG сварки. Диапазон сварочного тока 5-220 А.",
    price: 1200,
    image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=800&auto=format&fit=crop",
    category: "Сварочное оборудование",
    available: true
  }
];

export const toolCategories = [
  "Дрели и перфораторы",
  "Шуруповерты",
  "Шлифовальные машины",
  "Пилы",
  "Строительная техника",
  "Генераторы",
  "Сварочное оборудование",
  "Садовая техника",
  "Компрессоры",
  "Измерительные инструменты"
];
