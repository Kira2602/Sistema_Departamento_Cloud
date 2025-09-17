# 🚀 Guía de Instalación Completa - Sistema Departamento Cloud

## 📋 Requisitos Previos

- **Node.js** (versión 16 o superior)
- **npm** (viene incluido con Node.js)
- Cuenta en **Supabase** (para la base de datos)

## 🗂️ Estructura del Proyecto

```
Sistema_Departamento_Cloud/
├── backend/          # Servidor Node.js + Express
├── frontend/         # Aplicación Vue.js
└── README.md         # Documentación
```

---

## ⚙️ Instalación del Backend

### 1. Navegar al directorio del backend
```bash
cd backend
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crear un archivo `.env` en la carpeta `backend/` con:
```env
SUPABASE_URL=tu_url_de_supabase
SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
JWT_SECRET=tu_secreto_jwt_super_seguro
PORT=3000
```

### 4. Iniciar el servidor
```bash
npm run dev
```
✅ El backend estará corriendo en `http://localhost:3000`

---

## 🎨 Instalación del Frontend

### 1. Navegar al directorio del frontend
```bash
cd frontend
```

### 2. Instalar dependencias básicas
```bash
npm install
```

### 3. Instalar librerías necesarias para el frontend
```bash
# SASS para estilos
npm install -D sass-embedded

# SweetAlert2 para alertas bonitas
npm install sweetalert2

# Lottie Player para animaciones
npm install @lottiefiles/lottie-player

# Swiper para carruseles
npm i swiper
```

### 4. Iniciar la aplicación
```bash
npm run dev
```
✅ El frontend estará corriendo en `http://localhost:5173`

---

## 🗄️ Configuración de Supabase

### 1. Crear proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Crea una nueva cuenta o inicia sesión
3. Crea un nuevo proyecto

### 2. Crear tabla 'profiles'
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy para que usuarios puedan ver sus propios perfiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
```

### 3. Crear tabla 'cloud'
```sql
CREATE TABLE cloud (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo_recurso TEXT NOT NULL,
  proveedor_cloud TEXT NOT NULL,
  servicio_producto TEXT NOT NULL,
  id_recurso TEXT NOT NULL,
  region_zona TEXT,
  estado TEXT CHECK (estado IN ('Activo', 'Inactivo')),
  responsable_user_id UUID REFERENCES auth.users(id),
  costo_mensual_estimado DECIMAL(10,2) DEFAULT 0,
  fecha_inicio DATE,
  fecha_fin_contrato DATE,
  garantia TEXT,
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE cloud ENABLE ROW LEVEL SECURITY;

-- Policies para que usuarios autenticados puedan gestionar recursos
CREATE POLICY "Authenticated users can view all resources" ON cloud FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create resources" ON cloud FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update resources" ON cloud FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete resources" ON cloud FOR DELETE TO authenticated USING (true);
```

### 4. Obtener credenciales
1. Ve a **Settings > API** en tu proyecto Supabase
2. Copia la **URL** y **anon key**
3. Úsalas en el archivo `.env` del backend

---

## 🚀 Uso del Sistema

### 1. Acceso
1. Abre el navegador en `http://localhost:5173`
2. Regístrate o inicia sesión
3. ¡Comienza a gestionar tus recursos cloud!

### 2. Funcionalidades
- ✅ **Agregar** recursos cloud
- ✅ **Ver** todos los recursos
- ✅ **Editar** cualquier campo
- ✅ **Eliminar** recursos
- ✅ **Autenticación** segura

---

## 🔧 Solución de Problemas

### Puerto ocupado
Si el puerto 5173 está ocupado, Vite automáticamente usará otro puerto (ej: 5174).

### Error de conexión a Supabase
Verifica que las credenciales en `.env` sean correctas.

### Dependencias faltantes
Ejecuta `npm install` en ambas carpetas (backend y frontend).

---

## 👥 Créditos

**Sistema desarrollado por:**
- **Backend & Integración**: [Tu nombre]
- **Frontend**: [Nombre de tu amiga]
- **Base de datos**: Supabase

---

¡Listo! 🎉 Con esta guía cualquier persona puede instalar y usar tu sistema.