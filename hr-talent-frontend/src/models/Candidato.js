// ============================================================
//  MODELO — Capa M del patrón MVC
//  Define la estructura y lógica de datos de un Candidato.
//  Los modelos NO hacen peticiones HTTP; solo representan datos.
// ============================================================

export class Candidato {
  constructor(data) {
    this.id                = data.id;
    this.nombre            = data.nombre;
    this.apellido          = data.apellido;
    this.email             = data.email;
    this.telefono          = data.telefono          || '';
    this.nivel_educativo   = data.nivel_educativo   || '';
    this.anios_experiencia = data.anios_experiencia || 0;
    this.puesto_interes    = data.puesto_interes;
    this.estado            = data.estado            || 'activo';
    this.fecha_registro    = data.fecha_registro;
  }

  // Propiedad calculada: nombre completo
  get nombreCompleto() {
    return `${this.nombre} ${this.apellido}`;
  }

  // Propiedad calculada: iniciales para avatar
  get iniciales() {
    return `${this.nombre[0]}${this.apellido[0]}`.toUpperCase();
  }

  // Propiedad calculada: color y etiqueta según estado
  get estadoBadge() {
    const config = {
      activo:     { label: 'Activo',     color: '#28a745', bg: '#d4edda' },
      en_proceso: { label: 'En Proceso', color: '#0056b3', bg: '#cce5ff' },
      contratado: { label: 'Contratado', color: '#4a0e8f', bg: '#e2d9f3' },
      descartado: { label: 'Descartado', color: '#721c24', bg: '#f8d7da' },
    };
    return config[this.estado] || { label: this.estado, color: '#555', bg: '#eee' };
  }
}
