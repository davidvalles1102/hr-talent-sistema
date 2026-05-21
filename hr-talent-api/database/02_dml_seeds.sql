-- ============================================================
--  SCRIPT DML  |  Datos Semilla
--  Sistema de Evaluacion de RRHH
--  Ejecutar DESPUÉS de 01_ddl_schema.sql
-- ============================================================

-- ============================================================
-- 1. USUARIOS_RRHH  (8 registros)
-- ============================================================
INSERT INTO usuarios_rrhh (nombre, apellido, email, rol, departamento) VALUES
  ('Lucía',    'Mendoza',    'lucia.mendoza@empresa.com',   'gerente_rrhh', 'Recursos Humanos'),
  ('Carlos',   'Pereira',    'carlos.pereira@empresa.com',  'reclutador',   'Recursos Humanos'),
  ('Sofía',    'Rivas',      'sofia.rivas@empresa.com',     'reclutador',   'Recursos Humanos'),
  ('Daniel',   'Aguilar',    'daniel.aguilar@empresa.com',  'evaluador',    'Tecnología'),
  ('Patricia', 'Salinas',    'patricia.salinas@empresa.com','evaluador',    'Tecnología'),
  ('Roberto',  'Herrera',    'roberto.herrera@empresa.com', 'evaluador',    'Finanzas'),
  ('Valeria',  'Castillo',   'valeria.castillo@empresa.com','evaluador',    'Marketing'),
  ('José',     'Domínguez',  'jose.dominguez@empresa.com',  'reclutador',   'Recursos Humanos');

-- ============================================================
-- 2. VACANTES  (7 registros)
-- ============================================================
INSERT INTO vacantes (titulo, descripcion, departamento, requisitos, modalidad,
                      salario_min, salario_max, estado, responsable_id,
                      fecha_publicacion, fecha_cierre) VALUES
  ('Desarrollador Backend Node.js',
   'Desarrollo y mantenimiento de APIs REST para plataformas internas.',
   'Tecnología',
   'Node.js, PostgreSQL, 2+ años experiencia, inglés intermedio.',
   'hibrido', 900.00, 1400.00, 'abierta', 2,
   '2026-04-01', '2026-06-30'),

  ('Desarrollador Frontend React',
   'Construcción de interfaces web modernas con React y TypeScript.',
   'Tecnología',
   'React, TypeScript, CSS3, experiencia con APIs REST.',
   'remoto', 850.00, 1300.00, 'abierta', 2,
   '2026-04-05', '2026-06-30'),

  ('Analista de Datos',
   'Análisis y visualización de datos para soporte a decisiones.',
   'Business Intelligence',
   'SQL avanzado, Python o R, Power BI o Tableau.',
   'presencial', 800.00, 1100.00, 'abierta', 3,
   '2026-03-15', '2026-05-31'),

  ('Contador Financiero',
   'Gestión contable, conciliaciones bancarias e impuestos.',
   'Finanzas',
   'Licenciatura en Contabilidad, 3+ años experiencia, manejo de ERP.',
   'presencial', 750.00, 1000.00, 'pausada', 3,
   '2026-02-01', NULL),

  ('Especialista en Marketing Digital',
   'Gestión de campañas digitales, SEO/SEM y redes sociales.',
   'Marketing',
   'Google Ads, Meta Ads, SEO, analítica web.',
   'hibrido', 700.00, 950.00, 'abierta', 8,
   '2026-04-10', '2026-07-01'),

  ('Soporte Técnico N1',
   'Atención a usuarios internos, soporte de hardware y software.',
   'Tecnología',
   'Conocimiento de redes, Windows Server, habilidades comunicativas.',
   'presencial', 550.00, 700.00, 'abierta', 8,
   '2026-05-01', '2026-06-15'),

  ('Gerente de Proyectos TI',
   'Liderazgo de proyectos tecnológicos bajo metodologías ágiles.',
   'Tecnología',
   'PMP o Scrum Master, 5+ años en gestión de proyectos TI.',
   'hibrido', 1500.00, 2200.00, 'cerrada', 1,
   '2026-01-10', '2026-03-31');

