/**
 * Setup para Integration Tests
 * 
 * RAZÓN DE DISEÑO:
 * - Configuración común para todos los integration tests
 * - Variables de entorno para test DB
 * - Timeout aumentado para operaciones de DB
 */

// Aumentar timeout para operaciones de DB
jest.setTimeout(30000);

// Verificar que TEST_DATABASE_URL está configurado
if (!process.env.TEST_DATABASE_URL && !process.env.DATABASE_URL) {
  console.warn(
    '⚠️  TEST_DATABASE_URL o DATABASE_URL no está configurado. ' +
    'Los integration tests pueden fallar.'
  );
}

// Configurar variables de entorno para tests
process.env.NODE_ENV = 'test';

