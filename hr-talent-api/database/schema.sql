-- ============================================================
-- Script de creacion de base de datos: hr_talent_db
-- ============================================================

CREATE DATABASE hr_talent_db;

\c hr_talent_db;

-- Tabla de usuarios RRHH (evaluadores/responsables)
CREATE TABLE usuarios_rrhh (
    id          SERIAL PRIMARY KEY,
    nombre      VARCHAR(100) NOT NULL,
    email       VARCHAR(150) UNIQUE NOT NULL,
    rol         VARCHAR(50)  NOT NULL DEFAULT 'evaluador',
    activo      BOOLEAN      NOT NULL DEFAULT true,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- Tabla de vacantes
CREATE TABLE vacantes (
    id                 SERIAL PRIMARY KEY,
    titulo             VARCHAR(150) NOT NULL,
    descripcion        TEXT,
    departamento       VARCHAR(100) NOT NULL,
    requisitos         TEXT,
    salario_min        NUMERIC(10,2),
    salario_max        NUMERIC(10,2),
    estado             VARCHAR(30)  NOT NULL DEFAULT 'abierta',
    responsable_id     INT REFERENCES usuarios_rrhh(id),
    fecha_publicacion  DATE         NOT NULL DEFAULT CURRENT_DATE,
    created_at         TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- Tabla de candidatos
CREATE TABLE candidatos (
    id              SERIAL PRIMARY KEY,
    nombre          VARCHAR(100) NOT NULL,
    apellido        VARCHAR(100) NOT NULL,
    email           VARCHAR(150) UNIQUE NOT NULL,
    telefono        VARCHAR(20),
    puesto_interes  VARCHAR(150) NOT NULL,
    cv_url          VARCHAR(300),
    notas           TEXT,
    estado          VARCHAR(30)  NOT NULL DEFAULT 'activo',
    activo          BOOLEAN      NOT NULL DEFAULT true,
    fecha_registro  TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- Tabla de evaluaciones
CREATE TABLE evaluaciones (
    id                   SERIAL PRIMARY KEY,
    candidato_id         INT NOT NULL REFERENCES candidatos(id),
    vacante_id           INT REFERENCES vacantes(id),
    evaluador_id         INT NOT NULL REFERENCES usuarios_rrhh(id),
    tipo                 VARCHAR(30) NOT NULL CHECK (tipo IN ('tecnica','actitudinal','cultural')),
    puntaje_tecnico      NUMERIC(4,2) CHECK (puntaje_tecnico BETWEEN 0 AND 10),
    puntaje_actitudinal  NUMERIC(4,2) CHECK (puntaje_actitudinal BETWEEN 0 AND 10),
    puntaje_cultural     NUMERIC(4,2) CHECK (puntaje_cultural BETWEEN 0 AND 10),
    comentarios          TEXT,
    fecha                TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabla de entrevistas
CREATE TABLE entrevistas (
    id                SERIAL PRIMARY KEY,
    candidato_id      INT NOT NULL REFERENCES candidatos(id),
    vacante_id        INT REFERENCES vacantes(id),
    entrevistador_id  INT NOT NULL REFERENCES usuarios_rrhh(id),
    fecha_hora        TIMESTAMP NOT NULL,
    modalidad         VARCHAR(20) NOT NULL CHECK (modalidad IN ('presencial','virtual','telefonica')),
    ubicacion         VARCHAR(200),
    estado            VARCHAR(30) NOT NULL DEFAULT 'pendiente',
    notas             TEXT,
    created_at        TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Datos de prueba
-- ============================================================

INSERT INTO usuarios_rrhh (nombre, email, rol) VALUES
  ('Ana Martinez', 'ana.martinez@empresa.com', 'reclutador'),
  ('Carlos Lopez', 'carlos.lopez@empresa.com', 'evaluador'),
  ('Sofia Rivas', 'sofia.rivas@empresa.com', 'gerente_rrhh');

INSERT INTO vacantes (titulo, descripcion, departamento, requisitos, salario_min, salario_max, responsable_id) VALUES
  ('Desarrollador Backend', 'Desarrollo de APIs REST', 'Tecnologia', 'Node.js, PostgreSQL, 2 años experiencia', 800.00, 1200.00, 1),
  ('Analista de Datos', 'Analisis de informacion empresarial', 'Business Intelligence', 'SQL, Python, Excel avanzado', 700.00, 1000.00, 1);

INSERT INTO candidatos (nombre, apellido, email, telefono, puesto_interes) VALUES
  ('Pedro', 'Gonzalez', 'pedro.gonzalez@mail.com', '78901234', 'Desarrollador Backend'),
  ('Maria', 'Flores', 'maria.flores@mail.com', '76543210', 'Analista de Datos');