-- ============================================================
-- 3. CANDIDATOS  (15 registros)
-- ============================================================
INSERT INTO candidatos (nombre, apellido, email, telefono, fecha_nacimiento,
                         nivel_educativo, anios_experiencia, puesto_interes,
                         cv_url, estado) VALUES
  ('Pedro',    'González',  'pedro.gonzalez@mail.com',   '78901234', '1998-03-12',
   'universitario', 3, 'Desarrollador Backend Node.js',   'cvs/pedro_cv.pdf',   'en_proceso'),

  ('María',    'Flores',    'maria.flores@mail.com',     '76543210', '1997-07-25',
   'universitario', 4, 'Analista de Datos',               'cvs/maria_cv.pdf',   'en_proceso'),

  ('Andrés',   'Molina',    'andres.molina@mail.com',    '77112233', '1999-11-05',
   'universitario', 2, 'Desarrollador Frontend React',    'cvs/andres_cv.pdf',  'activo'),

  ('Gabriela', 'Torres',    'gabriela.torres@mail.com',  '78654321', '1996-01-18',
   'maestria',      5, 'Gerente de Proyectos TI',         'cvs/gabriela_cv.pdf','contratado'),

  ('Fernando', 'Reyes',     'fernando.reyes@mail.com',   '79988776', '2000-05-30',
   'tecnico',       1, 'Soporte Técnico N1',              'cvs/fernando_cv.pdf','en_proceso'),

  ('Laura',    'Vásquez',   'laura.vasquez@mail.com',    '76234567', '1997-09-14',
   'universitario', 3, 'Especialista en Marketing Digital','cvs/laura_cv.pdf', 'en_proceso'),

  ('Diego',    'Campos',    'diego.campos@mail.com',     '78345678', '1995-12-02',
   'universitario', 6, 'Desarrollador Backend Node.js',   'cvs/diego_cv.pdf',   'activo'),

  ('Valeria',  'Morales',   'valeria.morales@mail.com',  '77890123', '1998-04-21',
   'universitario', 2, 'Analista de Datos',               'cvs/valeria_cv.pdf', 'activo'),

  ('Ricardo',  'Jiménez',   'ricardo.jimenez@mail.com',  '76789012', '1993-06-08',
   'postgrado',     7, 'Contador Financiero',             'cvs/ricardo_cv.pdf', 'descartado'),

  ('Alicia',   'Ramírez',   'alicia.ramirez@mail.com',   '79876543', '2001-02-17',
   'universitario', 1, 'Desarrollador Frontend React',    'cvs/alicia_cv.pdf',  'activo'),

  ('Hugo',     'Sandoval',  'hugo.sandoval@mail.com',    '78567890', '1994-10-09',
   'universitario', 5, 'Analista de Datos',               'cvs/hugo_cv.pdf',    'en_proceso'),

  ('Paola',    'Gutiérrez', 'paola.gutierrez@mail.com',  '77654321', '1999-08-03',
   'universitario', 2, 'Especialista en Marketing Digital','cvs/paola_cv.pdf',  'activo'),

  ('Carlos',   'Ortiz',     'carlos.ortiz@mail.com',     '76901234', '1996-03-27',
   'tecnico',       4, 'Soporte Técnico N1',              'cvs/carlos_cv.pdf',  'en_proceso'),

  ('Natalia',  'Espinoza',  'natalia.espinoza@mail.com', '78012345', '2000-12-11',
   'universitario', 1, 'Desarrollador Backend Node.js',   'cvs/natalia_cv.pdf', 'activo'),

  ('Marcos',   'Fuentes',   'marcos.fuentes@mail.com',   '79234567', '1992-07-19',
   'maestria',      8, 'Gerente de Proyectos TI',         'cvs/marcos_cv.pdf',  'descartado');

