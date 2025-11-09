# Base de Datos - PostgreSQL + Prisma

## 🎯 Decisión

**PostgreSQL** como base de datos + **Prisma** como ORM.

## ¿Por qué PostgreSQL?

- ✅ **Relacional**: Perfecto para DDD con relaciones
- ✅ **ACID**: Transacciones seguras para marketplace
- ✅ **Arrays nativos**: Soporta `colors: String[]`
- ✅ **Escalable**: Crece con el proyecto
- ✅ **Producción-ready**: Usado en millones de apps

## ¿Por qué Prisma?

- ✅ **Type-safety**: Genera tipos TypeScript automáticamente
- ✅ **Menos código**: Query builder intuitivo
- ✅ **Migraciones**: Automáticas con `prisma migrate`
- ✅ **Testing**: Soporte para tests
- ✅ **Perfecto para DDD**: Fácil implementar Repository Pattern

## Schema

Ver `prisma/schema.prisma` para el schema completo.

## Comandos

```bash
# Generar Prisma Client
npm run db:generate

# Crear migración
npm run db:migrate

# Abrir Prisma Studio (UI)
npm run db:studio
```

## Testing

Los integration tests usan una DB de test separada:
- Variable: `TEST_DATABASE_URL` o `DATABASE_URL`
- Se limpia antes/después de cada test

## Alternativas Consideradas

- **MongoDB**: No relacional, menos type-safe
- **MySQL**: Menos features modernas
- **Raw SQL**: Más código, sin type-safety

**Conclusión**: PostgreSQL + Prisma es la mejor opción para este proyecto.

