import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ToastContainer } from '../../components/ToastContainer';
import { useToastStore } from '../../hooks/useToast';

export const AppLayout: React.FC = () => {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />
      <main className="ml-64 mt-16 p-6">
        <Outlet />
      </main>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
};
