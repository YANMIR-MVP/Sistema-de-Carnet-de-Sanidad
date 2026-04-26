import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Search, Plus, UserPlus, CreditCard, Printer } from 'lucide-react';
import { useNavigate } from 'react-router';
import * as DialogPrimitive from "@radix-ui/react-dialog";

export const CajaDashboard = () => {
  const { citizens, addCitizen, updateCitizen } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDni, setNewDni] = useState('');
  const navigate = useNavigate();

  const filteredCitizens = citizens.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.dni.includes(searchTerm)
  );

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName && newDni) {
      addCitizen({
        name: newName,
        dni: newDni,
        paymentStatus: 'Pendiente',
        medicalStatus: 'Pendiente',
        carnetIssued: false
      });
      setNewName('');
      setNewDni('');
      setIsModalOpen(false);
    }
  };

  const handlePayment = (id: string) => {
    updateCitizen(id, { paymentStatus: 'Pagado' });
  };

  const navigateToPrint = (id: string) => {
    navigate(`/emision/${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Caja y Registro</h2>
          <p className="text-slate-500 mt-1">Gestión de ciudadanos y pagos de trámite</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              type="text" 
              placeholder="Buscar por nombre o DNI..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-slate-50"
            />
          </div>
          
          <DialogPrimitive.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogPrimitive.Trigger asChild>
              <Button className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white whitespace-nowrap">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Trámite
              </Button>
            </DialogPrimitive.Trigger>
            <DialogPrimitive.Portal>
              <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
              <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
                <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-4">
                  <DialogPrimitive.Title className="text-lg font-semibold leading-none tracking-tight">
                    Registrar Nuevo Ciudadano
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Description className="text-sm text-slate-500">
                    Ingrese los datos del ciudadano para iniciar su trámite.
                  </DialogPrimitive.Description>
                </div>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Nombre Completo</label>
                    <Input 
                      placeholder="Ej. Juan Pérez" 
                      value={newName} 
                      onChange={e => setNewName(e.target.value)} 
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">DNI</label>
                    <Input 
                      placeholder="Ej. 12345678" 
                      value={newDni} 
                      onChange={e => setNewDni(e.target.value)} 
                      required
                      pattern="[0-9]{8}"
                      title="Debe tener 8 dígitos numéricos"
                    />
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <DialogPrimitive.Close asChild>
                      <Button type="button" variant="outline">Cancelar</Button>
                    </DialogPrimitive.Close>
                    <Button type="submit" className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white">
                      Guardar Registro
                    </Button>
                  </div>
                </form>
              </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
          </DialogPrimitive.Root>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">Ciudadano / DNI</th>
                <th scope="col" className="px-6 py-4 font-medium">Estado de Pago</th>
                <th scope="col" className="px-6 py-4 font-medium">Evaluación Médica</th>
                <th scope="col" className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredCitizens.map((citizen) => (
                <tr key={citizen.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{citizen.name}</div>
                    <div className="text-slate-500 text-xs mt-1 font-mono">{citizen.dni}</div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={citizen.paymentStatus === 'Pagado' ? 'success' : 'destructive'}>
                      {citizen.paymentStatus === 'Pagado' ? 'PAGADO' : 'PENDIENTE'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge 
                      variant={
                        citizen.medicalStatus === 'Apto' ? 'success' : 
                        citizen.medicalStatus === 'No Apto' ? 'destructive' : 
                        'warning'
                      }
                    >
                      {citizen.medicalStatus.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {citizen.paymentStatus === 'Pendiente' ? (
                        <Button 
                          onClick={() => handlePayment(citizen.id)}
                          size="sm" 
                          variant="outline"
                          className="border-green-200 hover:bg-green-50 hover:text-green-700 text-slate-700"
                        >
                          <CreditCard className="w-4 h-4 mr-1.5" />
                          Marcar Pagado
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => navigateToPrint(citizen.id)}
                          size="sm"
                          className="bg-[#1e3a8a] text-white hover:bg-[#172554]"
                          disabled={citizen.medicalStatus === 'Pendiente'}
                        >
                          <Printer className="w-4 h-4 mr-1.5" />
                          Emitir Carnet
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCitizens.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    No se encontraron ciudadanos con esos criterios de búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
