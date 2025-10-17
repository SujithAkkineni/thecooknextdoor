import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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
  _id?: string;
  foodId: string;
  buyerName: string;
  address: string;
  deliveryOption: string;
  paymentStatus?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    // Use environment variable override if available (for Render deployment)
    if (typeof window !== 'undefined' && (window as any)['ENV']?.API_URL) {
      this.apiUrl = (window as any)['ENV'].API_URL;
    }
  }

  // Get all foods
  getFoods(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/foods`);
  }

  // Get single food
  getFood(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/foods/${id}`);
  }

  // Add new food
  addFood(food: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/foods`, food);
  }

  // Place order
  placeOrder(order: Order): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/orders`, order);
  }

  // Handle payment
  processPayment(orderId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/orders/payments`, { orderId });
  }
}
