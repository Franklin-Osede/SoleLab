import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { ApiService } from './api.service';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, User } from '../models/user.model';

/**
 * Authentication Service
 * 
 * RAZÓN DE DISEÑO:
 * - Maneja autenticación y estado del usuario
 * - Almacena token en localStorage
 * - Expone estado del usuario como Observable
 * - Singleton service
 * 
 * MEJORES PRÁCTICAS:
 * - Usa BehaviorSubject para estado reactivo
 * - Centraliza lógica de autenticación
 * - Facilita testing
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'solelab_token';
  private readonly USER_KEY = 'solelab_user';
  
  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private apiService: ApiService) {
    // Verificar si hay token válido al iniciar
    this.checkStoredAuth();
  }

  /**
   * Registra un nuevo usuario
   */
  register(request: RegisterRequest): Observable<RegisterResponse> {
    return this.apiService.post<RegisterResponse>('/auth/register', request);
  }

  /**
   * Inicia sesión
   */
  login(request: LoginRequest): Observable<LoginResponse> {
    return this.apiService.post<LoginResponse>('/auth/login', request).pipe(
      tap(response => {
        this.setAuth(response.token, response.user);
      })
    );
  }

  /**
   * Cierra sesión
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
  }

  /**
   * Obtiene el token actual
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    // Verificar si el token no ha expirado (básico)
    // En producción, el backend validará el token
    return true;
  }

  /**
   * Obtiene el usuario actual
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Almacena token y usuario
   */
  private setAuth(token: string, user: User): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  /**
   * Obtiene usuario almacenado
   */
  private getStoredUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  /**
   * Verifica autenticación almacenada
   */
  private checkStoredAuth(): void {
    const token = this.getToken();
    const user = this.getStoredUser();
    
    if (token && user) {
      // Verificar si el token sigue siendo válido
      // Por ahora, asumimos que es válido
      // En producción, podrías hacer una llamada al backend
      this.currentUserSubject.next(user);
    } else {
      this.logout();
    }
  }
}

