import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

interface Admin {
  id: string;
  username: string;
  role: string;
}

interface AuthResponse {
  token: string;
  admin: Admin;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/admin';
  private tokenKey = 'admin_token';
  private currentAdminSubject = new BehaviorSubject<Admin | null>(null);
  public currentAdmin$ = this.currentAdminSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadStoredAuth();
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap(response => {
          this.setSession(response);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentAdminSubject.next(null);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    // Check if token is expired
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiration = payload.exp * 1000;
    return Date.now() < expiration;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentAdmin(): Admin | null {
    return this.currentAdminSubject.value;
  }

  private setSession(authResult: AuthResponse): void {
    localStorage.setItem(this.tokenKey, authResult.token);
    this.currentAdminSubject.next(authResult.admin);
  }

  private loadStoredAuth(): void {
    const token = this.getToken();
    if (token && this.isLoggedIn()) {
      // Decode admin info from token
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.currentAdminSubject.next({
        id: payload.id,
        username: payload.username,
        role: payload.role
      });
    }
  }
}
