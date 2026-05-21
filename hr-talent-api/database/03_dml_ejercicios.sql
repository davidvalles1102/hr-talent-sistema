-- ============================================================
--  EJERCICIOS DML  |  Sistema de Evaluacion de RRHH
--  PostgreSQL  |  DBeaver
--  Basados en el esquema hr_talent_db
-- ============================================================
--  Niveles:
--    [B] Basico    — SELECT simple, WHERE, ORDER BY
--    [M] Medio     — JOIN, GROUP BY, HAVING, funciones de texto/fecha
--    [A] Avanzado  — Subconsultas, CTE, window functions, UPDATE/DELETE
-- ============================================================


-- ============================================================
--  BLOQUE 1 | SELECT BASICO  [B]
-- ============================================================

-- Ejercicio 1
-- Lista todos los candidatos (nombre, apellido, email, estado).
-- Ordena por apellido de forma ascendente.
SELECT nombre, apellido, email, estado
FROM candidatos
ORDER BY apellido ASC;


-- Ejercicio 2
-- Muestra todas las vacantes que están actualmente 'abierta'.
-- Muestra titulo, departamento, modalidad y salario_max.
SELECT titulo, departamento, modalidad, salario_max
FROM vacantes
WHERE estado = 'abierta';


-- Ejercicio 3
-- Obtén los candidatos cuyo nivel educativo sea 'universitario'
-- y tengan al menos 3 años de experiencia.
SELECT nombre, apellido, nivel_educativo, anios_experiencia
FROM candidatos
WHERE nivel_educativo = 'universitario'
  AND anios_experiencia >= 3;


-- Ejercicio 4
-- Lista los usuarios del área de RRHH que son 'evaluador' y están activos.
SELECT nombre, apellido, email, departamento
FROM usuarios_rrhh
WHERE rol = 'evaluador'
  AND activo = TRUE;


-- Ejercicio 5
-- Muestra las evaluaciones cuyo resultado sea 'reprobado'.
-- Incluye: id, candidato_id, tipo, puntaje_total y comentarios.
SELECT id, candidato_id, tipo, puntaje_total, comentarios
FROM evaluaciones
WHERE resultado = 'reprobado';


-- Ejercicio 6
-- Encuentra candidatos que NO han sido descartados ni contratados.
-- Ordena por fecha_registro descendente.
SELECT nombre, apellido, estado, fecha_registro
FROM candidatos
WHERE estado NOT IN ('descartado', 'contratado')
ORDER BY fecha_registro DESC;


-- Ejercicio 7
-- Lista las entrevistas pendientes con su fecha programada.
-- Muestra: id, candidato_id, entrevistador_id, fecha_hora, modalidad.
SELECT id, candidato_id, entrevistador_id, fecha_hora, modalidad
FROM entrevistas
WHERE estado = 'pendiente'
ORDER BY fecha_hora ASC;


-- Ejercicio 8
-- Muestra los candidatos cuyo nombre empiece con la letra 'A' o 'M'.
SELECT nombre, apellido, email
FROM candidatos
WHERE nombre LIKE 'A%' OR nombre LIKE 'M%';


-- ============================================================
--  BLOQUE 2 | JOINS Y RELACIONES  [M]
-- ============================================================

-- Ejercicio 9
-- Muestra el nombre completo del candidato junto con el título
-- de la vacante para la que fue evaluado y el puntaje_total obtenido.
SELECT
    c.nombre || ' ' || c.apellido  AS candidato,
    v.titulo                        AS vacante,
    e.tipo,
    e.puntaje_total,
    e.resultado
FROM evaluaciones e
INNER JOIN candidatos  c ON c.id = e.candidato_id
INNER JOIN vacantes    v ON v.id = e.vacante_id
ORDER BY e.puntaje_total DESC;


-- Ejercicio 10
-- Lista todas las entrevistas completadas indicando:
-- nombre del candidato, nombre del entrevistador, título de la vacante,
-- fecha_hora y calificacion.
SELECT
    c.nombre || ' ' || c.apellido   AS candidato,
    u.nombre || ' ' || u.apellido   AS entrevistador,
    v.titulo                         AS vacante,
    en.fecha_hora,
    en.calificacion,
    en.observaciones
FROM entrevistas en
INNER JOIN candidatos   c ON c.id  = en.candidato_id
INNER JOIN usuarios_rrhh u ON u.id = en.entrevistador_id
LEFT  JOIN vacantes      v ON v.id = en.vacante_id
WHERE en.estado = 'completada'
ORDER BY en.fecha_hora;


