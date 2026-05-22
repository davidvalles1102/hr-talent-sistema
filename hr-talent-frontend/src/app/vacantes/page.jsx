'use client';
import { useState } from 'react';
import { useVacantes } from '../../hooks/useVacantes';
import VacanteCard from '../../components/vacantes/VacanteCard';
import VacanteForm from '../../components/vacantes/VacanteForm';
import CandidatoModal from '../../components/candidatos/CandidatoModal';

export default function VacantesPage() {
  const { vacantes, loading, error, crearVacante, actualizarVacante } = useVacantes();
  const [mostrarForm,     setMostrarForm]     = useState(false);
  const [guardando,       setGuardando]       = useState(false);
  const [vacanteEditando, setVacanteEditando] = useState(null);

  async function handleCrear(data) {
    setGuardando(true);
    try {
      await crearVacante(data);
      setMostrarForm(false);
    } finally {
      setGuardando(false);
    }
  }

  async function handleActualizar(data) {
    setGuardando(true);
    try {
      await actualizarVacante(vacanteEditando.id, data);
      setVacanteEditando(null);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="page-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Vacantes</h1>
        <button className="btn-primary" onClick={() => setMostrarForm(v => !v)}>
          {mostrarForm ? 'Cancelar' : '+ Nueva Vacante'}
        </button>
      </div>

      {mostrarForm && (
        <div style={{ marginBottom: '1.5rem' }}>
          <VacanteForm onCrear={handleCrear} cargando={guardando} />
        </div>
      )}

      {loading && <div className="loading">Cargando vacantes...</div>}
      {error   && <div className="alert alert-error">{error}</div>}

      {!loading && !error && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1rem' }}>
          {vacantes.map(v => (
            <VacanteCard key={v.id} vacante={v} onEditar={setVacanteEditando} />
          ))}
          {vacantes.length === 0 && (
            <p style={{ color: '#64748b', gridColumn: '1/-1', textAlign: 'center', padding: '2rem' }}>
              No hay vacantes registradas.
            </p>
          )}
        </div>
      )}

      <CandidatoModal
        isOpen={!!vacanteEditando}
        onClose={() => setVacanteEditando(null)}
        titulo="Editar Vacante"
      >
        {vacanteEditando && (
          <VacanteForm
            key={vacanteEditando.id}
            vacanteInicial={vacanteEditando}
            onActualizar={handleActualizar}
            cargando={guardando}
          />
        )}
      </CandidatoModal>
    </div>
  );
}
