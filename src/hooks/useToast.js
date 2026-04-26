import { useState, useCallback } from "react";

export default function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success", duration = 5000) => {
    const id = Date.now() + Math.random(); // Better unique ID
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    
    if (duration) {
      setTimeout(() => {
        // eslint-disable-next-line react-hooks/immutability
        removeToast(id);
      }, duration);
    }
  }, []);

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}