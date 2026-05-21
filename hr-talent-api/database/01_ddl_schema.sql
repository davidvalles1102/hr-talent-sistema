-- ============================================================
--  SCRIPT DDL  |  Sistema de Evaluacion de RRHH
--  Motor: PostgreSQL  |  Herramienta: DBeaver
--  Ejecutar primero este archivo, luego 02_dml_seeds.sql
-- ============================================================

-- ------------------------------------------------------------
-- 1. BASE DE DATOS
-- ------------------------------------------------------------
-- Ejecuta esto en la conexion a "postgres" (base por defecto)
-- antes de conectarte a hr_talent_db.

CREATE DATABASE hr_talent_db
    ENCODING    'UTF8'
    LC_COLLATE  'es_ES.UTF-8'
    LC_CTYPE    'es_ES.UTF-8'
    TEMPLATE    template0;

-- Conéctate a hr_talent_db antes de continuar:
-- \c hr_talent_db;   (psql)
-- En DBeaver: abre una nueva conexion apuntando a hr_talent_db

-- ============================================================
-- 2. TABLAS
-- ============================================================

-- ------------------------------------------------------------
-- 2.1 USUARIOS_RRHH
-- Personas del area de RRHH que operan el sistema.
-- ------------------------------------------------------------
CREATE TABLE usuarios_rrhh (
    id            SERIAL          PRIMARY KEY,
    nombre        VARCHAR(80)     NOT NULL,
    apellido      VARCHAR(80)     NOT NULL,
    email         VARCHAR(150)    NOT NULL,
    rol           VARCHAR(40)     NOT NULL
                                  DEFAULT 'evaluador'
                                  CHECK (rol IN ('reclutador','evaluador','gerente_rrhh')),
    departamento  VARCHAR(100),
    activo        BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP       NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_usuarios_email UNIQUE (email)
);

-- ------------------------------------------------------------
-- 2.2 VACANTES
-- Posiciones abiertas dentro de la empresa.
-- ------------------------------------------------------------
CREATE TABLE vacantes (
    id                  SERIAL          PRIMARY KEY,
    titulo              VARCHAR(150)    NOT NULL,
    descripcion         TEXT,
    departamento        VARCHAR(100)    NOT NULL,
    requisitos          TEXT,
    modalidad           VARCHAR(20)     NOT NULL DEFAULT 'presencial'
                                        CHECK (modalidad IN ('presencial','remoto','hibrido')),
    salario_min         NUMERIC(10,2),
    salario_max         NUMERIC(10,2),
    estado              VARCHAR(20)     NOT NULL DEFAULT 'abierta'
                                        CHECK (estado IN ('abierta','pausada','cerrada')),
    responsable_id      INT             REFERENCES usuarios_rrhh(id)
                                        ON DELETE SET NULL,
    fecha_publicacion   DATE            NOT NULL DEFAULT CURRENT_DATE,
    fecha_cierre        DATE,
    created_at          TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP       NOT NULL DEFAULT NOW(),
    CONSTRAINT ck_vacantes_salario CHECK (salario_max >= salario_min)
);

-- ------------------------------------------------------------
-- 2.3 CANDIDATOS
-- Personas que postulan a las vacantes.
-- ------------------------------------------------------------
CREATE TABLE candidatos (
    id                  SERIAL          PRIMARY KEY,
    nombre              VARCHAR(80)     NOT NULL,
    apellido            VARCHAR(80)     NOT NULL,
    email               VARCHAR(150)    NOT NULL,
    telefono            VARCHAR(20),
    fecha_nacimiento    DATE,
    nivel_educativo     VARCHAR(50)     CHECK (nivel_educativo IN (
                            'bachillerato','tecnico','universitario',
                            'postgrado','maestria','doctorado')),
    anios_experiencia   SMALLINT        DEFAULT 0 CHECK (anios_experiencia >= 0),
    puesto_interes      VARCHAR(150)    NOT NULL,
    cv_url              VARCHAR(300),
    notas               TEXT,
    estado              VARCHAR(20)     NOT NULL DEFAULT 'activo'
                                        CHECK (estado IN (
                                            'activo','en_proceso',
                                            'contratado','descartado')),
    activo              BOOLEAN         NOT NULL DEFAULT TRUE,
    fecha_registro      TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP       NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_candidatos_email UNIQUE (email)
);

