# Manual Técnico — Sistema de Evaluación de RRHH (HR Talent)

**Versión:** 1.0  
**Fecha:** Mayo 2026  
**Tecnologías:** PostgreSQL · Node.js · Express · Next.js · React

---

## Índice

1. [Base de Datos](#1-base-de-datos)
2. [API REST](#2-api-rest)
3. [Frontend](#3-frontend)

---

# 1. Base de Datos

## 1.1 Descripción General

La base de datos `hr_talent_db` almacena toda la información del sistema de evaluación de recursos humanos. Gestiona candidatos, vacantes, evaluaciones técnicas, entrevistas y los usuarios del área de RRHH que operan el sistema.

- **Motor:** PostgreSQL 14+
- **Codificación:** UTF-8
- **Gestor recomendado:** DBeaver

## 1.2 Scripts de Instalación

| Archivo | Propósito | Orden de ejecución |
|---|---|---|
| `database/01_ddl_schema.sql` | Crea la base de datos y todas las tablas | 1° |
| `database/02_dml_seeds.sql` | Inserta datos de prueba (semillas) | 2° |
| `database/03_dml_ejercicios.sql` | Ejercicios de práctica DML | Opcional |

**Pasos en DBeaver:**
1. Conectarse a la base `postgres` (por defecto)
2. Ejecutar `01_ddl_schema.sql` completo
3. Crear nueva conexión apuntando a `hr_talent_db`
4. Ejecutar `02_dml_seeds.sql`

## 1.3 Diagrama de Relaciones (ER)

```
usuarios_rrhh
    │
    ├──< vacantes (responsable_id → SET NULL al borrar)
    │
    ├──< evaluaciones (evaluador_id → RESTRICT al borrar)
    │
    └──< entrevistas (entrevistador_id → RESTRICT al borrar)

candidatos
    │
    ├──< evaluaciones (candidato_id → CASCADE al borrar)
    │
    └──< entrevistas (candidato_id → CASCADE al borrar)

vacantes
    ├──< evaluaciones (vacante_id → SET NULL al borrar)
    └──< entrevistas (vacante_id → SET NULL al borrar)
```

## 1.4 Descripción de Tablas

### `usuarios_rrhh`
Personas del área de RRHH que operan el sistema.

| Columna | Tipo | Restricción | Descripción |
|---|---|---|---|
| `id` | SERIAL | PK | Identificador único |
| `nombre` | VARCHAR(80) | NOT NULL | Nombre del usuario |
| `apellido` | VARCHAR(80) | NOT NULL | Apellido del usuario |
| `email` | VARCHAR(150) | NOT NULL, UNIQUE | Correo electrónico |
| `rol` | VARCHAR(40) | NOT NULL, DEFAULT 'evaluador' | `reclutador`, `evaluador`, `gerente_rrhh` |
| `departamento` | VARCHAR(100) | — | Área de la empresa |
| `activo` | BOOLEAN | NOT NULL, DEFAULT true | Soft delete |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Fecha de creación |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Última modificación |

### `vacantes`
Posiciones abiertas dentro de la empresa.

| Columna | Tipo | Restricción | Descripción |
|---|---|---|---|
| `id` | SERIAL | PK | Identificador único |
| `titulo` | VARCHAR(150) | NOT NULL | Nombre del puesto |
| `descripcion` | TEXT | — | Descripción del cargo |
| `departamento` | VARCHAR(100) | NOT NULL | Área solicitante |
| `requisitos` | TEXT | — | Requisitos del puesto |
| `modalidad` | VARCHAR(20) | NOT NULL | `presencial`, `remoto`, `hibrido` |
| `salario_min` | NUMERIC(10,2) | — | Salario mínimo ofertado |
| `salario_max` | NUMERIC(10,2) | — | Salario máximo ofertado |
| `estado` | VARCHAR(20) | NOT NULL, DEFAULT 'abierta' | `abierta`, `pausada`, `cerrada` |
| `responsable_id` | INT | FK → usuarios_rrhh | Usuario responsable |
| `fecha_publicacion` | DATE | NOT NULL, DEFAULT CURRENT_DATE | Fecha de apertura |
| `fecha_cierre` | DATE | — | Fecha de cierre |

**Constraint:** `salario_max >= salario_min`

### `candidatos`
Personas que postulan a las vacantes.

| Columna | Tipo | Restricción | Descripción |
|---|---|---|---|
| `id` | SERIAL | PK | Identificador único |
| `nombre` | VARCHAR(80) | NOT NULL | Nombre |
| `apellido` | VARCHAR(80) | NOT NULL | Apellido |
| `email` | VARCHAR(150) | NOT NULL, UNIQUE | Correo electrónico |
| `telefono` | VARCHAR(20) | — | Teléfono de contacto |
| `fecha_nacimiento` | DATE | — | Fecha de nacimiento |
| `nivel_educativo` | VARCHAR(50) | — | `bachillerato`, `tecnico`, `universitario`, `postgrado`, `maestria`, `doctorado` |
| `anios_experiencia` | SMALLINT | DEFAULT 0, >= 0 | Años de experiencia laboral |
| `puesto_interes` | VARCHAR(150) | NOT NULL | Cargo al que aplica |
| `cv_url` | VARCHAR(300) | — | Enlace al CV |
| `notas` | TEXT | — | Observaciones internas |
| `estado` | VARCHAR(20) | NOT NULL, DEFAULT 'activo' | `activo`, `en_proceso`, `contratado`, `descartado` |
| `activo` | BOOLEAN | NOT NULL, DEFAULT true | Soft delete |
| `fecha_registro` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Fecha de postulación |

### `evaluaciones`
Resultado de evaluar a un candidato para una vacante.

| Columna | Tipo | Restricción | Descripción |
|---|---|---|---|
| `id` | SERIAL | PK | Identificador único |
| `candidato_id` | INT | FK → candidatos (CASCADE) | Candidato evaluado |
| `vacante_id` | INT | FK → vacantes (SET NULL) | Vacante relacionada |
| `evaluador_id` | INT | FK → usuarios_rrhh (RESTRICT) | Usuario que evalúa |
| `tipo` | VARCHAR(20) | NOT NULL | `tecnica`, `actitudinal`, `cultural` |
| `puntaje_tecnico` | NUMERIC(4,2) | 0–10 | Puntaje técnico |
| `puntaje_actitudinal` | NUMERIC(4,2) | 0–10 | Puntaje actitudinal |
| `puntaje_cultural` | NUMERIC(4,2) | 0–10 | Puntaje de cultura |
| `puntaje_total` | NUMERIC(4,2) | **COLUMNA GENERADA** | Promedio automático de los 3 puntajes |
| `resultado` | VARCHAR(20) | DEFAULT 'pendiente' | `aprobado`, `reprobado`, `pendiente` |
| `comentarios` | TEXT | — | Observaciones del evaluador |
| `fecha` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Fecha de la evaluación |

> **Nota:** `puntaje_total` es una columna calculada automáticamente por PostgreSQL:  
> `ROUND((puntaje_tecnico + puntaje_actitudinal + puntaje_cultural) / 3.0, 2)`  
> No se puede insertar ni modificar manualmente.

### `entrevistas`
Citas agendadas entre candidatos y entrevistadores.

| Columna | Tipo | Restricción | Descripción |
|---|---|---|---|
| `id` | SERIAL | PK | Identificador único |
| `candidato_id` | INT | FK → candidatos (CASCADE) | Candidato citado |
| `vacante_id` | INT | FK → vacantes (SET NULL) | Vacante relacionada |
| `entrevistador_id` | INT | FK → usuarios_rrhh (RESTRICT) | Usuario entrevistador |
| `fecha_hora` | TIMESTAMP | NOT NULL | Fecha y hora de la cita |
| `duracion_min` | SMALLINT | DEFAULT 60, > 0 | Duración en minutos |
| `modalidad` | VARCHAR(20) | NOT NULL | `presencial`, `virtual`, `telefonica` |
| `ubicacion` | VARCHAR(200) | — | Sala, URL o dirección |
| `estado` | VARCHAR(20) | DEFAULT 'pendiente' | `pendiente`, `completada`, `cancelada`, `no_presentado` |
| `calificacion` | SMALLINT | 1–5 | Calificación post-entrevista |
| `observaciones` | TEXT | — | Notas del entrevistador |

## 1.5 Índices

| Índice | Tabla | Columna | Propósito |
|---|---|---|---|
| `idx_candidatos_estado` | candidatos | estado | Filtrar por estado |
| `idx_candidatos_email` | candidatos | email | Búsqueda/unicidad |
| `idx_vacantes_estado` | vacantes | estado | Filtrar vacantes activas |
| `idx_evaluaciones_candidato` | evaluaciones | candidato_id | JOIN con candidatos |
| `idx_evaluaciones_vacante` | evaluaciones | vacante_id | JOIN con vacantes |
| `idx_entrevistas_candidato` | entrevistas | candidato_id | JOIN con candidatos |
| `idx_entrevistas_fecha` | entrevistas | fecha_hora | Ordenar por fecha |

## 1.6 Comportamiento de Claves Foráneas

| Relación | Al eliminar el padre |
|---|---|
| `evaluaciones.candidato_id` → `candidatos` | **CASCADE**: elimina las evaluaciones del candidato |
| `entrevistas.candidato_id` → `candidatos` | **CASCADE**: elimina las entrevistas del candidato |
| `vacantes.responsable_id` → `usuarios_rrhh` | **SET NULL**: la vacante queda sin responsable |
| `evaluaciones.vacante_id` → `vacantes` | **SET NULL**: la evaluación queda sin vacante |
| `entrevistas.vacante_id` → `vacantes` | **SET NULL**: la entrevista queda sin vacante |
| `evaluaciones.evaluador_id` → `usuarios_rrhh` | **RESTRICT**: no permite borrar el evaluador |
| `entrevistas.entrevistador_id` → `usuarios_rrhh` | **RESTRICT**: no permite borrar el entrevistador |

---

# 2. API REST

## 2.1 Descripción General

API RESTful construida con Node.js y Express que expone los datos del sistema de RRHH. Sigue una arquitectura por capas para separar responsabilidades.

- **Runtime:** Node.js 18+
- **Framework:** Express 4
- **Base de datos:** PostgreSQL (driver `pg`)
- **Puerto por defecto:** 3000
- **URL base:** `http://localhost:3000`

## 2.2 Instalación

```bash
cd hr-talent-api
npm install
```

Crear el archivo `.env` en la raíz del proyecto:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hr_talent_db
DB_USER=postgres
DB_PASSWORD=tu_password
PORT=3000
```

Iniciar el servidor:

```bash
# Desarrollo (con recarga automática)
npm run dev

# Producción
npm start
```

## 2.3 Dependencias

| Paquete | Versión | Propósito |
|---|---|---|
| `express` | ^4 | Framework HTTP |
| `pg` | ^8 | Driver PostgreSQL |
| `express-validator` | ^7 | Validación de entradas |
| `cors` | ^2 | Habilitar CORS para el frontend |
| `dotenv` | ^16 | Variables de entorno |
| `nodemon` | ^3 | Recarga automática en desarrollo |

## 2.4 Arquitectura por Capas

```
src/
├── config/
│   └── database.js          ← Pool de conexión PostgreSQL
├── middlewares/
│   ├── errorHandler.js      ← Manejo global de errores
│   └── validate.js          ← Verificador de express-validator
├── routes/
│   └── *.routes.js          ← Definición de rutas + reglas de validación
├── controllers/
│   └── *.controller.js      ← Recibe req, llama al servicio, envía res
├── services/
│   └── *.service.js         ← Lógica de negocio
├── repositories/
│   └── *.repository.js      ← Consultas SQL directas a PostgreSQL
└── app.js                   ← Punto de entrada, registra rutas
```

**Flujo de una petición:**

```
Cliente HTTP
    → Route (valida entrada con express-validator)
    → Controller (extrae datos del req, llama al service)
    → Service (lógica de negocio, lanza errores con .status)
    → Repository (ejecuta SQL con pool.query)
    → Controller (responde { success: true, data })
    → errorHandler (captura cualquier error no controlado)
```

## 2.5 Formato de Respuesta

### Respuesta exitosa

```json
{
  "success": true,
  "data": { ... }
}
```

### Respuesta de error de validación (400)

```json
{
  "success": false,
  "errors": [
    { "campo": "email", "mensaje": "Email invalido" }
  ]
}
```

### Respuesta de error del servidor (4xx / 5xx)

```json
{
  "success": false,
  "error": "Descripción del error"
}
```

## 2.6 Endpoints

### Candidatos `/candidatos`

| Método | Ruta | Descripción | Cuerpo requerido |
|---|---|---|---|
| GET | `/candidatos` | Lista todos los candidatos activos | — |
| GET | `/candidatos/:id` | Obtiene un candidato por ID | — |
| POST | `/candidatos` | Crea un nuevo candidato | Ver abajo |
| PUT | `/candidatos/:id` | Actualiza datos de un candidato | Ver abajo |
| DELETE | `/candidatos/:id` | Inactiva un candidato (soft delete) | — |

**POST /candidatos — Cuerpo:**
```json
{
  "nombre": "Pedro",
  "apellido": "González",
  "email": "pedro@mail.com",
  "telefono": "7788-9900",
  "puesto_interes": "Desarrollador Backend",
  "nivel_educativo": "universitario",
  "anios_experiencia": 3
}
```
Campos requeridos: `nombre`, `apellido`, `email`, `puesto_interes`

**PUT /candidatos/:id — Cuerpo (todos opcionales):**
```json
{
  "nombre": "Pedro",
  "apellido": "González",
  "email": "pedro@mail.com",
  "estado": "en_proceso"
}
```
Valores válidos para `estado`: `activo`, `en_proceso`, `contratado`, `descartado`

---

### Vacantes `/vacantes`

| Método | Ruta | Descripción | Cuerpo requerido |
|---|---|---|---|
| GET | `/vacantes` | Lista todas las vacantes | — |
| GET | `/vacantes/:id` | Obtiene una vacante por ID | — |
| POST | `/vacantes` | Crea una nueva vacante | Ver abajo |
| PUT | `/vacantes/:id` | Actualiza una vacante | Campos opcionales |

**POST /vacantes — Cuerpo:**
```json
{
  "titulo": "Desarrollador Backend",
  "departamento": "Tecnología",
  "descripcion": "Desarrollo de APIs REST",
  "modalidad": "hibrido",
  "salario_min": 800,
  "salario_max": 1200
}
```
Campos requeridos: `titulo`, `departamento`  
Valores válidos para `modalidad`: `presencial`, `remoto`, `hibrido`

---

### Evaluaciones `/evaluaciones`

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/evaluaciones/:candidatoId` | Lista evaluaciones de un candidato |
| POST | `/evaluaciones` | Registra una nueva evaluación |

**POST /evaluaciones — Cuerpo:**
```json
{
  "candidato_id": 1,
  "evaluador_id": 2,
  "vacante_id": 3,
  "tipo": "tecnica",
  "puntaje_tecnico": 8.5,
  "puntaje_actitudinal": 7.0,
  "puntaje_cultural": 9.0,
  "resultado": "aprobado",
  "comentarios": "Buen candidato"
}
```
Todos los puntajes deben estar entre 0 y 10.  
Valores válidos para `tipo`: `tecnica`, `actitudinal`, `cultural`

---

### Entrevistas `/entrevistas`

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/entrevistas` | Lista todas las entrevistas |
| POST | `/entrevistas` | Agenda una nueva entrevista |
| PATCH | `/entrevistas/:id/estado` | Actualiza el estado de una entrevista |

**POST /entrevistas — Cuerpo:**
```json
{
  "candidato_id": 1,
  "entrevistador_id": 2,
  "vacante_id": 3,
  "fecha_hora": "2026-06-15T10:00:00",
  "modalidad": "presencial",
  "duracion_min": 60,
  "ubicacion": "Sala de reuniones A"
}
```
Valores válidos para `modalidad`: `presencial`, `virtual`, `telefonica`

**PATCH /entrevistas/:id/estado — Cuerpo:**
```json
{
  "estado": "completada",
  "calificacion": 4,
  "observaciones": "Excelente candidato"
}
```
Valores válidos para `estado`: `pendiente`, `completada`, `cancelada`, `no_presentado`

---

### Reportes `/reportes`

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/reportes/talentos` | Métricas generales del sistema |

**Respuesta `/reportes/talentos`:**
```json
{
  "success": true,
  "data": {
    "total_candidatos": 15,
    "por_estado": [...],
    "promedio_puntaje": 7.4,
    "top_candidatos": [...]
  }
}
```

## 2.7 Manejo de Errores

El middleware `errorHandler` captura todos los errores no controlados. Los servicios lanzan errores con `.status` para controlar el código HTTP:

```js
// En un service:
const error = new Error('Candidato no encontrado');
error.status = 404;
throw error;
```

Respuesta resultante:
```json
HTTP 404
{
  "success": false,
  "error": "Candidato no encontrado"
}
```

## 2.8 Soft Delete

El sistema **no elimina físicamente** los candidatos. El `DELETE /candidatos/:id` ejecuta:

```sql
UPDATE candidatos SET activo = false WHERE id = $1
```

El `GET /candidatos` solo retorna registros donde `activo = true`.

---

# 3. Frontend

## 3.1 Descripción General

Aplicación web construida con Next.js 16 y React 18 que consume la API REST. Implementa el patrón MVC adaptado al ecosistema de React/Next.js e incluye páginas educativas sobre hooks y props.

- **Framework:** Next.js 16 (App Router)
- **Librería UI:** React 18
- **Estilos:** CSS Modules (sin dependencias externas) + Reactstrap (sección de ejemplos)
- **Puerto:** 3001

## 3.2 Instalación

```bash
cd hr-talent-frontend
npm install
```

Crear el archivo `.env.local` en la raíz:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Iniciar el servidor de desarrollo:

```bash
npm run dev
# Disponible en http://localhost:3001
```

## 3.3 Dependencias

| Paquete | Versión | Propósito |
|---|---|---|
| `next` | ^16 | Framework React con SSR/SSG |
| `react` | ^18 | Librería de UI |
| `react-dom` | ^18 | Renderizado DOM |
| `bootstrap` | ^5.3 | CSS de Bootstrap (solo en sección Reactstrap) |
| `reactstrap` | ^9.2 | Componentes Bootstrap para React |

## 3.4 Patrón MVC en Next.js

| Capa MVC | Implementación | Ubicación |
|---|---|---|
| **Model** | Clases ES6 con getters de negocio | `src/models/` |
| **Controller** | Servicios HTTP + Custom Hooks | `src/services/` y `src/hooks/` |
| **View** | Componentes React + CSS Modules | `src/components/` y `src/app/` |

## 3.5 Estructura de Carpetas

```
hr-talent-frontend/
├── .env.local                         ← Variables de entorno del frontend
├── src/
│   ├── models/
│   │   ├── Candidato.js               ← Clase con getters: nombreCompleto, iniciales, estadoBadge
│   │   └── Vacante.js                 ← Clase con getters: rangoSalario, modalidadIcon, estadoBadge
│   │
│   ├── services/
│   │   ├── candidatosService.js       ← getAll, getById, create, update, remove
│   │   └── vacantesService.js         ← getAll, getById, create
│   │
│   ├── hooks/
│   │   ├── useCandidatos.js           ← useState + useEffect + useCallback para candidatos
│   │   └── useVacantes.js             ← useState + useEffect + useCallback para vacantes
│   │
│   ├── components/
│   │   ├── Navbar.jsx                 ← Navegación principal (Server Component)
│   │   ├── Navbar.module.css
│   │   ├── candidatos/
│   │   │   ├── CandidatoCard.jsx      ← Tarjeta con botones Editar/Eliminar
│   │   │   ├── CandidatoCard.module.css
│   │   │   ├── CandidatoForm.jsx      ← Formulario dual: crear y editar candidatos
│   │   │   ├── CandidatoForm.module.css
│   │   │   ├── CandidatoModal.jsx     ← Overlay modal para edición
│   │   │   └── CandidatoModal.module.css
│   │   └── vacantes/
│   │       ├── VacanteCard.jsx
│   │       └── VacanteCard.module.css
│   │
│   └── app/                           ← App Router de Next.js
│       ├── layout.jsx                 ← Layout raíz: importa globals.css, monta Navbar
│       ├── globals.css                ← Variables CSS, reset, utilidades globales
│       ├── page.jsx                   ← Dashboard (Server Component)
│       ├── candidatos/
│       │   └── page.jsx               ← CRUD completo de candidatos
│       ├── vacantes/
│       │   └── page.jsx               ← Listado de vacantes
│       └── ejemplos/
│           ├── hooks/
│           │   └── page.jsx           ← Demos: useState, useEffect, useMemo, useCallback
│           ├── props/
│           │   └── page.jsx           ← Demos: props básicas, default, callback, children
│           └── reactstrap/
│               ├── layout.jsx         ← Importa Bootstrap CSS solo para esta sección
│               └── page.jsx           ← Ejemplo con componentes Reactstrap
```

## 3.6 Rutas del Frontend

| Ruta | Tipo de componente | Descripción |
|---|---|---|
| `/` | Server Component | Dashboard con estadísticas (fetch server-side) |
| `/candidatos` | Client Component | CRUD completo: listar, crear, editar, eliminar |
| `/vacantes` | Client Component | Listado de vacantes en tarjetas |
| `/ejemplos/hooks` | Client Component | Demos interactivos: useState, useEffect, useMemo, useCallback |
| `/ejemplos/props` | Client Component | Demos: props básicas, valores default, callbacks, children |
| `/ejemplos/reactstrap` | Client Component | Tabla, cards, formulario y modal con Reactstrap |

## 3.7 Modelos

### `Candidato.js`
```js
class Candidato {
  constructor(data) { /* asigna todas las propiedades */ }

  get nombreCompleto()  // "Pedro González"
  get iniciales()       // "PG" — usado para el avatar circular
  get estadoBadge()     // { label, color, bg } — colores según estado
}
```

### `Vacante.js`
```js
class Vacante {
  constructor(data) { /* asigna todas las propiedades */ }

  get rangoSalario()    // "$800 – $1,200"
  get modalidadIcon()   // "🏢 Presencial" / "💻 Remoto" / "🔀 Híbrido"
  get estadoBadge()     // { label, color, bg }
}
```

Los modelos **nunca hacen fetch**. Solo representan datos y calculan propiedades derivadas.

## 3.8 Servicios

Toda comunicación HTTP con la API está centralizada en los servicios. Los componentes nunca llaman a `fetch` directamente.

### `candidatosService.js`

| Función | Método HTTP | Endpoint |
|---|---|---|
| `getAll()` | GET | `/candidatos` |
| `getById(id)` | GET | `/candidatos/:id` |
| `create(data)` | POST | `/candidatos` |
| `update(id, data)` | PUT | `/candidatos/:id` |
| `remove(id)` | DELETE | `/candidatos/:id` |

### `vacantesService.js`

| Función | Método HTTP | Endpoint |
|---|---|---|
| `getAll()` | GET | `/vacantes` |
| `getById(id)` | GET | `/vacantes/:id` |
| `create(data)` | POST | `/vacantes` |

## 3.9 Custom Hooks

### `useCandidatos`
Encapsula toda la lógica de estado de candidatos usando `useState`, `useEffect` y `useCallback`.

```js
const {
  candidatos,          // Candidato[] — lista de instancias del modelo
  loading,             // boolean
  error,               // string | null
  crearCandidato,      // async (formData) => void
  actualizarCandidato, // async (id, formData) => void
  eliminarCandidato,   // async (id) => void
  refetch,             // () => void — recarga la lista
} = useCandidatos();
```

**Comportamiento:**
- Al montar el componente, llama a la API automáticamente
- `crearCandidato`: agrega el nuevo candidato al inicio de la lista sin recargar
- `actualizarCandidato`: reemplaza el candidato modificado en la lista
- `eliminarCandidato`: filtra el candidato de la lista local
- Convierte cada objeto plano en instancia de `Candidato`

## 3.10 Componentes Principales

### `CandidatoCard`
Muestra la información de un candidato en una tarjeta.

| Prop | Tipo | Descripción |
|---|---|---|
| `candidato` | `Candidato` | Instancia del modelo |
| `onEditar` | `Function` | Callback — recibe el objeto candidato completo |
| `onEliminar` | `Function` | Callback — recibe el `id` del candidato |

### `CandidatoForm`
Formulario que funciona en modo **crear** y modo **editar**.

| Prop | Tipo | Descripción |
|---|---|---|
| `onCrear` | `Function` | Callback para modo crear |
| `onActualizar` | `Function` | Callback para modo editar |
| `candidatoInicial` | `Candidato` | Si se pasa, activa el modo editar con datos pre-cargados |
| `cargando` | `boolean` | Deshabilita el botón mientras guarda |

En modo editar aparece un campo extra: **Estado** (`activo`, `en_proceso`, `contratado`, `descartado`).

### `CandidatoModal`
Overlay oscuro que contiene el formulario de edición.

| Prop | Tipo | Descripción |
|---|---|---|
| `isOpen` | `boolean` | Controla visibilidad |
| `onClose` | `Function` | Cierra al hacer clic en ✕ o en el fondo |
| `titulo` | `string` | Texto del encabezado |
| `children` | `ReactNode` | Contenido del modal |

> Al pasar `key={candidato.id}` al form dentro del modal, React fuerza el re-montaje del componente cada vez que cambia el candidato seleccionado, garantizando que el estado interno del formulario se reinicie con los datos correctos.

## 3.11 CRUD de Candidatos — Flujo Completo

```
CandidatosPage (page.jsx)
    │
    ├── useCandidatos()          ← obtiene lista, carga inicial
    │
    ├── [Botón + Nuevo]
    │       └── mostrarForm → true
    │               └── <CandidatoForm onCrear={handleCrear} />
    │                       └── handleCrear → crearCandidato(data) → POST /candidatos
    │
    ├── <CandidatoCard onEditar onEliminar />
    │       ├── [Editar] → setCandidatoEditando(candidato)
    │       │       └── <CandidatoModal>
    │       │               └── <CandidatoForm key={id} candidatoInicial onActualizar />
    │       │                       └── handleActualizar → actualizarCandidato(id, data) → PUT /candidatos/:id
    │       │
    │       └── [Eliminar] → handleEliminar(id) → eliminarCandidato(id) → DELETE /candidatos/:id
    │
    └── useMemo([candidatos, filtro, busqueda])
            └── candidatosFiltrados ← recalcula solo si cambian las dependencias
```

## 3.12 Gestión de Bootstrap (CSS Scoping)

Bootstrap solo se importa dentro de la sección `/ejemplos/reactstrap`, usando un layout anidado específico:

```
src/app/ejemplos/reactstrap/
    ├── layout.jsx   ← import 'bootstrap/dist/css/bootstrap.min.css'
    └── page.jsx     ← usa componentes Reactstrap
```

Esto evita que los estilos de Bootstrap afecten al resto de la aplicación, que usa exclusivamente CSS Modules.

## 3.13 Variables de Entorno

| Variable | Valor | Descripción |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3000` | URL base de la API REST. El prefijo `NEXT_PUBLIC_` la expone al navegador. |

---

## Requisitos del Sistema

| Componente | Versión mínima |
|---|---|
| Node.js | 18.x |
| PostgreSQL | 14.x |
| npm | 9.x |
| Navegador | Chrome / Firefox / Edge (últimas versiones) |

## Puertos Utilizados

| Servicio | Puerto |
|---|---|
| API REST (hr-talent-api) | 3000 |
| Frontend (hr-talent-frontend) | 3001 |
| PostgreSQL | 5432 |

---

*Manual técnico generado para el proyecto HR Talent — Sistema de Evaluación de RRHH*
