
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
}

export interface User {
  id: number;
  email: string;
  password: string;
  role: 'admin' | 'user';
  name: string;
}
