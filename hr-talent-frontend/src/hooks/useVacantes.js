'use client';
import { useState, useEffect, useCallback } from 'react';
import { vacantesService } from '../services/vacantesService';
import { Vacante } from '../models/Vacante';

export function useVacantes() {
  const [vacantes, setVacantes] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  const fetchVacantes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await vacantesService.getAll();
      setVacantes(data.map(v => new Vacante(v)));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVacantes();
  }, [fetchVacantes]);

  const crearVacante = useCallback(async (formData) => {
    const nueva = await vacantesService.create(formData);
    setVacantes(prev => [new Vacante(nueva), ...prev]);
    return nueva;
  }, []);

  const actualizarVacante = useCallback(async (id, formData) => {
    const actualizada = await vacantesService.update(id, formData);
    setVacantes(prev => prev.map(v => v.id === id ? new Vacante(actualizada) : v));
    return actualizada;
  }, []);

  return { vacantes, loading, error, crearVacante, actualizarVacante, refetch: fetchVacantes };
}
