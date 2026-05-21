// ============================================================
//  SERVICIO (Controlador MVC) — Candidatos
//  Toda la comunicación HTTP con la API vive aquí.
//  Los componentes nunca llaman a fetch directamente.
// ============================================================

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const candidatosService = {
  async getAll() {
    const res = await fetch(`${API}/candidatos`);
    if (!res.ok) throw new Error('Error al obtener candidatos');
    const json = await res.json();
    return json.data;
  },

  async getById(id) {
    const res = await fetch(`${API}/candidatos/${id}`);
    if (!res.ok) throw new Error('Candidato no encontrado');
    const json = await res.json();
    return json.data;
  },

  async create(data) {
    const res = await fetch(`${API}/candidatos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.errors?.[0]?.mensaje || err.error || 'Error al crear');
    }
    const json = await res.json();
    return json.data;
  },

  async update(id, data) {
    const res = await fetch(`${API}/candidatos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al actualizar candidato');
    const json = await res.json();
    return json.data;
  },

  async remove(id) {
    const res = await fetch(`${API}/candidatos/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al eliminar candidato');
    return true;
  },
};