-- ------------------------------------------------------------
-- 2.4 EVALUACIONES
-- Resultado de evaluar a un candidato para una vacante.
-- ------------------------------------------------------------
CREATE TABLE evaluaciones (
    id                   SERIAL          PRIMARY KEY,
    candidato_id         INT             NOT NULL
                                         REFERENCES candidatos(id)
                                         ON DELETE CASCADE,
    vacante_id           INT             REFERENCES vacantes(id)
                                         ON DELETE SET NULL,
    evaluador_id         INT             NOT NULL
                                         REFERENCES usuarios_rrhh(id)
                                         ON DELETE RESTRICT,
    tipo                 VARCHAR(20)     NOT NULL
                                         CHECK (tipo IN ('tecnica','actitudinal','cultural')),
    puntaje_tecnico      NUMERIC(4,2)    CHECK (puntaje_tecnico      BETWEEN 0 AND 10),
    puntaje_actitudinal  NUMERIC(4,2)    CHECK (puntaje_actitudinal  BETWEEN 0 AND 10),
    puntaje_cultural     NUMERIC(4,2)    CHECK (puntaje_cultural     BETWEEN 0 AND 10),
    puntaje_total        NUMERIC(4,2)    GENERATED ALWAYS AS (
                             ROUND((puntaje_tecnico + puntaje_actitudinal + puntaje_cultural) / 3.0, 2)
                         ) STORED,
    resultado            VARCHAR(20)     NOT NULL DEFAULT 'pendiente'
                                         CHECK (resultado IN ('aprobado','reprobado','pendiente')),
    comentarios          TEXT,
    fecha                TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 2.5 ENTREVISTAS
-- Citas agendadas entre candidatos y entrevistadores.
-- ------------------------------------------------------------
CREATE TABLE entrevistas (
    id                SERIAL          PRIMARY KEY,
    candidato_id      INT             NOT NULL
                                      REFERENCES candidatos(id)
                                      ON DELETE CASCADE,
    vacante_id        INT             REFERENCES vacantes(id)
                                      ON DELETE SET NULL,
    entrevistador_id  INT             NOT NULL
                                      REFERENCES usuarios_rrhh(id)
                                      ON DELETE RESTRICT,
    fecha_hora        TIMESTAMP       NOT NULL,
    duracion_min      SMALLINT        DEFAULT 60 CHECK (duracion_min > 0),
    modalidad         VARCHAR(20)     NOT NULL
                                      CHECK (modalidad IN ('presencial','virtual','telefonica')),
    ubicacion         VARCHAR(200),
    estado            VARCHAR(20)     NOT NULL DEFAULT 'pendiente'
                                      CHECK (estado IN (
                                          'pendiente','completada',
                                          'cancelada','no_presentado')),
    calificacion      SMALLINT        CHECK (calificacion BETWEEN 1 AND 5),
    observaciones     TEXT,
    created_at        TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 3. INDICES
-- ============================================================
CREATE INDEX idx_candidatos_estado       ON candidatos(estado);
CREATE INDEX idx_candidatos_email        ON candidatos(email);
CREATE INDEX idx_vacantes_estado         ON vacantes(estado);
CREATE INDEX idx_evaluaciones_candidato  ON evaluaciones(candidato_id);
CREATE INDEX idx_evaluaciones_vacante    ON evaluaciones(vacante_id);
CREATE INDEX idx_entrevistas_candidato   ON entrevistas(candidato_id);
CREATE INDEX idx_entrevistas_fecha       ON entrevistas(fecha_hora);

-- ============================================================
-- Fin del script DDL
-- ============================================================
