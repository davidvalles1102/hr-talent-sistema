'use client';
// ============================================================
//  PÁGINA — Reactstrap
//  Reactstrap = componentes de Bootstrap para React.
//  Instalación: npm install bootstrap reactstrap
//  Importar CSS: import 'bootstrap/dist/css/bootstrap.min.css'
// ============================================================
import { useState, useEffect } from 'react';
import {
  Container, Row, Col,
  Card, CardBody, CardTitle, CardText, CardHeader,
  Table,
  Badge,
  Button,
  Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input,
  Alert,
  Spinner,
  Navbar, NavbarBrand, Nav, NavItem, NavLink,
} from 'reactstrap';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// ── Badge de estado usando Reactstrap Badge ─────────────────
function EstadoBadgeRS({ estado }) {
  const colores = {
    activo:     'success',
    en_proceso: 'primary',
    contratado: 'secondary',
    descartado: 'danger',
    abierta:    'success',
    pausada:    'warning',
    cerrada:    'danger',
  };
  return (
    <Badge color={colores[estado] || 'secondary'} pill>
      {estado?.replace('_', ' ')}
    </Badge>
  );
}

// ── Modal de confirmación con Reactstrap Modal ──────────────
function ModalConfirmar({ abierto, onConfirmar, onCancelar, nombre }) {
  return (
    <Modal isOpen={abierto} toggle={onCancelar}>
      <ModalHeader toggle={onCancelar}>Confirmar acción</ModalHeader>
      <ModalBody>
        ¿Estás seguro de que deseas eliminar a <strong>{nombre}</strong>?
        Esta acción no se puede deshacer.
      </ModalBody>
      <ModalFooter>
        <Button color="danger"     onClick={onConfirmar}>Sí, eliminar</Button>
        <Button color="secondary"  onClick={onCancelar}>Cancelar</Button>
      </ModalFooter>
    </Modal>
  );
}

