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

  return { vacantes, loading, error, refetch: fetchVacantes };
}
