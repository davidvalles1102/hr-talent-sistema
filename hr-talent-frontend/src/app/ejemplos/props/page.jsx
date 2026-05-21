'use client';
// ============================================================
//  PÁGINA EDUCATIVA — Props en React
//  Cómo pasar datos entre componentes padre e hijo
// ============================================================
import { useState } from 'react';

const s = {
  section: { background:'#fff', border:'1px solid #e2e8f0', borderRadius:'10px', padding:'1.5rem', marginBottom:'1.5rem' },
  h2:      { fontSize:'1.1rem', fontWeight:700, marginBottom:'.5rem', color:'#1e293b' },
  pre:     { background:'#1e293b', color:'#e2e8f0', padding:'1rem', borderRadius:'8px', fontSize:'.8rem', overflow:'auto', lineHeight:1.7, marginBottom:'1rem' },
  code:    { background:'#f1f5f9', padding:'.1rem .4rem', borderRadius:'4px', fontFamily:'monospace', fontSize:'.85rem' },
  desc:    { fontSize:'.875rem', color:'#475569', marginBottom:'1rem' },
};

// ────────────────────────────────────────────────────────────
//  1. Props básicas
// ────────────────────────────────────────────────────────────

// Componente hijo: recibe props
function TarjetaCandidato({ nombre, puesto, experiencia }) {
  return (
    <div style={{ border:'1px solid #e2e8f0', borderRadius:'8px', padding:'1rem', maxWidth:'280px' }}>
      <h4 style={{ fontWeight:700 }}>{nombre}</h4>
      <p style={{ color:'#2563eb', fontSize:'.85rem' }}>{puesto}</p>
      <p style={{ color:'#64748b', fontSize:'.8rem' }}>💼 {experiencia} años de experiencia</p>
    </div>
  );
}