-- ============================================================
-- 4. EVALUACIONES  (20 registros)
-- ============================================================
INSERT INTO evaluaciones (candidato_id, vacante_id, evaluador_id, tipo,
                           puntaje_tecnico, puntaje_actitudinal, puntaje_cultural,
                           resultado, comentarios, fecha) VALUES
  -- Pedro González -> Backend Node.js
  (1, 1, 4, 'tecnica',      8.5, 7.0, 6.5, 'aprobado',  'Buen dominio de APIs REST y manejo de bases de datos.',            '2026-04-20 09:00:00'),
  (1, 1, 5, 'actitudinal',  7.0, 8.5, 8.0, 'aprobado',  'Actitud proactiva, dispuesto a aprender.',                        '2026-04-22 10:30:00'),

  -- María Flores -> Analista de Datos
  (2, 3, 4, 'tecnica',      9.0, 8.0, 7.5, 'aprobado',  'Excelente manejo de SQL y visualización con Power BI.',           '2026-04-08 11:00:00'),
  (2, 3, 6, 'cultural',     8.0, 7.5, 9.0, 'aprobado',  'Muy alineada con los valores de la empresa.',                     '2026-04-10 14:00:00'),

  -- Andrés Molina -> Frontend React
  (3, 2, 5, 'tecnica',      7.0, 6.5, 7.0, 'pendiente', 'Conocimiento básico de React, necesita mejorar TypeScript.',      '2026-04-25 08:30:00'),

  -- Gabriela Torres -> Gerente Proyectos (contratada)
  (4, 7, 1, 'tecnica',      9.5, 9.0, 9.5, 'aprobado',  'Perfil sobresaliente, experiencia en proyectos de gran escala.',  '2026-02-05 09:00:00'),
  (4, 7, 4, 'actitudinal',  9.0, 9.5, 9.0, 'aprobado',  'Liderazgo natural y excelente comunicación.',                     '2026-02-07 11:00:00'),

  -- Fernando Reyes -> Soporte N1
  (5, 6, 5, 'tecnica',      6.5, 7.0, 6.0, 'aprobado',  'Conocimiento aceptable de redes y sistemas operativos.',          '2026-05-05 10:00:00'),
  (5, 6, 2, 'actitudinal',  6.0, 7.5, 7.0, 'aprobado',  'Buena disposición para aprender en el puesto.',                   '2026-05-06 15:00:00'),

  -- Laura Vásquez -> Marketing Digital
  (6, 5, 7, 'tecnica',      8.0, 7.5, 8.0, 'aprobado',  'Domina Google Ads y tiene buena visión analítica.',               '2026-04-20 09:30:00'),
  (6, 5, 7, 'cultural',     7.5, 8.0, 8.5, 'aprobado',  'Encaja bien con el equipo de marketing.',                         '2026-04-21 14:00:00'),

  -- Diego Campos -> Backend Node.js
  (7, 1, 4, 'tecnica',      9.0, 7.5, 7.0, 'aprobado',  'Alto nivel técnico, 6 años de experiencia relevante.',            '2026-04-18 09:00:00'),

  -- Valeria Morales -> Analista de Datos
  (8, 3, 4, 'tecnica',      6.0, 6.5, 7.0, 'reprobado', 'Conocimientos básicos de SQL, no maneja herramientas BI.',        '2026-04-12 10:00:00'),

  -- Ricardo Jiménez -> Contador (descartado)
  (9, 4, 6, 'tecnica',      5.0, 6.0, 5.5, 'reprobado', 'No cumple requisitos mínimos de experiencia con ERP.',            '2026-03-10 09:00:00'),

  -- Alicia Ramírez -> Frontend React
  (10, 2, 5, 'tecnica',     7.5, 8.0, 8.0, 'aprobado',  'Buenas bases en React, entusiasmo destacado.',                    '2026-04-28 11:00:00'),

  -- Hugo Sandoval -> Analista de Datos
  (11, 3, 4, 'tecnica',     8.5, 7.0, 7.5, 'aprobado',  'Python y SQL sólidos, experiencia en dashboards.',                '2026-04-15 10:30:00'),
  (11, 3, 6, 'actitudinal', 7.0, 8.5, 8.0, 'aprobado',  'Buen comunicador y trabajo en equipo.',                           '2026-04-17 14:00:00'),

  -- Paola Gutiérrez -> Marketing Digital
  (12, 5, 7, 'tecnica',     7.0, 7.5, 7.5, 'aprobado',  'Conoce las principales plataformas de pauta.',                    '2026-04-22 09:00:00'),

  -- Carlos Ortiz -> Soporte N1
  (13, 6, 5, 'tecnica',     7.5, 7.0, 7.0, 'aprobado',  'Experiencia en mesa de ayuda, certif. CompTIA A+.',               '2026-05-08 08:00:00'),

  -- Marcos Fuentes -> Gerente Proyectos (descartado)
  (15, 7, 1, 'tecnica',     6.0, 5.5, 6.0, 'reprobado', 'No demostró experiencia real en gestión ágil de proyectos.',      '2026-02-15 10:00:00');

