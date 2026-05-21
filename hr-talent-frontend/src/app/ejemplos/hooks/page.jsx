'use client';
// ============================================================
//  PÁGINA EDUCATIVA — React Hooks
//  Explica y demuestra: useState, useEffect, useMemo, useCallback
// ============================================================
import { useState, useEffect, useMemo, useCallback } from 'react';

// ── Estilos en línea para mantenerlo sin librerías ──────────
const s = {
  section:  { background:'#fff', border:'1px solid #e2e8f0', borderRadius:'10px', padding:'1.5rem', marginBottom:'1.5rem' },
  h2:       { fontSize:'1.1rem', fontWeight:700, marginBottom:'.5rem', color:'#1e293b' },
  label:    { fontSize:'.8rem', fontWeight:600, color:'#374151', display:'block', marginBottom:'.3rem' },
  code:     { background:'#f1f5f9', padding:'.1rem .4rem', borderRadius:'4px', fontFamily:'monospace', fontSize:'.85rem' },
  pre:      { background:'#1e293b', color:'#e2e8f0', padding:'1rem', borderRadius:'8px', fontSize:'.8rem', overflow:'auto', lineHeight:1.7 },
  badge:    { display:'inline-block', padding:'.2rem .6rem', borderRadius:'999px', fontSize:'.75rem', fontWeight:600 },
  row:      { display:'flex', gap:'1rem', flexWrap:'wrap', alignItems:'center', marginTop:'.75rem' },
  btnBlue:  { background:'#2563eb', color:'#fff', padding:'.4rem 1rem', borderRadius:'6px', border:'none', cursor:'pointer' },
  btnRed:   { background:'#dc2626', color:'#fff', padding:'.4rem 1rem', borderRadius:'6px', border:'none', cursor:'pointer' },
  btnGray:  { background:'#e2e8f0', color:'#374151', padding:'.4rem 1rem', borderRadius:'6px', border:'none', cursor:'pointer' },
  result:   { background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:'6px', padding:'.5rem .75rem', color:'#166534', fontSize:'.875rem', marginTop:'.75rem' },
};

