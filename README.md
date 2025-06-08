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
- **PostgreSQL** con Prisma ORM
- **Autenticación JWT** con refresh tokens
- **Nodemailer** para notificaciones por correo
- **XLSX** para exportación a Excel
- **PDFKit** para generación de documentos

### DevOps
- **Docker** para entornos de desarrollo
- **GitHub Actions** para CI/CD
- **ESLint** + **Prettier** para calidad de código
- **Jest** + **Testing Library** para pruebas unitarias
- **Cypress** para pruebas E2E

## 🏗️ Estructura del Proyecto




## 🚀 Guía de Instalación

### Requisitos Previos
- Node.js 18+
- PostgreSQL 14+
- pnpm 8.x (recomendado)

### Configuración Inicial

1. **Clonar el repositorio**
   ```bash
   git clone [https://github.com/tu-usuario/cromu.git](https://github.com/juancho.szs_/cromu.git)
   cd cromu

2- **Instalar dependencias**
   ```bash
   pnpm install


3- **Documentacion Tecnica**
   Ahorrador
   interface Ahorrador {
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

Prestamo
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

   
Este README proporciona una documentación exhaustiva que cubre todos los aspectos del proyecto, desde la instalación hasta la arquitectura, modelos de datos y referencia de API. Puedes personalizarlo aún más según las necesidades específicas de tu proyecto.