-- Ejercicio 11
-- Muestra todos los candidatos en estado 'en_proceso' junto con
-- el responsable (usuario RRHH) de la vacante a la que aplicaron.
-- (Usa las evaluaciones para relacionar candidato con vacante.)
SELECT DISTINCT
    c.nombre || ' ' || c.apellido    AS candidato,
    c.estado,
    v.titulo                          AS vacante,
    u.nombre || ' ' || u.apellido     AS responsable_vacante
FROM candidatos c
INNER JOIN evaluaciones  e ON e.candidato_id  = c.id
INNER JOIN vacantes      v ON v.id            = e.vacante_id
INNER JOIN usuarios_rrhh u ON u.id            = v.responsable_id
WHERE c.estado = 'en_proceso';


-- Ejercicio 12
-- Lista los candidatos que tienen al menos una entrevista agendada,
-- mostrando cuántas entrevistas tiene cada uno.
SELECT
    c.nombre || ' ' || c.apellido  AS candidato,
    COUNT(en.id)                    AS total_entrevistas
FROM candidatos c
INNER JOIN entrevistas en ON en.candidato_id = c.id
GROUP BY c.id, c.nombre, c.apellido
ORDER BY total_entrevistas DESC;


-- Ejercicio 13
-- Muestra vacantes abiertas con el número de candidatos que
-- ya tienen al menos una evaluación registrada.
SELECT
    v.titulo,
    v.departamento,
    v.estado,
    COUNT(DISTINCT e.candidato_id) AS candidatos_evaluados
FROM vacantes v
LEFT JOIN evaluaciones e ON e.vacante_id = v.id
WHERE v.estado = 'abierta'
GROUP BY v.id, v.titulo, v.departamento, v.estado
ORDER BY candidatos_evaluados DESC;


-- ============================================================
--  BLOQUE 3 | AGREGACIONES Y FUNCIONES  [M]
-- ============================================================

-- Ejercicio 14
-- Calcula el promedio de puntaje_total por tipo de evaluacion.
SELECT
    tipo,
    ROUND(AVG(puntaje_total), 2) AS promedio_puntaje,
    COUNT(*)                      AS total_evaluaciones
FROM evaluaciones
GROUP BY tipo
ORDER BY promedio_puntaje DESC;


-- Ejercicio 15
-- Por cada vacante, calcula el puntaje promedio de los candidatos
-- evaluados. Solo muestra las vacantes con promedio >= 7.0.
SELECT
    v.titulo,
    ROUND(AVG(e.puntaje_total), 2) AS promedio_puntaje,
    COUNT(*)                        AS total_evaluaciones
FROM evaluaciones e
INNER JOIN vacantes v ON v.id = e.vacante_id
GROUP BY v.id, v.titulo
HAVING AVG(e.puntaje_total) >= 7.0
ORDER BY promedio_puntaje DESC;


-- Ejercicio 16
-- Muestra la cantidad de candidatos agrupados por estado.
SELECT
    estado,
    COUNT(*) AS total
FROM candidatos
GROUP BY estado
ORDER BY total DESC;


-- Ejercicio 17
-- Obtén el candidato con el puntaje_total más alto en evaluaciones
-- de tipo 'tecnica'.
SELECT
    c.nombre || ' ' || c.apellido AS candidato,
    e.puntaje_total,
    e.comentarios
FROM evaluaciones e
INNER JOIN candidatos c ON c.id = e.candidato_id
WHERE e.tipo = 'tecnica'
ORDER BY e.puntaje_total DESC
LIMIT 1;


-- Ejercicio 18
-- Calcula la edad actual de cada candidato a partir de fecha_nacimiento.
-- Muestra nombre, apellido, fecha_nacimiento y edad en años.
SELECT
    nombre,
    apellido,
    fecha_nacimiento,
    DATE_PART('year', AGE(fecha_nacimiento))::INT AS edad
FROM candidatos
WHERE fecha_nacimiento IS NOT NULL
ORDER BY edad ASC;


-- Ejercicio 19
-- Muestra las entrevistas completadas en el mes de ABRIL 2026,
-- con el nombre del candidato y la calificacion.
SELECT
    c.nombre || ' ' || c.apellido AS candidato,
    en.fecha_hora,
    en.calificacion,
    en.modalidad