// ────────────────────────────────────────────────────────────
//  1. useState
// ────────────────────────────────────────────────────────────
function EjemploUseState() {
  const [contador, setContador] = useState(0);          // número
  const [nombre,   setNombre]   = useState('');          // texto
  const [activo,   setActivo]   = useState(false);       // booleano

  return (
    <div style={s.section}>
      <h2 style={s.h2}>1. useState — Estado local del componente</h2>
      <p style={{ fontSize:'.875rem', color:'#475569', marginBottom:'1rem' }}>
        <code style={s.code}>useState(valorInicial)</code> devuelve un array con
        <strong> [valor, setValor]</strong>. Cada vez que llamas <code style={s.code}>setValor</code>,
        React vuelve a renderizar el componente.
      </p>

      <pre style={s.pre}>{`const [contador, setContador] = useState(0);
const [nombre,   setNombre]   = useState('');
const [activo,   setActivo]   = useState(false);`}</pre>

      {/* Demo contador */}
      <div style={s.row}>
        <button style={s.btnRed}  onClick={() => setContador(c => c - 1)}>−</button>
        <span style={{ fontSize:'1.5rem', fontWeight:700, minWidth:'2rem', textAlign:'center' }}>{contador}</span>
        <button style={s.btnBlue} onClick={() => setContador(c => c + 1)}>+</button>
        <button style={s.btnGray} onClick={() => setContador(0)}>Reset</button>
      </div>

      {/* Demo texto */}
      <div style={{ marginTop:'1rem' }}>
        <label style={s.label}>Escribe tu nombre:</label>
        <input value={nombre} onChange={e => setNombre(e.target.value)}
               style={{ maxWidth:'250px', padding:'.4rem .7rem', border:'1px solid #cbd5e1', borderRadius:'6px' }} />
        {nombre && <div style={s.result}>Hola, <strong>{nombre}</strong> 👋</div>}
      </div>

      {/* Demo booleano */}
      <div style={s.row}>
        <button style={activo ? s.btnRed : s.btnBlue}
                onClick={() => setActivo(v => !v)}>
          {activo ? 'Desactivar' : 'Activar'}
        </button>
        <span style={{ ...s.badge, background: activo ? '#d4edda' : '#f8d7da', color: activo ? '#155724' : '#721c24' }}>
          {activo ? 'ACTIVO' : 'INACTIVO'}
        </span>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
//  2. useEffect
// ────────────────────────────────────────────────────────────
function EjemploUseEffect() {
  const [segundos,  setSegundos]  = useState(0);
  const [corriendo, setCorriendo] = useState(false);
  const [datos,     setDatos]     = useState(null);
  const [cargando,  setCargando]  = useState(false);

  // useEffect con cleanup: temporizador que se limpia al desmontar o pausar
  useEffect(() => {
    if (!corriendo) return;           // si no corre, no hace nada

    const intervalo = setInterval(() => {
      setSegundos(s => s + 1);
    }, 1000);

    return () => clearInterval(intervalo);   // ← CLEANUP: evita memory leaks
  }, [corriendo]);                           // ← depende de "corriendo"

  // useEffect para simular fetch de datos
  async function simularFetch() {
    setCargando(true);
    setDatos(null);
    await new Promise(r => setTimeout(r, 1200));   // simula latencia
    setDatos({ candidatos: 15, vacantes: 7, evaluaciones: 20 });
    setCargando(false);
  }

  return (
    <div style={s.section}>
      <h2 style={s.h2}>2. useEffect — Efectos secundarios</h2>
      <p style={{ fontSize:'.875rem', color:'#475569', marginBottom:'1rem' }}>
        Se ejecuta <strong>después del render</strong>. El array de dependencias controla
        cuándo se vuelve a ejecutar. La función de retorno es el <strong>cleanup</strong>.
      </p>

      <pre style={s.pre}>{`useEffect(() => {
  const intervalo = setInterval(() => setSegundos(s => s+1), 1000);
  return () => clearInterval(intervalo);  // cleanup
}, [corriendo]);   // re-ejecuta cuando cambia "corriendo"`}</pre>

      {/* Demo temporizador */}
      <div style={s.row}>
        <span style={{ fontSize:'2rem', fontWeight:800, fontVariantNumeric:'tabular-nums' }}>
          {String(Math.floor(segundos/60)).padStart(2,'0')}:{String(segundos%60).padStart(2,'0')}
        </span>
        <button style={corriendo ? s.btnRed : s.btnBlue}
                onClick={() => setCorriendo(v => !v)}>
          {corriendo ? 'Pausar' : 'Iniciar'}
        </button>
        <button style={s.btnGray} onClick={() => { setCorriendo(false); setSegundos(0); }}>
          Reset
        </button>
      </div>

      {/* Demo fetch simulado */}
      <div style={{ marginTop:'1.25rem' }}>
        <button style={s.btnBlue} onClick={simularFetch} disabled={cargando}>
          {cargando ? 'Cargando...' : 'Simular fetch a la API'}
        </button>
        {datos && (
          <div style={s.result}>
            Candidatos: <strong>{datos.candidatos}</strong> | Vacantes: <strong>{datos.vacantes}</strong> | Evaluaciones: <strong>{datos.evaluaciones}</strong>
          </div>
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
//  3. useMemo
// ────────────────────────────────────────────────────────────
const LISTA = ['Pedro González','María Flores','Diego Campos','Alicia Ramírez',
               'Hugo Sandoval','Natalia Espinoza','Laura Vásquez','Fernando Reyes'];

function EjemploUseMemo() {
  const [busqueda,  setBusqueda]  = useState('');
  const [contador,  setContador]  = useState(0);   // render extra para demostrar memo

  // useMemo: el filtro solo se recalcula cuando cambia "busqueda"
  // Sin useMemo se recalcularía también cuando cambia "contador"
  const filtrados = useMemo(() => {
    console.log('useMemo ejecutando filtro...');    // aparece en consola
    return LISTA.filter(n => n.toLowerCase().includes(busqueda.toLowerCase()));
  }, [busqueda]);

  return (
    <div style={s.section}>
      <h2 style={s.h2}>3. useMemo — Memorizar valores calculados</h2>
      <p style={{ fontSize:'.875rem', color:'#475569', marginBottom:'1rem' }}>
        Evita recalcular operaciones costosas en cada render.
        Solo recalcula cuando cambian sus dependencias.
      </p>

      <pre style={s.pre}>{`const filtrados = useMemo(() => {
  return lista.filter(n => n.includes(busqueda));
}, [busqueda]);   // solo recalcula si cambia "busqueda"`}</pre>

      <div style={s.row}>
        <input placeholder="Buscar candidato..."
               value={busqueda} onChange={e => setBusqueda(e.target.value)}
               style={{ maxWidth:'240px', padding:'.4rem .7rem', border:'1px solid #cbd5e1', borderRadius:'6px' }} />
        <button style={s.btnGray} onClick={() => setContador(c => c+1)}>
          Re-render #{contador} (no recalcula el filtro)
        </button>
      </div>
      <ul style={{ marginTop:'.75rem', fontSize:'.875rem', color:'#374151', paddingLeft:'1.25rem' }}>
        {filtrados.map(n => <li key={n}>{n}</li>)}
      </ul>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
//  4. useCallback
// ────────────────────────────────────────────────────────────
function EjemploUseCallback() {
  const [items,   setItems]   = useState(['Candidato A', 'Candidato B']);
  const [nuevo,   setNuevo]   = useState('');
  const [renders, setRenders] = useState(0);

  // useCallback: la referencia de la función NO cambia entre renders
  // Útil para pasar como prop a componentes hijos sin causar re-renders innecesarios
  const agregarItem = useCallback(() => {
    if (!nuevo.trim()) return;
    setItems(prev => [...prev, nuevo.trim()]);
    setNuevo('');
  }, [nuevo]);

  const eliminarItem = useCallback((index) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <div style={s.section}>
      <h2 style={s.h2}>4. useCallback — Memorizar funciones</h2>
      <p style={{ fontSize:'.875rem', color:'#475569', marginBottom:'1rem' }}>
        Devuelve una función memorizada. La referencia solo cambia si cambian
        sus dependencias. Ideal para funciones que se pasan como <strong>props</strong> a componentes hijos.
      </p>

      <pre style={s.pre}>{`const eliminarItem = useCallback((index) => {
  setItems(prev => prev.filter((_, i) => i !== index));
}, []);   // [] = la función nunca se recrea`}</pre>

      <div style={s.row}>
        <input placeholder="Nuevo candidato..."
               value={nuevo} onChange={e => { setNuevo(e.target.value); setRenders(r=>r+1); }}
               style={{ maxWidth:'220px', padding:'.4rem .7rem', border:'1px solid #cbd5e1', borderRadius:'6px' }} />
        <button style={s.btnBlue} onClick={agregarItem}>Agregar</button>
      </div>
      <ul style={{ marginTop:'.75rem', fontSize:'.875rem', paddingLeft:0, listStyle:'none' }}>
        {items.map((item, i) => (
          <li key={i} style={{ display:'flex', justifyContent:'space-between', padding:'.35rem .5rem',
                               borderBottom:'1px solid #f1f5f9' }}>
            {item}
            <button style={{ background:'none', color:'#dc2626', border:'none', cursor:'pointer' }}
                    onClick={() => eliminarItem(i)}>✕</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
//  Página principal que agrupa todo
// ────────────────────────────────────────────────────────────
export default function HooksPage() {
  return (
    <div className="page-wrapper">
      <h1 className="page-title">Ejemplos: React Hooks</h1>
      <p style={{ color:'#475569', marginBottom:'2rem', fontSize:'.9rem' }}>
        Los hooks permiten usar estado y otras características de React en componentes funcionales.
        Solo pueden llamarse en el nivel superior del componente (no dentro de if/for).
      </p>
      <EjemploUseState />
      <EjemploUseEffect />
      <EjemploUseMemo />
      <EjemploUseCallback />
    </div>
  );
}
