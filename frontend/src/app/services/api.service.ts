import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

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
