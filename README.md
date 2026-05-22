# HR Talent — Sistema de Gestión de RRHH

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express_4-339933?logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-pg_8-4169E1?logo=postgresql)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)
![Railway](https://img.shields.io/badge/API%20%2B%20DB-Railway-7B2FBE?logo=railway)

Sistema web full-stack para la captación, seguimiento y evaluación de talento humano. Permite gestionar candidatos, publicar vacantes, registrar entrevistas y evaluar perfiles mediante un panel centralizado.

---

## Demo

🌐 [https://hr-talent-sistema.vercel.app](https://hr-talent-sistema.vercel.app)

---

## Screenshots

| Dashboard | Candidatos | Vacantes |
|-----------|------------|----------|
| Vista de métricas generales (total candidatos, en proceso, contratados, vacantes) | Listado con búsqueda, filtro por estado, registro y edición | Listado con creación y edición de vacantes |

---

## Arquitectura

El proyecto sigue el patrón **MVC** tanto en el backend como en el frontend, y está organizado como un **monorepo**.

```
hr-talent-sistema/
├── hr-talent-api/        ← API REST (Node.js + Express)
│   └── src/
│       ├── routes/       ← Definición de endpoints y validaciones
│       ├── controllers/  ← Recibe la petición y delega al servicio
│       ├── services/     ← Lógica de negocio
│       ├── repositories/ ← Consultas SQL a PostgreSQL
│       ├── middlewares/  ← Validación (express-validator) y manejo de errores
│       └── config/       ← Conexión a la base de datos (pg Pool)
│
└── hr-talent-frontend/   ← Frontend (Next.js + React)
    └── src/
        ├── app/          ← Páginas (App Router de Next.js)
        ├── components/   ← Componentes UI por módulo (CSS Modules)
        ├── hooks/        ← Custom hooks (estado + llamadas a la API)
        ├── services/     ← Comunicación HTTP con la API
        └── models/       ← Clases de dominio (Candidato, Vacante)
```

**Flujo de datos en el frontend:**

```
Página → Hook → Service → API REST → PostgreSQL
          ↓
       Modelo (clase JS)
          ↓
       Componente (render)
```

---

## Tecnologías

### Frontend
| Tecnología | Versión | Uso |
|-----------|---------|-----|
| Next.js | 16 | Framework React con App Router |
| React | 18 | UI con hooks (useState, useEffect, useCallback, useMemo) |
| CSS Modules | — | Estilos con alcance local por componente |
| Reactstrap + Bootstrap | 9 / 5.3 | Componentes de ejemplo |

### Backend
| Tecnología | Versión | Uso |
|-----------|---------|-----|
| Node.js + Express | 4.19 | API REST |
| express-validator | 7.1 | Validación de body en los endpoints |
| pg (node-postgres) | 8.12 | Conexión a PostgreSQL |
| dotenv | 16 | Variables de entorno |
| nodemon | 3.1 | Recarga automática en desarrollo |

### Infraestructura
| Servicio | Uso |
|---------|-----|
| Vercel | Deploy del frontend (Next.js) |
| Railway | Deploy de la API + base de datos PostgreSQL |

---

## Estructura del proyecto

```
hr-talent-sistema/
│
├── hr-talent-api/
│   ├── src/
│   │   ├── app.js                  ← Entrada principal, CORS, rutas
│   │   ├── config/database.js      ← Pool de conexión PostgreSQL
│   │   ├── routes/
│   │   │   ├── candidatos.routes.js
│   │   │   ├── vacantes.routes.js
│   │   │   ├── evaluaciones.routes.js
│   │   │   ├── entrevistas.routes.js
│   │   │   └── reportes.routes.js
│   │   ├── controllers/            ← Un archivo por módulo
│   │   ├── services/               ← Un archivo por módulo
│   │   ├── repositories/           ← Un archivo por módulo
│   │   └── middlewares/
│   │       ├── validate.js         ← Middleware express-validator
│   │       └── errorHandler.js     ← Manejo centralizado de errores
│   └── package.json
│
└── hr-talent-frontend/
    ├── src/
    │   ├── app/
    │   │   ├── page.jsx            ← Dashboard (Server Component)
    │   │   ├── candidatos/page.jsx
    │   │   ├── vacantes/page.jsx
    │   │   └── ejemplos/           ← Páginas de demo (hooks, props, reactstrap)
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── candidatos/         ← CandidatoCard, CandidatoForm, CandidatoModal
    │   │   └── vacantes/           ← VacanteCard, VacanteForm
    │   ├── hooks/
    │   │   ├── useCandidatos.js
    │   │   └── useVacantes.js
    │   ├── services/
    │   │   ├── candidatosService.js
    │   │   └── vacantesService.js
    │   └── models/
    │       ├── Candidato.js
    │       └── Vacante.js
    └── package.json
```

---

## Instalación

### Requisitos previos
- Node.js 18+
- PostgreSQL 14+
- npm

### 1. Clonar el repositorio

```bash
git clone https://github.com/davidvalles1102/hr-talent-sistema.git
cd hr-talent-sistema
```

### 2. Configurar la API

```bash
cd hr-talent-api
npm install
```

Crear el archivo `.env` (ver sección [Variables de entorno](#variables-de-entorno)).

Ejecutar el schema SQL en tu base de datos PostgreSQL local (ver sección [Esquema de base de datos](#esquema-de-base-de-datos)).

```bash
npm run dev   # Inicia en http://localhost:3000
```

### 3. Configurar el frontend

```bash
cd ../hr-talent-frontend
npm install
```

Crear el archivo `.env.local` (ver sección [Variables de entorno](#variables-de-entorno)).

```bash
npm run dev   # Inicia en http://localhost:3001
```

---

## Variables de entorno

### API — `hr-talent-api/.env`

```env
# Opción A: cadena de conexión completa (Railway u otro proveedor)
DATABASE_URL=postgresql://usuario:password@host:port/database

# Opción B: variables individuales (desarrollo local)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hr_talent
DB_USER=postgres
DB_PASSWORD=tu_password

PORT=3000
```

> Si `DATABASE_URL` está definido, tiene prioridad y se usa con SSL. Si no, se usan las variables individuales sin SSL.

### Frontend — `hr-talent-frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

> En producción (Vercel) este valor debe incluir el protocolo completo: `https://tu-api.up.railway.app`

---

## Endpoints

**Base URL:** `https://tu-api.up.railway.app` (prod) · `http://localhost:3000` (local)

Todas las respuestas siguen el formato:
```json
{ "success": true, "data": { } }
{ "success": false, "error": "mensaje" }
{ "success": false, "errors": [{ "campo": "email", "mensaje": "Email invalido" }] }
```

### Candidatos

| Método | Ruta | Body requerido | Respuesta |
|--------|------|----------------|-----------|
| GET | `/candidatos` | — | `200` array de candidatos activos |
| GET | `/candidatos/:id` | — | `200` candidato · `404` no encontrado |
| POST | `/candidatos` | `nombre`*, `apellido`*, `email`*, `puesto_interes`*, `telefono`, `nivel_educativo`, `anios_experiencia`, `notas` | `201` creado · `400` validación |
| PUT | `/candidatos/:id` | Mismos campos + `estado` (`activo`/`en_proceso`/`contratado`/`descartado`) | `200` · `404` · `400` |
| DELETE | `/candidatos/:id` | — | `200` soft delete (activo=false) · `404` |

### Vacantes

| Método | Ruta | Body requerido | Respuesta |
|--------|------|----------------|-----------|
| GET | `/vacantes` | — | `200` array de vacantes |
| GET | `/vacantes/:id` | — | `200` · `404` |
| POST | `/vacantes` | `titulo`*, `departamento`*, `descripcion`, `requisitos`, `modalidad`, `salario_min`, `salario_max` | `201` · `400` |
| PUT | `/vacantes/:id` | Mismos campos + `estado` (`abierta`/`pausada`/`cerrada`) | `200` · `404` |

### Evaluaciones

| Método | Ruta | Body requerido | Respuesta |
|--------|------|----------------|-----------|
| GET | `/evaluaciones/:candidatoId` | — | `200` array (vacío si no tiene) |
| POST | `/evaluaciones` | `candidato_id`*, `evaluador_id`*, `tipo`* (`tecnica`/`actitudinal`/`cultural`), `puntaje_tecnico`*, `puntaje_actitudinal`*, `puntaje_cultural`* (0–10), `vacante_id`, `comentarios` | `201` · `400` |

### Entrevistas

| Método | Ruta | Body requerido | Respuesta |
|--------|------|----------------|-----------|
| GET | `/entrevistas` | — | `200` array con JOIN a candidatos, vacantes y entrevistador |
| POST | `/entrevistas` | `candidato_id`*, `entrevistador_id`*, `fecha_hora`* (ISO 8601), `modalidad`* (`presencial`/`virtual`/`telefonica`), `vacante_id`, `ubicacion`, `notas` | `201` · `400` |
| PATCH | `/entrevistas/:id/estado` | `estado` | `200` · `404` |

### Reportes

| Método | Ruta | Respuesta |
|--------|------|-----------|
| GET | `/reportes/talentos` | `200` métricas generales + candidatos por vacante |

---

## Esquema de base de datos

```sql
candidatos
  id, nombre, apellido, email, telefono, puesto_interes,
  nivel_educativo, anios_experiencia, cv_url, notas,
  estado (activo | en_proceso | contratado | descartado),
  activo BOOLEAN, fecha_registro, updated_at

vacantes
  id, titulo, descripcion, departamento, requisitos,
  modalidad (presencial | remoto | hibrido),
  salario_min, salario_max,
  estado (abierta | pausada | cerrada),
  responsable_id → usuarios_rrhh, fecha_publicacion, updated_at

evaluaciones
  id, candidato_id → candidatos, vacante_id → vacantes,
  evaluador_id → usuarios_rrhh,
  tipo (tecnica | actitudinal | cultural),
  puntaje_tecnico, puntaje_actitudinal, puntaje_cultural (0–10),
  comentarios, fecha

entrevistas
  id, candidato_id → candidatos, vacante_id → vacantes,
  entrevistador_id → usuarios_rrhh,
  fecha_hora, modalidad (presencial | virtual | telefonica),
  ubicacion, notas, estado, updated_at

usuarios_rrhh
  id, nombre
```

---

## Funcionalidades

- **Dashboard** — métricas en tiempo real: total de candidatos, en proceso, contratados y vacantes abiertas
- **Candidatos** — registro, búsqueda por nombre/email, filtro por estado, edición y eliminación (soft delete)
- **Puesto de interés** — dropdown dinámico con las vacantes abiertas al registrar un candidato
- **Vacantes** — creación, edición de título, departamento, modalidad, salario y estado
- **Diseño responsivo** — navbar con menú hamburguesa en mobile, grid adaptable en todas las vistas
- **Validación** — en frontend (HTML5 required) y en backend (express-validator) con mensajes descriptivos
- **Manejo de errores centralizado** — middleware global con respuestas JSON consistentes

---

## Retos

- **Conexión a Railway con SSL** — la variable `DB_PORT` llegaba como `NaN` al parsearla. Se resolvió usando `DATABASE_URL` como cadena de conexión completa con `ssl: { rejectUnauthorized: false }`.
- **Monorepo en Railway** — Railway intentaba deployar la raíz del repo. Se corrigió configurando el *Root Directory* del servicio Node.js a `hr-talent-api`.
- **`NEXT_PUBLIC_API_URL` en Vercel** — sin el prefijo `https://` Next.js trataba la URL como ruta relativa. El error fue detectado inspeccionando las peticiones en DevTools.
- **Diseño responsivo sin librerías** — el navbar requirió convertir el Server Component a Client Component (`'use client'`) para poder usar `useState` en el toggle del menú hamburguesa.
- **Campos no guardados en BD** — `nivel_educativo` y `anios_experiencia` no se incluían en el `INSERT` ni en el `UPDATE` de candidatos. Se corrigió en la capa de repositorio.

---

## Futuras mejoras

- [ ] Páginas de entrevistas y evaluaciones con sus formularios
- [ ] Página de reportes consumiendo `GET /reportes/talentos` con gráficas
- [ ] Autenticación con JWT para proteger los endpoints
- [ ] Paginación en los listados de candidatos y vacantes
- [ ] Carga de CV (archivo PDF) con almacenamiento en nube
- [ ] Notificaciones por email al agendar una entrevista

---

## Autor

**David Valles**
[@davidvalles1102](https://github.com/davidvalles1102)
