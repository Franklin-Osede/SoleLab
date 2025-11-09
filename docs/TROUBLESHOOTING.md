# Troubleshooting - SoleLab

## Errores de TypeScript en Tests

### Problema: "Cannot find name 'describe'"

**Causa**: Las dependencias no están instaladas o TypeScript no encuentra los tipos de Jest.

**Solución**:

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Recargar TypeScript en VS Code**:
   - `Cmd+Shift+P` (Mac) o `Ctrl+Shift+P` (Windows/Linux)
   - Escribir: "TypeScript: Restart TS Server"
   - O recargar ventana: "Developer: Reload Window"

3. **Verificar que @types/jest esté instalado**:
   ```bash
   npm list @types/jest
   ```

### Si los errores persisten:

1. **Verificar tsconfig.json**:
   - Debe tener `"types": ["jest", "node"]` en `compilerOptions`
   - Debe incluir `"tests/**/*.ts"` en `include`

2. **Verificar archivos de test**:
   - Deben tener `/// <reference types="jest" />` al inicio

3. **Limpiar y reinstalar**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

## Los Tests Funcionan Aunque el IDE Muestre Errores

**Importante**: Los errores del IDE son solo visuales. Los tests funcionan correctamente cuando:
- Las dependencias están instaladas (`npm install`)
- Jest está configurado correctamente (ya está configurado)

**Para verificar**:
```bash
npm test
```

Si los tests pasan, los errores del IDE son solo un problema de reconocimiento de tipos.

## Errores Comunes

### 1. "Cannot find module '@domains/...'"

**Solución**: Verificar que los paths en `tsconfig.json` estén correctos.

### 2. "Prisma Client not generated"

**Solución**:
```bash
npm run db:generate
```

### 3. "Database connection error"

**Solución**: Verificar que `DATABASE_URL` esté configurado en `.env`.

## Comandos Útiles

```bash
# Instalar dependencias
npm install

# Generar Prisma Client
npm run db:generate

# Ejecutar tests
npm test

# Recargar TypeScript (en VS Code)
# Cmd+Shift+P → "TypeScript: Restart TS Server"
```

