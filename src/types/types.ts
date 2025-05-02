
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