-- ============================================================
-- 5. ENTREVISTAS  (14 registros)
-- ============================================================
INSERT INTO entrevistas (candidato_id, vacante_id, entrevistador_id,
                          fecha_hora, duracion_min, modalidad, ubicacion,
                          estado, calificacion, observaciones) VALUES
  -- Pedro González
  (1, 1, 4, '2026-05-02 09:00:00', 60,  'virtual',    'Google Meet',         'completada',    4, 'Resolvió bien los ejercicios técnicos.'),
  (1, 1, 2, '2026-05-09 14:00:00', 45,  'virtual',    'Google Meet',         'completada',    4, 'Buena comunicación y motivación.'),

  -- María Flores
  (2, 3, 4, '2026-04-18 10:00:00', 60,  'presencial', 'Sala de Juntas A',    'completada',    5, 'Demostró dominio excepcional de SQL.'),
  (2, 3, 1, '2026-04-25 11:00:00', 30,  'presencial', 'Oficina RRHH',        'completada',    5, 'Aprobada para siguiente etapa.'),

  -- Andrés Molina
  (3, 2, 5, '2026-05-10 09:30:00', 60,  'virtual',    'Zoom',                'pendiente',     NULL, NULL),

  -- Gabriela Torres (ya contratada)
  (4, 7, 1, '2026-02-12 09:00:00', 90,  'presencial', 'Sala Gerencia',       'completada',    5, 'Candidata ideal, oferta extendida.'),

  -- Fernando Reyes
  (5, 6, 5, '2026-05-12 10:00:00', 45,  'presencial', 'Recepción Técnica',   'completada',    3, 'Pasa a siguiente fase con reservas.'),

  -- Laura Vásquez
  (6, 5, 7, '2026-04-28 14:00:00', 60,  'virtual',    'Teams',               'completada',    4, 'Portfolio sólido y buenas ideas de campaña.'),

  -- Diego Campos
  (7, 1, 4, '2026-04-25 09:00:00', 75,  'virtual',    'Google Meet',         'completada',    5, 'El mejor perfil técnico evaluado hasta ahora.'),
  (7, 1, 2, '2026-05-05 15:00:00', 30,  'virtual',    'Google Meet',         'completada',    4, 'Negociación salarial pendiente.'),

  -- Valeria Morales
  (8, 3, 4, '2026-04-20 10:00:00', 45,  'presencial', 'Sala de Juntas B',    'completada',    2, 'No alcanzó el nivel técnico requerido.'),

  -- Ricardo Jiménez (descartado)
  (9, 4, 6, '2026-03-15 09:00:00', 30,  'presencial', 'Oficina Finanzas',    'completada',    1, 'Perfil no alineado con los requisitos.'),

  -- Hugo Sandoval
  (11, 3, 4, '2026-04-22 11:00:00', 60, 'virtual',    'Teams',               'completada',    4, 'Análisis de caso resuelto correctamente.'),

  -- Carlos Ortiz
  (13, 6, 5, '2026-05-14 08:00:00', 45, 'presencial', 'Sala Técnica',        'pendiente',     NULL, NULL);

-- ============================================================
-- Fin del script DML - Datos Semilla
-- ============================================================
