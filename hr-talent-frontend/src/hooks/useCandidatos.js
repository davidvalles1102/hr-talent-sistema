// ============================================================
//  CUSTOM HOOK — useCandidatos
//  Encapsula toda la lógica de estado relacionada a candidatos.
//  Combina useState, useEffect y useCallback.
// ============================================================
'use client';
import { useState, useEffect, useCallback } from 'react';
import { candidatosService } from '../services/candidatosService';
import { Candidato } from '../models/Candidato';

export function useCandidatos() {
  const [candidatos, setCandidatos]   = useState([]);   // lista de candidatos
  const [loading,    setLoading]      = useState(true);  // estado de carga
  const [error,      setError]        = useState(null);  // mensaje de error

  // useCallback evita recrear la función en cada render
  const fetchCandidatos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await candidatosService.getAll();
      // Convertimos los datos planos en instancias del Modelo
      setCandidatos(data.map(c => new Candidato(c)));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // useEffect ejecuta fetchCandidatos al montar el componente
  useEffect(() => {
    fetchCandidatos();
  }, [fetchCandidatos]);

  const crearCandidato = useCallback(async (formData) => {
    const nuevo = await candidatosService.create(formData);
    setCandidatos(prev => [new Candidato(nuevo), ...prev]);
    return nuevo;
  }, []);

  const actualizarCandidato = useCallback(async (id, formData) => {
    const actualizado = await candidatosService.update(id, formData);
    setCandidatos(prev => prev.map(c => c.id === id ? new Candidato(actualizado) : c));
    return actualizado;
  }, []);

  const eliminarCandidato = useCallback(async (id) => {
    await candidatosService.remove(id);
    setCandidatos(prev => prev.filter(c => c.id !== id));
  }, []);

  return {
    candidatos,
    loading,
    error,
    crearCandidato,
    actualizarCandidato,
    eliminarCandidato,
    refetch: fetchCandidatos,
  };
}
