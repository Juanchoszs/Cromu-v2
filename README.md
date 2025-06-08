# 🏦 CROMU - Sistema Integral de Gestión Financiera

![CROMU Banner](public/logo-cromu.png)

Sistema profesional de gestión financiera para fondos de ahorro y crédito, diseñado para ofrecer una solución completa en la administración de ahorros y préstamos. Desarrollado con tecnologías modernas y una arquitectura escalable.

## 🌟 Características Principales

### 📊 Módulo de Ahorradores
- **Gestión Completa de Ahorradores**
  - Registro detallado con múltiples campos de información
  - Historial completo de transacciones
  - Sistema de seguimiento de pagos con estados personalizables
  - Gestión de documentos y archivos adjuntos

- **Sistema de Consignaciones Avanzado**
  - Múltiples consignaciones por mes
  - Registro detallado con fechas y descripciones
  - Cálculo automático de intereses compuestos
  - Historial de movimientos con filtros avanzados

- **Beneficios por Fidelidad**
  - Sistema de incentivos automático
  - Cálculo de beneficios según antigüedad
  - Generación de certificados de ahorro
  - Reportes de rentabilidad

### 💰 Módulo de Préstamos
- **Gestión Integral de Créditos**
  - Registro completo de préstamos con múltiples garantías
  - Cálculo automático de cuotas (sistema francés)
  - Tablas de amortización detalladas
  - Historial de pagos con estados personalizables

- **Proceso de Refinanciación**
  - Reestructuración de deuda con historial completo
  - Cálculo de nuevas condiciones
  - Generación de documentos legales
  - Seguimiento de refinanciaciones

- **Sistema de Cobranza**
  - Recordatorios automáticos de pago
  - Gestión de mora y cartera vencida
  - Reportes de cartera
  - Seguimiento de garantías

### 📱 Panel de Administración
- **Dashboard Interactivo**
  - Métricas clave en tiempo real
  - Gráficos y estadísticas avanzadas
  - Alertas y notificaciones
  - Acceso rápido a funciones principales

- **Gestión de Usuarios**
  - Sistema de roles y permisos
  - Registro de actividades
  - Configuraciones personalizables
  - Seguridad en dos pasos

## 🛠️ Arquitectura y Tecnologías

### Frontend
- **Next.js 13+** con App Router
- **TypeScript** para tipado estático
- **Tailwind CSS** con configuración personalizada
- **Framer Motion** para animaciones fluidas
- **React Hook Form** + **Zod** para formularios validados
- **TanStack Query** para manejo de estado del servidor
- **Recharts** para visualización de datos

### Backend
- **Next.js API Routes**
<<<<<<< HEAD
- **PostgreSQL** con Prisma ORM
=======
- **PostgreSQL** con Neon Database
>>>>>>> 4c730993c4f2eb0740243b54c93f58c73181db25
- **Autenticación JWT** con refresh tokens
- **Nodemailer** para notificaciones por correo
- **XLSX** para exportación a Excel
- **PDFKit** para generación de documentos

<<<<<<< HEAD
### DevOps
=======
### DevOps y Herramientas
>>>>>>> 4c730993c4f2eb0740243b54c93f58c73181db25
- **Docker** para entornos de desarrollo
- **GitHub Actions** para CI/CD
- **ESLint** + **Prettier** para calidad de código
- **Jest** + **Testing Library** para pruebas unitarias
- **Cypress** para pruebas E2E
<<<<<<< HEAD

## 🏗️ Estructura del Proyecto



=======
- **PostCSS** para procesamiento de CSS
- **PNPM** como gestor de paquetes
- **Neon Database** como base de datos PostgreSQL serverless

## 🏗️ Estructura del Proyecto

