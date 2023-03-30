import {
  useState,
  useEffect,
  createContext,
  useCallback,
  useContext,
} from "react";

import styles from "./Toast.module.css";

const ToastContext = createContext();
export default ToastContext;

export const ToastContextProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const TYPES = {
    success: styles.success,
    error: styles.error,
  };

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts(toasts.slice(1));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toasts]);

  const addToast = useCallback(
    (toast) => {
      setToasts((toasts) => [...toasts, toast]);
    },
    [setToasts]
  );

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className={styles.wrapper}>
        {toasts.map(({ type, message }, index) => (
          <div className={`${styles.toast} ${TYPES[type]}`} key={index}>
            {message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToastContext = () => useContext(ToastContext);
