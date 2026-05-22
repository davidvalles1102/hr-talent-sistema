const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const vacantesService = {
  async getAll() {
    const res = await fetch(`${API}/vacantes`);
    if (!res.ok) throw new Error('Error al obtener vacantes');
    const json = await res.json();
    return json.data;
  },

  async getById(id) {
    const res = await fetch(`${API}/vacantes/${id}`);
    if (!res.ok) throw new Error('Vacante no encontrada');
    const json = await res.json();
    return json.data;
  },

  async create(data) {
    const res = await fetch(`${API}/vacantes`, {
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
    const res = await fetch(`${API}/vacantes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.errors?.[0]?.mensaje || err.error || 'Error al actualizar');
    }
    const json = await res.json();
    return json.data;
  },
};
