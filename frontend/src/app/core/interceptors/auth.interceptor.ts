import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Auth Interceptor
 * 
 * RAZÓN DE DISEÑO:
 * - Agrega automáticamente el token JWT a todas las requests
 * - No necesitas agregar headers manualmente en cada servicio
 * - Centraliza lógica de autenticación HTTP
 * 
 * MEJORES PRÁCTICAS:
 * - Functional interceptor (Angular 15+)
 * - Solo agrega token si existe
 * - No interfiere con requests públicas
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Si hay token, agregarlo al header
  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq);
  }

  return next(req);
};