// ── Formulario con Reactstrap Form ─────────────────────────
function FormularioRS({ onGuardar }) {
  const [form,  setForm]  = useState({ nombre:'', apellido:'', email:'', puesto_interes:'' });
  const [ok,    setOk]    = useState(false);
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setOk(false);
    try {
      await onGuardar(form);
      setForm({ nombre:'', apellido:'', email:'', puesto_interes:'' });
      setOk(true);
      setTimeout(() => setOk(false), 3000);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <Card className="mb-4">
      <CardHeader><strong>Registrar Candidato con Reactstrap Form</strong></CardHeader>
      <CardBody>
        {ok    && <Alert color="success">Candidato registrado exitosamente.</Alert>}
        {error && <Alert color="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="nombre">Nombre *</Label>
                <Input id="nombre" name="nombre" value={form.nombre}
                       onChange={handleChange} required />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="apellido">Apellido *</Label>
                <Input id="apellido" name="apellido" value={form.apellido}
                       onChange={handleChange} required />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="email">Email *</Label>
                <Input id="email" type="email" name="email" value={form.email}
                       onChange={handleChange} required />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="puesto_interes">Puesto de Interés *</Label>
                <Input id="puesto_interes" name="puesto_interes" value={form.puesto_interes}
                       onChange={handleChange} required />
              </FormGroup>
            </Col>
          </Row>
          <Button type="submit" color="primary">Registrar</Button>
        </Form>
      </CardBody>
    </Card>
  );
}

// ── Página principal ────────────────────────────────────────
export default function ReactstrapPage() {
  const [candidatos, setCandidatos] = useState([]);
  const [vacantes,   setVacantes]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [modal,      setModal]      = useState({ abierto: false, id: null, nombre: '' });

  useEffect(() => {
    async function cargar() {
      try {
        const [rc, rv] = await Promise.all([
          fetch(`${API}/candidatos`),
          fetch(`${API}/vacantes`),
        ]);
        const jc = await rc.json();
        const jv = await rv.json();
        setCandidatos(jc.data || []);
        setVacantes(jv.data   || []);
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, []);

  function abrirModal(c) {
    setModal({ abierto: true, id: c.id, nombre: `${c.nombre} ${c.apellido}` });
  }

  async function confirmarEliminar() {
    await fetch(`${API}/candidatos/${modal.id}`, { method: 'DELETE' });
    setCandidatos(prev => prev.filter(c => c.id !== modal.id));
    setModal({ abierto: false, id: null, nombre: '' });
  }

  async function guardarCandidato(data) {
    const res = await fetch(`${API}/candidatos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.errors?.[0]?.mensaje || err.error || 'Error');
    }
    const json = await res.json();
    setCandidatos(prev => [json.data, ...prev]);
  }

  return (
    <Container className="py-4">

      {/* ── Info sobre Reactstrap ── */}
      <Card className="mb-4 border-primary">
        <CardHeader className="bg-primary text-white">
          <strong>¿Qué es Reactstrap?</strong>
        </CardHeader>
        <CardBody>
          <CardText>
            Reactstrap es una librería que convierte los componentes de{' '}
            <strong>Bootstrap 5</strong> en componentes React reutilizables.
            En vez de escribir clases CSS manualmente, usas componentes como{' '}
            <code>&lt;Button color=&quot;primary&quot;&gt;</code>,{' '}
            <code>&lt;Table striped&gt;</code>, <code>&lt;Modal&gt;</code>, etc.
          </CardText>
          <Alert color="info" className="mb-0">
            <strong>Instalación:</strong>{' '}
            <code>npm install bootstrap reactstrap</code>
            {' → '}
            luego importar <code>bootstrap/dist/css/bootstrap.min.css</code>
          </Alert>
        </CardBody>
      </Card>

      {/* ── Formulario ── */}
      <FormularioRS onGuardar={guardarCandidato} />

      {/* ── Tabla de candidatos ── */}
      <Card className="mb-4">
        <CardHeader>
          <strong>Candidatos</strong>
          {' — '}
          <Badge color="primary">{candidatos.length}</Badge>
          {' '}
          <small className="text-muted">componente &lt;Table&gt; de Reactstrap</small>
        </CardHeader>
        <CardBody className="p-0">
          {loading ? (
            <div className="text-center py-4">
              <Spinner color="primary" /> <span className="ms-2">Cargando...</span>
            </div>
          ) : (
            <Table hover responsive className="mb-0">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Puesto</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {candidatos.map(c => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td><strong>{c.nombre} {c.apellido}</strong></td>
                    <td>{c.email}</td>
                    <td>{c.puesto_interes}</td>
                    <td><EstadoBadgeRS estado={c.estado} /></td>
                    <td>
                      <Button size="sm" color="danger" outline onClick={() => abrirModal(c)}>
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </CardBody>
      </Card>

      {/* ── Cards de vacantes ── */}
      <h5 className="mb-3">Vacantes — componente &lt;Card&gt; de Reactstrap</h5>
      <Row>
        {vacantes.map(v => (
          <Col key={v.id} md={4} className="mb-3">
            <Card className="h-100">
              <CardHeader className="d-flex justify-content-between">
                <span>{v.departamento}</span>
                <EstadoBadgeRS estado={v.estado} />
              </CardHeader>
              <CardBody>
                <CardTitle tag="h6">{v.titulo}</CardTitle>
                <CardText className="text-muted small">{v.descripcion}</CardText>
                <div className="d-flex gap-2 mt-2">
                  <Badge color="light" text="dark" className="border">
                    {v.modalidad}
                  </Badge>
                  {v.salario_min && (
                    <Badge color="success">
                      ${v.salario_min} – ${v.salario_max}
                    </Badge>
                  )}
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>

      {/* ── Modal de confirmación ── */}
      <ModalConfirmar
        abierto={modal.abierto}
        nombre={modal.nombre}
        onConfirmar={confirmarEliminar}
        onCancelar={() => setModal({ abierto: false, id: null, nombre: '' })}
      />

    </Container>
  );
}
