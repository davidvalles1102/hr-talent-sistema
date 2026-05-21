'use client';
import { useMemo, useState } from 'react';
import { useCandidatos } from '../../hooks/useCandidatos';
import CandidatoCard from '../../components/candidatos/CandidatoCard';
import CandidatoForm from '../../components/candidatos/CandidatoForm';
import CandidatoModal from '../../components/candidatos/CandidatoModal';

export default function CandidatosPage() {
  const { candidatos, loading, error, crearCandidato, actualizarCandidato, eliminarCandidato } = useCandidatos();
  const [filtro,            setFiltro]            = useState('todos');
  const [busqueda,          setBusqueda]          = useState('');
  const [mostrarForm,       setMostrarForm]       = useState(false);
  const [guardando,         setGuardando]         = useState(false);
  const [candidatoEditando, setCandidatoEditando] = useState(null);

  // useMemo: recalcula solo cuando cambian candidatos, filtro o busqueda
  const candidatosFiltrados = useMemo(() => {
    return candidatos
      .filter(c => filtro === 'todos' || c.estado === filtro)
      .filter(c =>
        c.nombreCompleto.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.email.toLowerCase().includes(busqueda.toLowerCase())
      );
  }, [candidatos, filtro, busqueda]);

  async function handleCrear(data) {
    setGuardando(true);
    try {
      await crearCandidato(data);
      setMostrarForm(false);
    } finally {
      setGuardando(false);
    }
  }

  async function handleActualizar(data) {
    setGuardando(true);
    try {
      await actualizarCandidato(candidatoEditando.id, data);
      setCandidatoEditando(null);
    } finally {
      setGuardando(false);
    }
  }

  async function handleEliminar(id) {
    if (!confirm('¿Eliminar este candidato?')) return;
    await eliminarCandidato(id);
  }

  return (
    <div className="page-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Candidatos</h1>
        <button className="btn-primary" onClick={() => setMostrarForm(v => !v)}>
          {mostrarForm ? 'Cancelar' : '+ Nuevo Candidato'}
        </button>
      </div>

      {mostrarForm && (
        <div style={{ marginBottom: '1.5rem' }}>
          <CandidatoForm onCrear={handleCrear} cargando={guardando} />
        </div>
      )}

      {/* Barra de búsqueda y filtros */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input
          placeholder="Buscar por nombre o email..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          style={{ maxWidth: '320px' }}
        />
        <select value={filtro} onChange={e => setFiltro(e.target.value)} style={{ width: 'auto' }}>
          <option value="todos">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="en_proceso">En Proceso</option>
          <option value="contratado">Contratado</option>
          <option value="descartado">Descartado</option>
        </select>
        <span style={{ color: '#64748b', fontSize: '.875rem', alignSelf: 'center' }}>
          {candidatosFiltrados.length} resultado(s)
        </span>
      </div>

      {loading && <div className="loading">Cargando candidatos...</div>}
      {error   && <div className="alert alert-error">{error}</div>}

      {!loading && !error && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1rem' }}>
          {candidatosFiltrados.map(c => (
            <CandidatoCard
              key={c.id}
              candidato={c}
              onEditar={setCandidatoEditando}
              onEliminar={handleEliminar}
            />
          ))}
          {candidatosFiltrados.length === 0 && (
            <p style={{ color: '#64748b', gridColumn: '1/-1', textAlign: 'center', padding: '2rem' }}>
              No se encontraron candidatos.
            </p>
          )}
        </div>
      )}

      {/* Modal de edición — key fuerza re-mount del form al cambiar candidato */}
      <CandidatoModal
        isOpen={!!candidatoEditando}
        onClose={() => setCandidatoEditando(null)}
        titulo="Editar Candidato"
      >
        {candidatoEditando && (
          <CandidatoForm
            key={candidatoEditando.id}
            candidatoInicial={candidatoEditando}
            onActualizar={handleActualizar}
            cargando={guardando}
          />
        )}
      </CandidatoModal>
    </div>
  );
}
