/**
 * Authentication Middleware (Placeholder)
 * 
 * RAZÓN DE DISEÑO:
 * - Preparado para autenticación JWT
 * - Por ahora es solo un placeholder
 * - Se implementará cuando se agregue User Management
 * 
 * FUTURO:
 * - Validar JWT tokens
 * - Extraer userId del token
 * - Verificar permisos
 */
export async function authMiddleware(request: any, reply: any) {
  // TODO: Implementar autenticación JWT
  // Por ahora, permitir todas las requests
  // En el futuro:
  // 1. Extraer token del header Authorization
  // 2. Validar token con JWT
  // 3. Agregar userId al request
  // 4. Verificar permisos si es necesario
}

