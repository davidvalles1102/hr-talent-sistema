'use client';
import { useState } from 'react';
import styles from './VacanteForm.module.css';

const VACIO = {
  titulo: '', descripcion: '', departamento: '', requisitos: '',
  modalidad: 'presencial', salario_min: '', salario_max: '',
};

export default function VacanteForm({ onCrear, onActualizar, vacanteInicial, cargando }) {
  const esEdicion = !!vacanteInicial;

  const [form, setForm] = useState(() =>
    esEdicion
      ? {
          titulo:       vacanteInicial.titulo,
          descripcion:  vacanteInicial.descripcion  || '',
          departamento: vacanteInicial.departamento,
          requisitos:   vacanteInicial.requisitos   || '',
          modalidad:    vacanteInicial.modalidad    || 'presencial',
          salario_min:  vacanteInicial.salario_min  || '',
          salario_max:  vacanteInicial.salario_max  || '',
          estado:       vacanteInicial.estado       || 'abierta',
        }
      : VACIO
  );
  const [error, setError] = useState('');
  const [ok,    setOk]    = useState(false);

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
        {esEdicion ? 'Editar Vacante' : 'Nueva Vacante'}
      </h3>

      {error && <div className="alert alert-error">{error}</div>}
      {ok    && <div className="alert alert-success">Vacante creada exitosamente.</div>}

      <div className={styles.grid}>
        <div className={styles.campo}>
          <label>Título *</label>
          <input name="titulo" value={form.titulo} onChange={handleChange} required />
        </div>
        <div className={styles.campo}>
          <label>Departamento *</label>
          <input name="departamento" value={form.departamento} onChange={handleChange} required />
        </div>
        <div className={styles.campo}>
          <label>Modalidad</label>
          <select name="modalidad" value={form.modalidad} onChange={handleChange}>
            <option value="presencial">Presencial</option>
            <option value="remoto">Remoto</option>
            <option value="hibrido">Híbrido</option>
          </select>
        </div>
        <div className={styles.campo}>
          <label>Salario Mínimo ($)</label>
          <input type="number" name="salario_min" min="0" value={form.salario_min} onChange={handleChange} />
        </div>
        <div className={styles.campo}>
          <label>Salario Máximo ($)</label>
          <input type="number" name="salario_max" min="0" value={form.salario_max} onChange={handleChange} />
        </div>
        {esEdicion && (
          <div className={styles.campo}>
            <label>Estado</label>
            <select name="estado" value={form.estado} onChange={handleChange}>
              <option value="abierta">Abierta</option>
              <option value="pausada">Pausada</option>
              <option value="cerrada">Cerrada</option>
            </select>
          </div>
        )}
        <div className={`${styles.campo} ${styles.fullWidth}`}>
          <label>Descripción</label>
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={3} />
        </div>
        <div className={`${styles.campo} ${styles.fullWidth}`}>
          <label>Requisitos</label>
          <textarea name="requisitos" value={form.requisitos} onChange={handleChange} rows={3} />
        </div>
      </div>

      <button type="submit" className="btn-primary" disabled={cargando}>
        {cargando ? 'Guardando...' : esEdicion ? 'Actualizar Vacante' : 'Crear Vacante'}
      </button>
    </form>
  );
}
