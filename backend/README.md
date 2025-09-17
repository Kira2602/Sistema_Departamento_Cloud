# Backend - Sistema de Inventario Cloud

Backend para el sistema de inventario de recursos cloud usando Node.js, Express y Supabase.

## 🚀 Configuración

### Requisitos previos
- Node.js 18+ 
- npm
- Cuenta de Supabase configurada

### Instalación

```bash
npm install
```

### Variables de entorno

El archivo `.env` debe contener:
```properties
SUPABASE_URL=https://wgwzqenarerlxkxkpssd.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
PORT=3000
FRONTEND_URL=http://localhost:5173
```

### Iniciar servidor

```bash
# Desarrollo con nodemon
npm run dev

# Producción
npm start
```

## 📊 Base de datos

### Tabla `cloud`
- `id` (uuid) - Primary Key
- `codigo_recurso` (text) - Código único del recurso
- `proveedor_cloud` (text) - AWS, Azure, GCP, etc.
- `servicio_producto` (text) - EC2, S3, etc.
- `id_recuerso` (text) - ID interno del recurso
- `region_zona` (text) - us-east-1, etc.
- `estado` (text) - activo, inactivo, etc.
- `responsable_user_id` (uuid) - Foreign key a profiles
- `costo_mensual_estimado` (numeric) - Costo estimado mensual
- `fecha_inicio` (timestamptz) - Fecha de inicio
- `fecha_fin_contrato` (timestamptz) - Fecha fin de contrato
- `garantia` (text) - Información de garantía
- `notas` (text) - Notas adicionales
- `created_at` (timestamptz) - Fecha de creación
- `updated_at` (timestamptz) - Fecha de actualización

### Tabla `profiles`
- `id` (int8) - Primary Key
- `user_id` (uuid) - Foreign key a auth.users
- `full_name` (text) - Nombre completo
- `avatar_url` (text) - URL del avatar
- `bio` (text) - Biografía
- `created_at` (timestamptz) - Fecha de creación
- `updated` (timestamptz) - Fecha de actualización

## 🛠 API Endpoints

### Autenticación
```
POST /auth/signup       - Registro de usuario
POST /auth/signin       - Iniciar sesión
POST /auth/signout      - Cerrar sesión
GET  /auth/user         - Obtener usuario actual
GET  /auth/protected    - Ruta protegida de ejemplo
```

### Recursos Cloud
```
GET    /cloud           - Obtener recursos del usuario actual
GET    /cloud/all       - Obtener todos los recursos (con info de perfiles)
GET    /cloud/:id       - Obtener recurso específico
POST   /cloud           - Crear nuevo recurso
PUT    /cloud/:id       - Actualizar recurso
DELETE /cloud/:id       - Eliminar recurso
```

### Perfiles
```
GET  /profiles          - Obtener todos los perfiles
GET  /profiles/me       - Obtener perfil del usuario actual
GET  /profiles/:user_id - Obtener perfil por user_id
POST /profiles          - Crear/actualizar perfil
PUT  /profiles          - Actualizar perfil del usuario actual
```

### Sistema
```
GET /                   - Información básica del servidor
GET /health             - Health check
```

## 🔒 Autenticación

Todas las rutas protegidas requieren un token Bearer en el header:
```
Authorization: Bearer <access_token>
```

## 📝 Ejemplos de uso

### Crear recurso cloud
```bash
POST /cloud
Content-Type: application/json
Authorization: Bearer <token>

{
  "codigo_recurso": "WEB-001",
  "proveedor_cloud": "AWS",
  "servicio_producto": "EC2",
  "id_recuerso": "i-1234567890abcdef0",
  "estado": "activo",
  "region_zona": "us-east-1",
  "costo_mensual_estimado": 50.00,
  "fecha_inicio": "2025-01-01T00:00:00Z",
  "fecha_fin_contrato": "2025-12-31T23:59:59Z",
  "garantia": "1 año",
  "notas": "Servidor web principal"
}
```

### Obtener recursos
```bash
GET /cloud
Authorization: Bearer <token>
```

## 🚧 Estado del desarrollo

- ✅ Configuración de Supabase
- ✅ Autenticación con JWT
- ✅ CRUD completo para recursos cloud
- ✅ CRUD para perfiles de usuario
- ✅ Manejo de errores
- ✅ Documentación API

## 🔄 Siguientes pasos

1. Agregar validación de datos con express-validator
2. Implementar paginación
3. Agregar filtros y búsqueda
4. Tests unitarios
5. Logging avanzado
6. Rate limiting Auth with Supabase

## Environment
Create a `.env` file with:

```
SUPABASE_URL=your_project_url
SUPABASE_ANON_KEY=your_anon_key
# Optional for admin operations only (do not use in frontend)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Install

```
npm install
```

## Run

```
npm run start
```

## Endpoints
- POST `/auth/signup` { email, password, data? }
- POST `/auth/signin` { email, password }
- POST `/auth/signout`
- GET `/auth/user` with header `Authorization: Bearer <access_token>`
- GET `/auth/protected` with header `Authorization: Bearer <access_token>`

Use the `access_token` returned by `/auth/signin` in Authorization header to call protected routes. 