FROM entrevistas en
INNER JOIN candidatos c ON c.id = en.candidato_id
WHERE en.estado = 'completada'
  AND DATE_TRUNC('month', en.fecha_hora) = '2026-04-01'
ORDER BY en.fecha_hora;


-- ============================================================
--  BLOQUE 4 | SUBCONSULTAS  [A]
-- ============================================================

-- Ejercicio 20
-- Lista los candidatos cuyo puntaje_total promedio (en todas sus
-- evaluaciones) supera el promedio general de toda la tabla.
SELECT
    c.nombre || ' ' || c.apellido AS candidato,
    ROUND(AVG(e.puntaje_total), 2) AS mi_promedio
FROM evaluaciones e
INNER JOIN candidatos c ON c.id = e.candidato_id
GROUP BY c.id, c.nombre, c.apellido
HAVING AVG(e.puntaje_total) > (
    SELECT AVG(puntaje_total) FROM evaluaciones
)
ORDER BY mi_promedio DESC;


-- Ejercicio 21
-- Muestra los candidatos que han sido evaluados pero
-- NO tienen ninguna entrevista registrada.
SELECT nombre, apellido, email, estado
FROM candidatos
WHERE id IN  (SELECT DISTINCT candidato_id FROM evaluaciones)
  AND id NOT IN (SELECT DISTINCT candidato_id FROM entrevistas);


-- Ejercicio 22
-- Encuentra las vacantes que aún NO tienen ningún candidato evaluado.
SELECT titulo, departamento, estado
FROM vacantes
WHERE id NOT IN (
    SELECT DISTINCT vacante_id
    FROM evaluaciones
    WHERE vacante_id IS NOT NULL
);


-- ============================================================
--  BLOQUE 5 | CTE Y WINDOW FUNCTIONS  [A]
-- ============================================================

-- Ejercicio 23
-- Usando CTE, obtén el ranking de candidatos por puntaje_total
-- dentro de cada vacante.
WITH ranking_candidatos AS (
    SELECT
        v.titulo                                              AS vacante,
        c.nombre || ' ' || c.apellido                        AS candidato,
        e.puntaje_total,
        RANK() OVER (
            PARTITION BY e.vacante_id
            ORDER BY e.puntaje_total DESC
        )                                                     AS posicion
    FROM evaluaciones e
    INNER JOIN candidatos  c ON c.id = e.candidato_id
    INNER JOIN vacantes    v ON v.id = e.vacante_id
)
SELECT *
FROM ranking_candidatos
ORDER BY vacante, posicion;


-- Ejercicio 24
-- Muestra para cada evaluacion el puntaje_total del candidato
-- y la diferencia respecto al promedio de esa misma vacante.
SELECT
    v.titulo                                                            AS vacante,
    c.nombre || ' ' || c.apellido                                       AS candidato,
    e.puntaje_total,
    ROUND(AVG(e.puntaje_total) OVER (PARTITION BY e.vacante_id), 2)    AS promedio_vacante,
    ROUND(e.puntaje_total - AVG(e.puntaje_total) OVER (
              PARTITION BY e.vacante_id), 2)                            AS diferencia
FROM evaluaciones e
INNER JOIN candidatos c ON c.id = e.candidato_id
INNER JOIN vacantes   v ON v.id = e.vacante_id
ORDER BY v.titulo, diferencia DESC;


-- Ejercicio 25
-- Con CTE, muestra el resumen del proceso de selección:
-- cuántos candidatos hay en cada etapa del funnel.
WITH funnel AS (
    SELECT 'Total postulantes'       AS etapa, COUNT(*)        AS cantidad, 1 AS orden FROM candidatos WHERE activo = TRUE
    UNION ALL
    SELECT 'Con evaluación',                    COUNT(DISTINCT candidato_id), 2 FROM evaluaciones
    UNION ALL
    SELECT 'Con entrevista',                    COUNT(DISTINCT candidato_id), 3 FROM entrevistas
    UNION ALL
    SELECT 'Aprobados',                         COUNT(DISTINCT candidato_id), 4 FROM evaluaciones WHERE resultado = 'aprobado'
    UNION ALL
    SELECT 'Contratados',                       COUNT(*),                     5 FROM candidatos WHERE estado = 'contratado'
)
SELECT etapa, cantidad
FROM funnel
ORDER BY orden;


-- ============================================================
--  BLOQUE 6 | UPDATE Y DELETE  [A]
-- ============================================================

