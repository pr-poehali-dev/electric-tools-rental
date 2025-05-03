
export interface Tool {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
}

export interface CartItem extends Tool {
  quantity: number;
  days?: number;
}

export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  role: 'admin' | 'user';
  avatar?: string;
  createdAt: string;
}

export interface BookingService {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  duration: number; // в минутах
  available: boolean;
}

export interface Booking {
  id: number;
  userId: number;
  serviceId: number;
  serviceName: string;
  servicePrice: number;
  date: string; // формат 'YYYY-MM-DD'
  time: string; // формат 'HH:MM'
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Address {
  street: string;
  house: string;
  apartment?: string;
  city: string;
  zipCode: string;
}
