import React, { createContext, useContext, useCallback, useState } from 'react';
import ToastContainer from '../components/ToastContainer';
import { uuid } from 'uuidv4';

export interface ToastMessage { //Exportando eu consigo reaproveitar a tipagem em outro arquivo
  id: string;
  type?: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

interface ToastContextData {
  addToast(message: Omit<ToastMessage, 'id'>): void;
  removeToast(id: string): void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

const ToastProvider: React.FC = ( { children }) => {
  const [message, setMessage] = useState<ToastMessage[]>([]);

  const addToast = useCallback(({type, title, description}: Omit<ToastMessage, 'id'>) => {
    const id = uuid();

    const toast = {
      id,
      type,
      title,
      description
    }

    setMessage([...message, toast]) // ou setMessages((state) => [...state, toast]);

  },[message])

  const removeToast = useCallback((id: string) => {
    setMessage((state) => state.filter((message) => message.id !== id))
  },[])

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer messages={message}/>
    </ToastContext.Provider>
  )
}

function useToast(): ToastContextData {
  const context = useContext(ToastContext);

  if(!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
}

export { ToastProvider, useToast }
