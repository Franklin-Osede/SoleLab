/**
 * Environment configuration
 * Configuración para producción
 */
export const environment = {
  production: true,
  apiUrl: process.env['API_URL'] || 'https://api.solelab.com/api/v1'
};

