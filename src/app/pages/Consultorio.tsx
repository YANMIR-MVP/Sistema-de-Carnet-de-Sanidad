import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { User, Activity, AlertCircle, CheckCircle } from 'lucide-react';

export const Consultorio = () => {
  const { citizens, updateCitizen } = useAppContext();
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  // Show only patients who have paid and are pending medical evaluation
  const queue = citizens.filter(c => c.paymentStatus === 'Pagado' && c.medicalStatus === 'Pendiente');
  // Also show recently evaluated for demo purposes
  const recentlyEvaluated = citizens.filter(c => c.paymentStatus === 'Pagado' && c.medicalStatus !== 'Pendiente').slice(0, 5);

  const selectedPatient = citizens.find(c => c.id === selectedPatientId);

  const handleEvaluation = (status: 'Apto' | 'No Apto') => {
    if (selectedPatientId) {
      updateCitizen(selectedPatientId, { medicalStatus: status });
      setSelectedPatientId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
      
      {/* Sidebar: Cola de Pacientes */}
      <div className="lg:col-span-4 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden h-fit">
        <div className="bg-slate-50 border-b border-slate-200 p-5">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#0ea5e9]" />
            Pacientes en Espera
          </h2>
          <p className="text-sm text-slate-500 mt-1">Ciudadanos con pago verificado</p>
        </div>
        
        <div className="divide-y divide-slate-100 overflow-y-auto max-h-[600px]">
          {queue.length === 0 ? (
            <div className="p-8 text-center text-slate-500 flex flex-col items-center justify-center">
              <CheckCircle className="w-12 h-12 text-slate-200 mb-3" />
              <p>No hay pacientes en cola de espera.</p>
            </div>
          ) : (
            queue.map(patient => (
              <div 
                key={patient.id} 
                className={`p-4 cursor-pointer transition-colors ${selectedPatientId === patient.id ? 'bg-[#0ea5e9]/10 border-l-4 border-[#0ea5e9]' : 'hover:bg-slate-50 border-l-4 border-transparent'}`}
                onClick={() => setSelectedPatientId(patient.id)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">{patient.name}</h3>
                    <p className="text-sm text-slate-500 font-mono mt-0.5">DNI: {patient.dni}</p>
                  </div>
                  <Badge variant="warning">Esperando</Badge>
                </div>
              </div>
            ))
          )}
        </div>
        
        {recentlyEvaluated.length > 0 && (
          <div className="mt-auto border-t border-slate-200">
            <div className="bg-slate-50 p-3">
              <h3 className="text-xs font-semibold uppercase text-slate-500">Evaluados Recientemente</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {recentlyEvaluated.map(patient => (
                <div key={patient.id} className="p-3 opacity-60 flex justify-between items-center">
                  <div>
                    <span className="text-sm font-medium">{patient.name}</span>
                  </div>
                  <Badge variant={patient.medicalStatus === 'Apto' ? 'success' : 'destructive'}>
                    {patient.medicalStatus}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Area: Evaluación */}
      <div className="lg:col-span-8">
        {selectedPatient ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-[#1e3a8a] text-white p-6 border-b border-blue-900">
              <h2 className="text-xl font-bold">Evaluación Médica</h2>
              <p className="text-blue-200 mt-1 text-sm">Registro de aptitud para carnet de sanidad</p>
            </div>
            
            <div className="p-8">
              <div className="flex items-center gap-6 mb-10 pb-8 border-b border-slate-100">
                <div className="w-20 h-20 rounded-full bg-slate-100 border-4 border-white shadow-md overflow-hidden flex items-center justify-center text-slate-400">
                  {selectedPatient.photoUrl ? (
                    <img src={selectedPatient.photoUrl} alt="Foto" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10" />
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">{selectedPatient.name}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-slate-600 font-mono bg-slate-100 px-2 py-1 rounded text-sm">
                      DNI: {selectedPatient.dni}
                    </span>
                    <Badge variant="success">PAGO VERIFICADO</Badge>
                  </div>
                </div>
              </div>

              <h4 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-slate-400" />
                Veredicto Médico
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  type="button"
                  onClick={() => handleEvaluation('Apto')}
                  className="relative flex flex-col items-center justify-center p-8 bg-green-50 border-2 border-green-200 rounded-xl hover:bg-green-100 hover:border-green-400 transition-all group focus:outline-none focus:ring-4 focus:ring-green-500/20 h-48"
                >
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <span className="text-2xl font-bold text-green-700 uppercase tracking-wide">APTO</span>
                  <p className="text-green-600/80 text-sm mt-2 text-center">Cumple requisitos de sanidad</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleEvaluation('No Apto')}
                  className="relative flex flex-col items-center justify-center p-8 bg-red-50 border-2 border-red-200 rounded-xl hover:bg-red-100 hover:border-red-400 transition-all group focus:outline-none focus:ring-4 focus:ring-red-500/20 h-48"
                >
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <span className="text-2xl font-bold text-red-700 uppercase tracking-wide">NO APTO</span>
                  <p className="text-red-600/80 text-sm mt-2 text-center">Requiere tratamiento previo</p>
                </button>
              </div>
              
              <div className="mt-8 flex justify-end">
                <Button variant="outline" onClick={() => setSelectedPatientId(null)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full min-h-[500px] flex flex-col items-center justify-center text-slate-400 p-8 text-center">
            <User className="w-20 h-20 text-slate-200 mb-6" />
            <h3 className="text-xl font-medium text-slate-600 mb-2">Ningún Paciente Seleccionado</h3>
            <p className="max-w-sm">Seleccione un paciente de la cola en el panel izquierdo para realizar la evaluación médica.</p>
          </div>
        )}
      </div>
    </div>
  );
};