```
cromu/
├── 📂 .git/                    # Control de versiones Git
├── 📂 .next/                   # Build de Next.js (generado)
├── 📂 .vercel/                 # Configuración de Vercel
├── 📂 app/                     # App Router de Next.js 13+
│   ├── layout.tsx              # Layout principal
│   ├── page.tsx                # Página de inicio
│   ├── globals.css             # Estilos globales
│   ├── ahorradores/            # Módulo de ahorradores
│   ├── prestamos/              # Módulo de préstamos
│   ├── dashboard/              # Panel de administración
│   ├── api/                    # API Routes
│   │   ├── auth/               # Autenticación
│   │   ├── ahorradores/        # Endpoints de ahorradores
│   │   └── prestamos/          # Endpoints de préstamos
│   └── components/             # Componentes específicos de páginas
├── 📂 components/              # Componentes reutilizables
│   ├── ui/                     # Componentes base (shadcn/ui)
│   ├── forms/                  # Componentes de formularios
│   ├── charts/                 # Componentes de gráficos
│   └── layout/                 # Componentes de layout
├── 📂 context/                 # Contextos de React
│   ├── AuthContext.tsx         # Contexto de autenticación
│   └── ThemeContext.tsx        # Contexto de tema
├── 📂 contexts/                # Contextos adicionales
├── 📂 hooks/                   # Custom hooks
│   ├── useAuth.ts              # Hook de autenticación
│   ├── useAhorradores.ts       # Hook para ahorradores
│   └── usePrestamos.ts         # Hook para préstamos
├── 📂 lib/                     # Utilidades y configuraciones
│   ├── database.ts             # Configuración de Neon Database
│   ├── auth.ts                 # Utilidades de autenticación
│   ├── utils.ts                # Utilidades generales
│   ├── validations.ts          # Esquemas de validación Zod
│   └── constants.ts            # Constantes del proyecto
├── 📂 node_modules/            # Dependencias (generado)
├── 📂 public/                  # Archivos estáticos
│   ├── logo-cromu.png          # Logo del proyecto
│   ├── favicon.ico             # Favicon
│   └── images/                 # Imágenes estáticas
├── 📂 styles/                  # Estilos adicionales
│   ├── components.css          # Estilos de componentes
│   └── utilities.css           # Utilidades CSS
├── 📄 .env                     # Variables de entorno
├── 📄 .eslintrc.json           # Configuración ESLint
├── 📄 .gitignore               # Archivos ignorados por Git
├── 📄 components.json          # Configuración shadcn/ui
├── 📄 middleware.ts            # Middleware de Next.js
├── 📄 next.config.mjs          # Configuración de Next.js
├── 📄 next-env.d.ts            # Tipos de Next.js
├── 📄 package.json             # Dependencias y scripts
├── 📄 package-lock.json        # Lock de dependencias NPM
├── 📄 pnpm-lock.yaml           # Lock de dependencias PNPM
├── 📄 pnpm-workspace.yaml      # Configuración workspace PNPM
├── 📄 postcss.config.mjs       # Configuración PostCSS
├── 📄 README.md                # Documentación del proyecto
├── 📄 tailwind.config.js       # Configuración Tailwind CSS
├── 📄 tsconfig.json            # Configuración TypeScript
├── 📄 tsconfig.tsbuildinfo     # Cache de TypeScript
└── 📄 v0-user-next.config.mjs  # Configuración adicional
```
>>>>>>> 4c730993c4f2eb0740243b54c93f58c73181db25

## 🚀 Guía de Instalación

### Requisitos Previos
<<<<<<< HEAD
- Node.js 18+
- PostgreSQL 14+
- pnpm 8.x (recomendado)
=======
- **Node.js 18+**
- **Cuenta en Neon Database** (PostgreSQL serverless)
- **PNPM 8.x** (recomendado)
- **Git**
>>>>>>> 4c730993c4f2eb0740243b54c93f58c73181db25

### Configuración Inicial

1. **Clonar el repositorio**
   ```bash
<<<<<<< HEAD
   git clone [https://github.com/tu-usuario/cromu.git](https://github.com/juancho.szs_/cromu.git)
   cd cromu

2- **Instalar dependencias**
   ```bash
   pnpm install


