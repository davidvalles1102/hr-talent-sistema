'use client';
import { useVacantes } from '../../hooks/useVacantes';
import VacanteCard from '../../components/vacantes/VacanteCard';

export default function VacantesPage() {
  const { vacantes, loading, error } = useVacantes();

  return (
    <div className="page-wrapper">
      <h1 className="page-title">Vacantes</h1>

      {loading && <div className="loading">Cargando vacantes...</div>}
      {error   && <div className="alert alert-error">{error}</div>}

      {!loading && !error && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1rem' }}>
          {vacantes.map(v => <VacanteCard key={v.id} vacante={v} />)}
        </div>
      )}
    </div>
  );
}
