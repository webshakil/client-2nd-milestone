import { useState, useCallback } from 'react';
import { services } from '../services';
import { toast } from 'react-hot-toast';

export const useApiService = (serviceName) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const service = services[serviceName];

  const execute = useCallback(async (method, ...args) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await service[method](...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [service]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    loading,
    error,
    data,
    execute,
    reset,
    service
  };
};