import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Food {
  _id?: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  distance: number;
  preorder: boolean;
}

interface Order {
  _id: string;
  foodId: Food;
  buyerName: string;
  address: string;
  deliveryOption: string;
  paymentStatus: string;
  createdAt: string;
}

interface DashboardStats {
  totalOrders: number;
  totalFoods: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
}

interface CustomerData {
  name: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
  orders: Order[];
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:5000/api/admin';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    return new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
      'Content-Type': 'application/json'
    });
  }

  // Orders
  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders`, { headers: this.getHeaders() });
  }

  updateOrderStatus(orderId: string, status: string): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/orders/${orderId}/status`, { status }, { headers: this.getHeaders() });
  }

  // Dashboard
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard/stats`, { headers: this.getHeaders() });
  }

  // Foods management
  getAllFoods(): Observable<Food[]> {
    return this.http.get<Food[]>(`${this.apiUrl}/foods`, { headers: this.getHeaders() });
  }

  addFood(food: Food): Observable<Food> {
    return this.http.post<Food>(`${this.apiUrl}/foods`, food, { headers: this.getHeaders() });
  }

  updateFood(id: string, food: Food): Observable<Food> {
    return this.http.put<Food>(`${this.apiUrl}/foods/${id}`, food, { headers: this.getHeaders() });
  }

  deleteFood(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/foods/${id}`, { headers: this.getHeaders() });
  }

  // Customers
  getCustomers(): Observable<CustomerData[]> {
    return this.http.get<CustomerData[]>(`${this.apiUrl}/customers`, { headers: this.getHeaders() });
  }
}
