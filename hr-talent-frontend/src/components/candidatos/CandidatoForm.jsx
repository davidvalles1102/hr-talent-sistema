'use client';
import { useState, useEffect } from 'react';
import styles from './CandidatoForm.module.css';
import { vacantesService } from '../../services/vacantesService';

const VACIO = {
  nombre: '', apellido: '', email: '', telefono: '',
  puesto_interes: '', nivel_educativo: '', anios_experiencia: 0,
};

export default function CandidatoForm({ onCrear, onActualizar, candidatoInicial, cargando }) {
  const esEdicion = !!candidatoInicial;

  const [form, setForm] = useState(() =>
    esEdicion
      ? {
          nombre:            candidatoInicial.nombre,
          apellido:          candidatoInicial.apellido,
          email:             candidatoInicial.email,
          telefono:          candidatoInicial.telefono          || '',
          puesto_interes:    candidatoInicial.puesto_interes,
          nivel_educativo:   candidatoInicial.nivel_educativo   || '',
          anios_experiencia: candidatoInicial.anios_experiencia || 0,
          estado:            candidatoInicial.estado            || 'activo',
        }
      : VACIO
  );
  const [error,           setError]           = useState('');
  const [ok,              setOk]              = useState(false);
  const [vacantesAbiertas, setVacantesAbiertas] = useState([]);

  useEffect(() => {
    vacantesService.getAll()
      .then(data => setVacantesAbiertas(data.filter(v => v.estado === 'abierta')))
      .catch(() => {});
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setOk(false);
    try {
      if (esEdicion) {
        await onActualizar(form);
      } else {
        await onCrear(form);
        setForm(VACIO);
        setOk(true);
        setTimeout(() => setOk(false), 3000);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h3 className={styles.titulo}>
        {esEdicion ? 'Editar Candidato' : 'Registrar Nuevo Candidato'}
      </h3>

      {error && <div className="alert alert-error">{error}</div>}
      {ok    && <div className="alert alert-success">Candidato creado exitosamente.</div>}

      <div className={styles.grid}>
        <div className={styles.campo}>
          <label>Nombre *</label>
          <input name="nombre" value={form.nombre} onChange={handleChange} required />
        </div>
        <div className={styles.campo}>
          <label>Apellido *</label>
          <input name="apellido" value={form.apellido} onChange={handleChange} required />
        </div>
        <div className={styles.campo}>
          <label>Email *</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className={styles.campo}>
          <label>Teléfono</label>
          <input name="telefono" value={form.telefono} onChange={handleChange} />
        </div>
        <div className={styles.campo}>
          <label>Puesto de Interés *</label>
          {vacantesAbiertas.length > 0 ? (
            <select name="puesto_interes" value={form.puesto_interes} onChange={handleChange} required>
              <option value="">Seleccionar vacante...</option>
              {vacantesAbiertas.map(v => (
                <option key={v.id} value={v.titulo}>{v.titulo} — {v.departamento}</option>
              ))}
            </select>
          ) : (
            <input name="puesto_interes" value={form.puesto_interes} onChange={handleChange} required placeholder="Ej: Desarrollador Frontend" />
          )}
        </div>
        <div className={styles.campo}>
          <label>Nivel Educativo</label>
          <select name="nivel_educativo" value={form.nivel_educativo} onChange={handleChange}>
            <option value="">Seleccionar...</option>
            <option value="bachillerato">Bachillerato</option>
            <option value="tecnico">Técnico</option>
            <option value="universitario">Universitario</option>
            <option value="postgrado">Postgrado</option>
            <option value="maestria">Maestría</option>
          </select>
        </div>
        <div className={styles.campo}>
          <label>Años de Experiencia</label>
          <input type="number" name="anios_experiencia" min="0"
                 value={form.anios_experiencia} onChange={handleChange} />
        </div>
        {esEdicion && (
          <div className={styles.campo}>
            <label>Estado</label>
            <select name="estado" value={form.estado} onChange={handleChange}>
              <option value="activo">Activo</option>
              <option value="en_proceso">En Proceso</option>
              <option value="contratado">Contratado</option>
              <option value="descartado">Descartado</option>
            </select>
          </div>
        )}
      </div>

      <button type="submit" className="btn-primary" disabled={cargando}>
        {cargando ? 'Guardando...' : esEdicion ? 'Actualizar Candidato' : 'Registrar Candidato'}
      </button>
    </form>
  );
}
