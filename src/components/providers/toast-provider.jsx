import { Toast } from "primereact/toast";
import React, { createContext, useRef } from "react";

export const ToastContext = createContext();

const ToastProvider = ({ children }) => {
  const toast = useRef(null);

  return (
    <ToastContext.Provider value={toast}>
      <Toast ref={toast} />
      {children}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
