import { useState, useCallback } from "react";

export const useHttp =()=>{

  const [error, setError]     = useState(null);
  const [loading, setLoading] = useState(false);

  const request = useCallback(
    async (url,method = 'GET',body=null,headers={'Content-Type': 'application/json'})=>{

      setLoading(true);
      
      try {
        const response = await fetch(url,{method,body,headers});
        if (!response.ok){
          throw new Error(`Не возможно обратиться по адресу ${url}, status: ${response.status}`)
        }
        const data = await response.json();
        setLoading(false);
        return data;
      } catch (error) {
        setLoading(false);
        setError(error.message);
        throw error;
      }

    },[]
  );

  const clearError = useCallback(() => setError(null),[]);

  return {loading, request, error, clearError}
  
}