import React from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router';
import { useAppContext } from '../context/AppContext';
import { Building2, LogOut } from 'lucide-react';
import { Button } from './ui/button';

export const Layout = () => {
  const { userRole, logout } = useAppContext();
  const navigate = useNavigate();

  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6] font-sans text-slate-900">
      {/* Top Navigation */}
      <header className="bg-[#1e3a8a] text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="w-6 h-6" />
            <h1 className="font-semibold text-lg hidden sm:block">
              Municipalidad Distrital de El Porvenir - Carnet de Sanidad
            </h1>
            <h1 className="font-semibold text-lg sm:hidden">
              Carnet de Sanidad
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="opacity-80">Módulo:</span>{' '}
              <strong className="font-medium">{userRole === 'Caja' ? 'Caja / Administrativo' : 'Consultorio Médico'}</strong>
            </div>
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="text-white hover:bg-white/10 hover:text-white flex items-center gap-2 h-9 min-h-9 px-3"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};
