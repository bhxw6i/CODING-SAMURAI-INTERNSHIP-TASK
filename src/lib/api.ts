const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  token?: string;
}

export interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description?: string;
  badge?: string;
  stock?: number;
  inStock?: boolean;
}

export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
}

class ApiClient {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_URL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      // Handle non-JSON responses (e.g., network errors, server down)
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        if (!response.ok) {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
        // Return empty object for successful non-JSON responses
        return {} as T;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `An error occurred: ${response.status}`);
      }

      return data;
    } catch (error) {
      // Handle network errors (server not running, CORS, etc.)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please make sure the backend is running.');
      }
      throw error;
    }
  }

  // Auth endpoints
  async register(name: string, email: string, password: string): Promise<User> {
    return this.request<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  async login(email: string, password: string): Promise<User> {
    return this.request<User>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  // Product endpoints
  async getProducts(category?: string): Promise<Product[]> {
    const query = category && category !== 'All' ? `?category=${category}` : '';
    return this.request<Product[]>(`/products${query}`);
  }

  async getProduct(id: string): Promise<Product> {
    return this.request<Product>(`/products/${id}`);
  }

  // Cart endpoints
  async getCart(): Promise<Cart> {
    return this.request<Cart>('/cart');
  }

  async addToCart(productId: string, quantity: number = 1): Promise<Cart> {
    return this.request<Cart>('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async updateCartItem(itemId: string, quantity: number): Promise<Cart> {
    return this.request<Cart>(`/cart/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeCartItem(itemId: string): Promise<Cart> {
    return this.request<Cart>(`/cart/${itemId}`, {
      method: 'DELETE',
    });
  }

  async clearCart(): Promise<Cart> {
    return this.request<Cart>('/cart', {
      method: 'DELETE',
    });
  }

  // Order endpoints
  async createOrder(
    shippingAddress: any,
    paymentIntentId: string
  ): Promise<any> {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify({ shippingAddress, paymentIntentId }),
    });
  }

  async getOrders(): Promise<any[]> {
    return this.request<any[]>('/orders');
  }

  async getOrder(id: string): Promise<any> {
    return this.request(`/orders/${id}`);
  }

  // Payment endpoints
  async createRazorpayOrder(data: {
    amount: number;
    currency: string;
    shippingAddress: any;
    userId: string;
  }): Promise<any> {
    return this.request('/payments/create-order', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async verifyRazorpayPayment(data: {
    orderId: string;
    paymentId: string;
    signature: string;
  }): Promise<any> {
    return this.request('/payments/verify-payment', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiClient();