// ============================================================
//  MODELO — Vacante
// ============================================================

export class Vacante {
  constructor(data) {
    this.id                = data.id;
    this.titulo            = data.titulo;
    this.descripcion       = data.descripcion       || '';
    this.departamento      = data.departamento;
    this.requisitos        = data.requisitos        || '';
    this.modalidad         = data.modalidad;
    this.salario_min       = data.salario_min;
    this.salario_max       = data.salario_max;
    this.estado            = data.estado;
    this.fecha_publicacion = data.fecha_publicacion;
  }

  get rangoSalario() {
    if (!this.salario_min && !this.salario_max) return 'No especificado';
    return `$${Number(this.salario_min).toFixed(2)} – $${Number(this.salario_max).toFixed(2)}`;
  }

  get modalidadIcon() {
    const icons = { presencial: '🏢', remoto: '🏠', hibrido: '🔄' };
    return icons[this.modalidad] || '📍';
  }

  get estadoBadge() {
    const config = {
      abierta: { label: 'Abierta', color: '#155724', bg: '#d4edda' },
      pausada:  { label: 'Pausada', color: '#856404', bg: '#fff3cd' },
      cerrada:  { label: 'Cerrada', color: '#721c24', bg: '#f8d7da' },
    };
    return config[this.estado] || { label: this.estado, color: '#555', bg: '#eee' };
  }
}
