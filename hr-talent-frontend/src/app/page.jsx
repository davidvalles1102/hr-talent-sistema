// Dashboard — Server Component
// Llama a la API directamente desde el servidor (Next.js fetch)
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function getStats() {
  try {
    const [rc, rv] = await Promise.all([
      fetch(`${API}/candidatos`, { cache: 'no-store' }),
      fetch(`${API}/vacantes`,   { cache: 'no-store' }),
    ]);
    const candidatos = await rc.json();
    const vacantes   = await rv.json();
    return {
      totalCandidatos: candidatos.data?.length || 0,
      totalVacantes:   vacantes.data?.length   || 0,
      enProceso:       candidatos.data?.filter(c => c.estado === 'en_proceso').length || 0,
      contratados:     candidatos.data?.filter(c => c.estado === 'contratado').length  || 0,
    };
  } catch {
    return { totalCandidatos: 0, totalVacantes: 0, enProceso: 0, contratados: 0 };
  }
}

export default async function DashboardPage() {
  const stats = await getStats();

  const tarjetas = [
    { label: 'Total Candidatos', valor: stats.totalCandidatos, color: '#2563eb', icon: '👤' },
    { label: 'En Proceso',       valor: stats.enProceso,       color: '#0891b2', icon: '⚙️' },
    { label: 'Contratados',      valor: stats.contratados,     color: '#16a34a', icon: '✅' },
    { label: 'Vacantes Abiertas',valor: stats.totalVacantes,   color: '#7c3aed', icon: '📋' },
  ];

  return (
    <div className="page-wrapper">
      <h1 className="page-title">Dashboard — Sistema RRHH</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {tarjetas.map(t => (
          <div key={t.label} className="card" style={{ borderTop: `4px solid ${t.color}` }}>
            <div style={{ fontSize: '2rem', marginBottom: '.5rem' }}>{t.icon}</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: t.color }}>{t.valor}</div>
            <div style={{ color: '#64748b', fontSize: '.875rem' }}>{t.label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Estructura MVC del Proyecto</h2>
        <pre style={{ background: '#f8fafc', padding: '1rem', borderRadius: '6px', fontSize: '.8rem', lineHeight: 1.7, overflow: 'auto' }}>
{`src/
├── models/          ← M  Clases de datos (Candidato, Vacante)
├── services/        ← C  Comunicación con la API
├── hooks/           ← C  Lógica de estado reutilizable
└── components/      ← V  Interfaz de usuario (JSX)
    ├── candidatos/       sin librerías externas
    ├── vacantes/         CSS Modules
    └── reactstrap/       con Reactstrap + Bootstrap`}
        </pre>
      </div>
    </div>
  );
}