-- Ejercicio 26
-- Actualiza el estado de la candidata con email 'maria.flores@mail.com'
-- a 'contratado' y registra la fecha de actualización.
UPDATE candidatos
SET estado     = 'contratado',
    updated_at = NOW()
WHERE email = 'maria.flores@mail.com';

-- Verifica el cambio:
SELECT nombre, apellido, estado, updated_at FROM candidatos WHERE email = 'maria.flores@mail.com';


-- Ejercicio 27
-- Marca como 'pausada' todas las vacantes cuya fecha de cierre
-- ya haya pasado y aún figuren como 'abierta'.
UPDATE vacantes
SET estado     = 'pausada',
    updated_at = NOW()
WHERE estado       = 'abierta'
  AND fecha_cierre < CURRENT_DATE;

-- Verifica el cambio:
SELECT titulo, estado, fecha_cierre FROM vacantes;


-- Ejercicio 28
-- Asigna el resultado 'aprobado' a todas las evaluaciones que
-- tengan puntaje_total >= 7.5 y aún estén en 'pendiente'.
UPDATE evaluaciones
SET resultado = 'aprobado'
WHERE resultado    = 'pendiente'
  AND puntaje_total >= 7.5;


-- Ejercicio 29
-- Inactiva (activo = FALSE) a todos los candidatos que estén
-- en estado 'descartado' y cuya última evaluación fue hace
-- más de 60 días.
UPDATE candidatos
SET activo     = FALSE,
    updated_at = NOW()
WHERE estado = 'descartado'
  AND id IN (
      SELECT candidato_id
      FROM evaluaciones
      GROUP BY candidato_id
      HAVING MAX(fecha) < NOW() - INTERVAL '60 days'
  );


-- Ejercicio 30
-- Elimina las evaluaciones en estado 'pendiente' de candidatos
-- que ya fueron descartados. (Limpieza de datos huerfanos.)
DELETE FROM evaluaciones
WHERE resultado   = 'pendiente'
  AND candidato_id IN (
      SELECT id FROM candidatos WHERE estado = 'descartado'
  );

-- Verifica:
SELECT COUNT(*) AS evaluaciones_pendientes_descartados
FROM evaluaciones e
INNER JOIN candidatos c ON c.id = e.candidato_id
WHERE e.resultado = 'pendiente' AND c.estado = 'descartado';


-- ============================================================
--  BLOQUE 7 | CONSULTAS DE REPORTE  [A]
-- ============================================================

-- Ejercicio 31 — Reporte de talento completo
-- Por candidato: nombre, vacante a la que aplicó, puntaje promedio,
-- resultado predominante y si tiene entrevista completada.
SELECT
    c.nombre || ' ' || c.apellido                          AS candidato,
    c.estado,
    v.titulo                                                AS vacante,
    ROUND(AVG(e.puntaje_total), 2)                         AS puntaje_promedio,
    MODE() WITHIN GROUP (ORDER BY e.resultado)             AS resultado_frecuente,
    BOOL_OR(en.estado = 'completada')                      AS entrevista_completada
FROM candidatos c
LEFT JOIN evaluaciones e  ON e.candidato_id = c.id
LEFT JOIN vacantes     v  ON v.id           = e.vacante_id
LEFT JOIN entrevistas  en ON en.candidato_id = c.id
GROUP BY c.id, c.nombre, c.apellido, c.estado, v.titulo
ORDER BY puntaje_promedio DESC NULLS LAST;


-- Ejercicio 32 — Carga de trabajo del evaluador
-- Cuántas evaluaciones y entrevistas ha realizado cada evaluador
-- en el mes actual.
SELECT
    u.nombre || ' ' || u.apellido  AS evaluador,
    u.rol,
    COUNT(DISTINCT e.id)            AS evaluaciones_mes,
    COUNT(DISTINCT en.id)           AS entrevistas_mes
FROM usuarios_rrhh u
LEFT JOIN evaluaciones e
       ON e.evaluador_id = u.id
      AND DATE_TRUNC('month', e.fecha) = DATE_TRUNC('month', NOW())
LEFT JOIN entrevistas en
       ON en.entrevistador_id = u.id
      AND DATE_TRUNC('month', en.fecha_hora) = DATE_TRUNC('month', NOW())
GROUP BY u.id, u.nombre, u.apellido, u.rol
ORDER BY evaluaciones_mes DESC;


-- ============================================================
-- Fin del script de ejercicios DML
-- ============================================================
