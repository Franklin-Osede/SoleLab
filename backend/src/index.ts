import 'dotenv/config';
import { startServer } from './presentation/api/server';

/**
 * Entry point de la aplicación
 * 
 * RAZÓN DE DISEÑO:
 * - Separado del servidor para facilitar testing
 * - Carga variables de entorno
 * - Inicia el servidor
 */
async function main() {
  try {
    await startServer();
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Solo ejecutar si es el archivo principal (no en tests)
if (require.main === module) {
  main();
}

export { main };

