import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Auth Guard
 * 
 * RAZÓN DE DISEÑO:
 * - Protege rutas que requieren autenticación
 * - Redirige a login si no está autenticado
 * - Functional guard (Angular 15+)
 * 
 * USO:
 * - Agregar a rutas en app.routes.ts:
 *   { path: 'designs', component: DesignsComponent, canActivate: [authGuard] }
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirigir a login
  router.navigate(['/auth/login'], { 
    queryParams: { returnUrl: state.url } 
  });
  return false;
};

