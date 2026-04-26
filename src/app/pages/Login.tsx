import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAppContext, Role } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Building2, User, KeyRound } from 'lucide-react';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUserRole } = useAppContext();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Por favor ingrese su usuario y contraseña.');
      return;
    }

    let role: Role = null;
    if (username.toLowerCase() === 'caja') {
      role = 'Caja';
    } else if (username.toLowerCase() === 'medico') {
      role = 'Medico';
    } else {
      setError('Usuario incorrecto. Use "caja" o "medico".');
      return;
    }

    setUserRole(role);
    if (role === 'Caja') {
      navigate('/caja');
    } else {
      navigate('/consultorio');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        {/* Header Section */}
        <div className="bg-[#1e3a8a] text-white py-8 px-6 text-center flex flex-col items-center">
          <div className="bg-white/10 p-4 rounded-full mb-4">
            <Building2 className="w-12 h-12" />
          </div>
          <h1 className="text-xl font-bold uppercase tracking-wide">
            Municipalidad Distrital<br />de El Porvenir
          </h1>
          <p className="mt-2 text-sm text-blue-200 opacity-90">
            Control y Emisión de Carnets de Sanidad
          </p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <h2 className="text-2xl font-bold text-slate-800 text-center mb-6">Iniciar Sesión</h2>
          
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-md text-sm font-medium border border-red-100 text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-600 ml-1">Usuario</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Ej: caja o medico"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-600 ml-1">Contraseña</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full mt-2 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-medium text-lg h-12"
            >
              Ingresar al Sistema
            </Button>
            
            <p className="text-xs text-slate-500 text-center mt-6">
              Para probar, use el usuario "caja" o "medico" con cualquier contraseña.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