function EjemploPropsBasicas() {
  return (
    <div style={s.section}>
      <h2 style={s.h2}>1. Props básicas — Pasar datos del padre al hijo</h2>
      <p style={s.desc}>
        Las props son como <strong>argumentos de función</strong>. El padre las pasa,
        el hijo las recibe como solo lectura. Nunca se modifican dentro del hijo.
      </p>

      <pre style={s.pre}>{`// Componente hijo
function TarjetaCandidato({ nombre, puesto, experiencia }) {
  return (
    <div>
      <h4>{nombre}</h4>
      <p>{puesto}</p>
      <p>{experiencia} años</p>
    </div>
  );
}

// Componente padre: pasa props con atributos JSX
<TarjetaCandidato
  nombre="Pedro González"
  puesto="Desarrollador Backend"
  experiencia={3}
/>`}</pre>

      <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>
        <TarjetaCandidato nombre="Pedro González"  puesto="Desarrollador Backend" experiencia={3} />
        <TarjetaCandidato nombre="María Flores"    puesto="Analista de Datos"     experiencia={4} />
        <TarjetaCandidato nombre="Diego Campos"    puesto="Desarrollador Backend" experiencia={6} />
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
//  2. Props con valores por defecto
// ────────────────────────────────────────────────────────────
function EstadoBadge({ estado = 'activo', tamaño = 'normal' }) {
  const config = {
    activo:     { label:'Activo',     bg:'#d4edda', color:'#155724' },
    en_proceso: { label:'En Proceso', bg:'#cce5ff', color:'#0056b3' },
    contratado: { label:'Contratado', bg:'#e2d9f3', color:'#4a0e8f' },
    descartado: { label:'Descartado', bg:'#f8d7da', color:'#721c24' },
  };
  const c    = config[estado] || config.activo;
  const size = tamaño === 'grande' ? '.9rem' : '.75rem';

  return (
    <span style={{ background:c.bg, color:c.color, padding:'.2rem .65rem',
                   borderRadius:'999px', fontSize:size, fontWeight:600 }}>
      {c.label}
    </span>
  );
}

function EjemploDefaultProps() {
  return (
    <div style={s.section}>
      <h2 style={s.h2}>2. Valores por defecto en props (destructuring)</h2>
      <p style={s.desc}>
        Se definen directamente en la desestructuración del parámetro.
        Si el padre no pasa la prop, se usa el valor por defecto.
      </p>

      <pre style={s.pre}>{`function EstadoBadge({ estado = 'activo', tamaño = 'normal' }) {
  // Si el padre no pasa "estado", usará 'activo' por defecto
}`}</pre>

      <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap', alignItems:'center', marginTop:'.5rem' }}>
        <EstadoBadge />                                    {/* usa defaults */}
        <EstadoBadge estado="en_proceso" />
        <EstadoBadge estado="contratado" tamaño="grande" />
        <EstadoBadge estado="descartado" tamaño="grande" />
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
//  3. Props de callback (funciones)
// ────────────────────────────────────────────────────────────
function BotonAccion({ label, variante = 'primario', onClick }) {
  const estilos = {
    primario:  { background:'#2563eb', color:'#fff' },
    secundario:{ background:'#e2e8f0', color:'#374151' },
    peligro:   { background:'#dc2626', color:'#fff' },
  };
  return (
    <button
      onClick={onClick}
      style={{ ...estilos[variante], padding:'.45rem 1rem', borderRadius:'6px',
               border:'none', cursor:'pointer', fontWeight:500 }}
    >
      {label}
    </button>
  );
}

function EjemploCallbackProps() {
  const [log, setLog] = useState([]);

  function registrar(accion) {
    setLog(prev => [`[${new Date().toLocaleTimeString()}] ${accion}`, ...prev.slice(0, 4)]);
  }

  return (
    <div style={s.section}>
      <h2 style={s.h2}>3. Props de callback — El hijo notifica al padre</h2>
      <p style={s.desc}>
        Las funciones también son props. El <strong>padre define la función</strong>,
        el <strong>hijo la llama</strong>. Así el hijo nunca modifica el estado del padre directamente.
      </p>

      <pre style={s.pre}>{`// Padre define la función y la pasa como prop
function Padre() {
  function handleAprobar() { console.log('Aprobado'); }

  return <Hijo onAprobar={handleAprobar} />;
}

// Hijo llama al callback cuando ocurre un evento
function Hijo({ onAprobar }) {
  return <button onClick={onAprobar}>Aprobar</button>;
}`}</pre>

      <div style={{ display:'flex', gap:'.75rem', flexWrap:'wrap', marginBottom:'1rem' }}>
        <BotonAccion label="Aprobar"   variante="primario"   onClick={() => registrar('Candidato APROBADO')} />
        <BotonAccion label="En espera" variante="secundario" onClick={() => registrar('Candidato en ESPERA')} />
        <BotonAccion label="Descartar" variante="peligro"    onClick={() => registrar('Candidato DESCARTADO')} />
      </div>

      <div style={{ background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'6px', padding:'.75rem', minHeight:'80px' }}>
        <p style={{ fontSize:'.75rem', color:'#94a3b8', marginBottom:'.4rem' }}>Log de acciones:</p>
        {log.length === 0
          ? <p style={{ color:'#94a3b8', fontSize:'.8rem' }}>Presiona un botón...</p>
          : log.map((l, i) => <p key={i} style={{ fontSize:'.8rem', color:'#374151' }}>{l}</p>)
        }
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
//  4. children prop
// ────────────────────────────────────────────────────────────
function Panel({ titulo, children, color = '#2563eb' }) {
  return (
    <div style={{ border:`2px solid ${color}`, borderRadius:'8px', overflow:'hidden', marginBottom:'.75rem' }}>
      <div style={{ background:color, color:'#fff', padding:'.5rem 1rem', fontWeight:600, fontSize:'.875rem' }}>
        {titulo}
      </div>
      <div style={{ padding:'1rem' }}>{children}</div>
    </div>
  );
}

function EjemploChildren() {
  return (
    <div style={s.section}>
      <h2 style={s.h2}>4. children — Composición de componentes</h2>
      <p style={s.desc}>
        <code style={s.code}>children</code> es una prop especial que representa
        todo lo que se coloca <strong>entre las etiquetas</strong> del componente.
        Permite crear componentes contenedor reutilizables.
      </p>

      <pre style={s.pre}>{`function Panel({ titulo, children }) {
  return (
    <div>
      <h3>{titulo}</h3>
      <div>{children}</div>   {/* aquí va lo que pongas entre las etiquetas */}
    </div>
  );
}

// Uso:
<Panel titulo="Datos del Candidato">
  <p>Nombre: Pedro González</p>
  <p>Email: pedro@mail.com</p>
</Panel>`}</pre>

      <Panel titulo="Candidato Destacado" color="#2563eb">
        <p style={{ fontSize:'.875rem' }}>👤 Pedro González — Desarrollador Backend</p>
        <p style={{ fontSize:'.8rem', color:'#64748b' }}>Puntaje promedio: 8.2 / 10</p>
      </Panel>

      <Panel titulo="Vacante Urgente" color="#dc2626">
        <p style={{ fontSize:'.875rem' }}>📋 Gerente de Proyectos TI</p>
        <p style={{ fontSize:'.8rem', color:'#64748b' }}>Salario: $1,500 – $2,200</p>
      </Panel>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
//  Página principal
// ────────────────────────────────────────────────────────────
export default function PropsPage() {
  return (
    <div className="page-wrapper">
      <h1 className="page-title">Ejemplos: Props en React</h1>
      <p style={{ color:'#475569', marginBottom:'2rem', fontSize:'.9rem' }}>
        Las props (propiedades) son la forma en que los componentes se comunican.
        Fluyen <strong>de padre a hijo</strong> y son de solo lectura dentro del hijo.
      </p>
      <EjemploPropsBasicas />
      <EjemploDefaultProps />
      <EjemploCallbackProps />
      <EjemploChildren />
    </div>
  );
}