3- **Documentacion Tecnica**
   Ahorrador
   interface Ahorrador {
=======
   git clone https://github.com/juancho.szs_/cromu.git
   cd cromu
   ```

2. **Instalar dependencias**
   ```bash
   pnpm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```
   
   Edita el archivo `.env` con tus configuraciones:
   ```env
   # Base de datos Neon
   DATABASE_URL="postgresql://usuario:contraseña@ep-xxxx-xxxx.us-east-1.aws.neon.tech/cromu?sslmode=require"
   
   # Autenticación
   NEXTAUTH_SECRET="tu-secreto-jwt"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Email
   EMAIL_HOST="smtp.gmail.com"
   EMAIL_PORT=587
   EMAIL_USER="tu-email@gmail.com"
   EMAIL_PASS="tu-contraseña"
   ```

4. **Configurar base de datos**
   ```bash
   # Crear las tablas en Neon Database
   pnpm db:setup
   
   # Poblar datos iniciales (opcional)
   pnpm db:seed
   ```

5. **Ejecutar en desarrollo**
   ```bash
   pnpm dev
   ```

   La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 📋 Scripts Disponibles

```bash
# Desarrollo
pnpm dev                 # Ejecutar en modo desarrollo
pnpm build              # Construir para producción
pnpm start              # Ejecutar build de producción
pnpm lint               # Ejecutar linter
pnpm lint:fix           # Corregir errores de linting

# Base de datos
pnpm db:setup           # Configurar tablas en Neon
pnpm db:seed            # Poblar datos iniciales
pnpm db:backup          # Crear backup de la BD

# Testing
pnpm test               # Ejecutar pruebas unitarias
pnpm test:watch         # Ejecutar pruebas en modo watch
pnpm test:e2e           # Ejecutar pruebas E2E
pnpm test:coverage      # Generar reporte de cobertura

# Utilidades
pnpm type-check         # Verificar tipos TypeScript
pnpm format             # Formatear código con Prettier
```

## 📊 Documentación Técnica

### Modelo de Datos

#### Ahorrador
```typescript
interface Ahorrador {
>>>>>>> 4c730993c4f2eb0740243b54c93f58c73181db25
  id: string;
  nombre: string;
  cedula: string;
  fechaIngreso: Date;
  telefono: string;
  direccion: string;
  email: string;
  ahorroTotal: number;
  pagosConsecutivos: number;
  historialPagos: Record<string, {
    pagado: boolean;
    monto: number;
    consignaciones: Array<{
      fecha: string;
      monto: number;
      descripcion?: string;
    }>;
  }>;
  incentivoPorFidelidad: boolean;
}
<<<<<<< HEAD

Prestamo
=======
```

#### Préstamo
```typescript
>>>>>>> 4c730993c4f2eb0740243b54c93f58c73181db25
interface Prestamo {
  id: string;
  nombreDeudor: string;
  cedula: string;
  telefono: string;
  direccion: string;
  monto: number;
  tasaInteres: number;
  plazoMeses: number;
  fechaDesembolso: Date;
  fechaVencimiento: Date;
  garantia?: string;
  estado: 'Activo' | 'Pagado' | 'Vencido' | 'Refinanciado';
  historialPagos: Record<string, {
    estado: 'pendiente' | 'pagado' | 'aplazado';
    monto: number;
    fechaPago?: Date;
    subcuotas: Array<{
      numero: string;
      estado: 'pendiente' | 'pagado';
      monto: number;
      fechaPago?: Date;
    }>;
  }>;
}
<<<<<<< HEAD

   
Este README proporciona una documentación exhaustiva que cubre todos los aspectos del proyecto, desde la instalación hasta la arquitectura, modelos de datos y referencia de API. Puedes personalizarlo aún más según las necesidades específicas de tu proyecto.

=======
```

### API Endpoints

#### Ahorradores
```typescript
// GET /api/ahorradores
// Obtener todos los ahorradores con paginación
GET /api/ahorradores?page=1&limit=10&search=nombre

// GET /api/ahorradores/[id]
// Obtener un ahorrador específico
GET /api/ahorradores/123

// POST /api/ahorradores
// Crear nuevo ahorrador
POST /api/ahorradores
Body: { nombre, cedula, telefono, direccion, email }

// PUT /api/ahorradores/[id]
// Actualizar ahorrador
PUT /api/ahorradores/123
Body: { nombre, telefono, direccion, email }

// POST /api/ahorradores/[id]/consignacion
// Registrar nueva consignación
POST /api/ahorradores/123/consignacion
Body: { monto, fecha, descripcion }

// GET /api/ahorradores/[id]/historial
// Obtener historial de pagos
GET /api/ahorradores/123/historial?year=2025&month=1
```

#### Préstamos
```typescript
// GET /api/prestamos
// Obtener todos los préstamos con filtros
GET /api/prestamos?estado=Activo&page=1&limit=10

// GET /api/prestamos/[id]
// Obtener un préstamo específico
GET /api/prestamos/456

// POST /api/prestamos
// Crear nuevo préstamo
POST /api/prestamos
Body: { nombreDeudor, cedula, monto, tasaInteres, plazoMeses, garantia }

// POST /api/prestamos/[id]/pago
// Registrar pago de cuota
POST /api/prestamos/456/pago
Body: { cuota, monto, fechaPago }

// POST /api/prestamos/[id]/refinanciar
// Refinanciar préstamo
POST /api/prestamos/456/refinanciar
Body: { nuevoMonto, nuevaTasa, nuevoplazo }

// GET /api/prestamos/[id]/amortizacion
// Generar tabla de amortización
GET /api/prestamos/456/amortizacion
```

#### Reportes
```typescript
// GET /api/reportes/dashboard
// Métricas del dashboard
GET /api/reportes/dashboard

// GET /api/reportes/ahorradores
// Reporte de ahorradores
GET /api/reportes/ahorradores?formato=excel&periodo=2025-01

// GET /api/reportes/prestamos
// Reporte de préstamos
GET /api/reportes/prestamos?estado=Activo&formato=pdf

// GET /api/reportes/cartera
// Reporte de cartera vencida
GET /api/reportes/cartera?diasVencimiento=30
```

## 🔐 Autenticación y Seguridad

### Sistema de Autenticación
- **JWT Tokens** con refresh tokens automáticos
- **Sesiones seguras** con httpOnly cookies
- **Roles y permisos** granulares
- **Middleware de protección** en rutas sensibles

### Roles del Sistema
```typescript
enum UserRole {
  ADMIN = 'admin',           // Acceso completo
  MANAGER = 'manager',       // Gestión de operaciones
  OPERATOR = 'operator',     // Operaciones básicas
  VIEWER = 'viewer'          // Solo lectura
}
```

### Permisos por Módulo
- **Ahorradores**: crear, leer, actualizar, eliminar
- **Préstamos**: crear, leer, actualizar, refinanciar
- **Reportes**: generar, descargar, compartir
- **Usuarios**: gestionar roles y permisos

## 📱 Funcionalidades Avanzadas

### Sistema de Notificaciones
- **Email automático** para recordatorios de pago
- **Alertas en tiempo real** para cuotas vencidas
- **Notificaciones push** para eventos importantes
- **Configuración personalizable** por usuario

### Exportación de Datos
- **Excel** para reportes financieros
- **PDF** para certificados y documentos legales
- **CSV** para análisis de datos
- **Backup automático** de información crítica

### Dashboard Analytics
- **Métricas en tiempo real** de cartera total
- **Gráficos interactivos** de crecimiento
- **Indicadores KPI** del negocio
- **Alertas de riesgo** automatizadas

## 🧪 Testing

### Estructura de Pruebas
```
tests/
├── __mocks__/              # Mocks globales
├── unit/                   # Pruebas unitarias
│   ├── components/         # Componentes React
│   ├── hooks/              # Custom hooks
│   ├── utils/              # Utilidades
│   └── api/                # API endpoints
├── integration/            # Pruebas de integración
│   ├── auth/               # Flujos de autenticación
│   ├── ahorradores/        # Módulo ahorradores
│   └── prestamos/          # Módulo préstamos
└── e2e/                    # Pruebas end-to-end
    ├── auth.spec.ts        # Login/logout
    ├── dashboard.spec.ts   # Dashboard principal
    └── workflows.spec.ts   # Flujos completos
```

### Comandos de Testing
```bash
# Ejecutar todas las pruebas
pnpm test

# Pruebas con cobertura
pnpm test:coverage

# Pruebas en modo watch
pnpm test:watch

# Pruebas E2E con Cypress
pnpm test:e2e

# Pruebas E2E en modo interactivo
pnpm cypress:open
```

## 🚀 Despliegue

### Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel

# Configurar variables de entorno en Vercel
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
```

### Docker
```dockerfile
# Dockerfile incluido en el proyecto
docker build -t cromu .
docker run -p 3000:3000 cromu
```

### Variables de Entorno de Producción
```env
# Base de datos
DATABASE_URL="tu-url-de-neon-produccion"

# Autenticación
NEXTAUTH_SECRET="secreto-super-seguro-produccion"
NEXTAUTH_URL="https://tu-dominio.com"

# Email
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="notifications@tu-dominio.com"
EMAIL_PASS="contraseña-app-gmail"

# Opcional: Analytics
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

## 🤝 Contribución

### Guía para Contribuir
1. **Fork** el repositorio
2. **Crear rama** para nueva feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** cambios (`git commit -m 'Add: nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. **Crear Pull Request**

### Estándares de Código
- **ESLint** y **Prettier** configurados
- **Conventional Commits** para mensajes
- **TypeScript strict mode** habilitado
- **Pruebas unitarias** requeridas para nuevas features

### Estructura de Commits
```
feat: nueva funcionalidad
fix: corrección de bug
docs: actualización de documentación
style: cambios de formato
refactor: refactorización de código
test: agregar/actualizar pruebas
chore: tareas de mantenimiento
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Soporte

- **Documentación**: [Wiki del proyecto](https://github.com/juancho.szs_/cromu/wiki)
- **Issues**: [GitHub Issues](https://github.com/juancho.szs_/cromu/issues)
- **Contacto**: juanchopolas04090@gmail.com

## 📈 Roadmap

### Versión 2.0 (Q3 2025)
- [ ] **Módulo de Reportes Avanzados** con Business Intelligence
- [ ] **API REST pública** para integraciones
- [ ] **App móvil** con React Native
- [ ] **Integración con bancos** para pagos automáticos

### Versión 2.1 (Q4 2025)
- [ ] **Machine Learning** para análisis de riesgo crediticio
- [ ] **Módulo de contabilidad** completo
- [ ] **Multi-tenancy** para múltiples cooperativas
- [ ] **Blockchain** para trazabilidad de transacciones

---

**CROMU** - Desarrollado con ❤️ para modernizar la gestión financiera cooperativa
>>>>>>> 4c730993c4f2eb0740243b54c93f58c73181db25
