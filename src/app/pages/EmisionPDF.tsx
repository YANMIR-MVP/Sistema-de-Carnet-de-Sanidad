import React, { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { ArrowLeft, Printer, Download, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const EmisionPDF = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { citizens, updateCitizen } = useAppContext();
  const [isPrinting, setIsPrinting] = useState(false);
  
  const citizen = citizens.find(c => c.id === id);
  const carnetRef = useRef<HTMLDivElement>(null);

  if (!citizen) {
    return (
      <div className="text-center p-12 bg-white rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Ciudadano no encontrado</h2>
        <Button onClick={() => navigate('/caja')} className="mt-4">
          Volver a Caja
        </Button>
      </div>
    );
  }

  const handlePrint = () => {
    setIsPrinting(true);
    // Simulate generation and update status
    setTimeout(() => {
      updateCitizen(citizen.id, { carnetIssued: true });
      window.print();
      setIsPrinting(false);
    }, 500);
  };

  const currentDate = new Date();
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Actions */}
      <div className="flex items-center justify-between bg-white p-6 rounded-xl shadow-sm border border-slate-200 print:hidden">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/caja')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Caja
          </Button>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Emisión de Carnet</h2>
            <p className="text-sm text-slate-500">Vista previa del documento oficial</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button 
            className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white h-12 px-6 shadow-md shadow-[#0ea5e9]/20"
            onClick={handlePrint}
            disabled={isPrinting || citizen.medicalStatus !== 'Apto'}
          >
            {isPrinting ? (
              <span className="flex items-center">Generando PDF...</span>
            ) : (
              <span className="flex items-center">
                <Printer className="w-5 h-5 mr-2" />
                Imprimir / Generar PDF
              </span>
            )}
          </Button>
        </div>
      </div>

      {citizen.medicalStatus !== 'Apto' && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md print:hidden">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Atención: El ciudadano no tiene estado médico "APTO". No se puede emitir el carnet de sanidad.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Carnet Preview Area */}
      <div className="flex justify-center bg-slate-100 p-8 rounded-xl border border-slate-200 print:p-0 print:bg-white print:border-none">
        
        {/* Carnet Template (Standard ID Card size approx 85.6mm x 53.98mm scaled up for preview) */}
        <div 
          ref={carnetRef}
          className="w-[600px] h-[350px] bg-white rounded-2xl shadow-xl overflow-hidden relative flex print:shadow-none print:w-[323px] print:h-[204px]"
        >
          {/* Left Design Bar */}
          <div className="w-6 bg-[#1e3a8a] h-full absolute left-0 top-0 bottom-0 print:w-3"></div>
          
          {/* Header Strip */}
          <div className="absolute top-0 left-6 right-0 h-16 bg-[#0ea5e9]/10 border-b border-[#0ea5e9]/20 flex items-center px-6 print:h-10 print:px-3 print:left-3">
            <div className="flex-1">
              <h1 className="text-lg font-bold text-[#1e3a8a] leading-tight print:text-[10px]">
                MUNICIPALIDAD DISTRITAL DE EL PORVENIR
              </h1>
              <p className="text-xs text-[#0ea5e9] font-semibold print:text-[6px]">
                CARNET DE SANIDAD Y SALUD PÚBLICA
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="absolute top-16 left-6 right-0 bottom-0 p-6 flex gap-6 print:top-10 print:left-3 print:p-3 print:gap-3">
            
            {/* Photo Column */}
            <div className="flex flex-col items-center gap-4 print:gap-2">
              <div className="w-32 h-40 bg-slate-200 rounded-lg border-2 border-slate-300 overflow-hidden shadow-sm print:w-16 print:h-20">
                {citizen.photoUrl ? (
                  <img src={citizen.photoUrl} alt="Foto" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs text-center p-2 print:text-[6px]">
                    Sin foto
                  </div>
                )}
              </div>
              <div className="w-full text-center">
                <span className="inline-block bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase border border-green-200 print:text-[6px] print:px-1 print:py-0.5">
                  ESTADO: APTO
                </span>
              </div>
            </div>

            {/* Details Column */}
            <div className="flex-1 flex flex-col justify-between py-2 print:py-0">
              <div className="space-y-4 print:space-y-1">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider print:text-[5px]">Apellidos y Nombres</label>
                  <p className="text-xl font-bold text-slate-900 leading-none mt-1 print:text-[10px]">{citizen.name}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 print:gap-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider print:text-[5px]">DNI</label>
                    <p className="text-lg font-mono font-medium text-slate-700 leading-none mt-1 print:text-[9px]">{citizen.dni}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider print:text-[5px]">N° Registro</label>
                    <p className="text-lg font-mono font-medium text-slate-700 leading-none mt-1 print:text-[9px]">
                      {new Date(citizen.createdAt).getFullYear()}-{citizen.id.toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3 mt-2 print:gap-2 print:border-t print:pt-1 print:mt-1">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider print:text-[5px]">Fecha de Emisión</label>
                    <p className="text-sm font-medium text-slate-700 mt-1 print:text-[7px]">
                      {format(currentDate, "dd 'de' MMMM, yyyy", { locale: es })}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider print:text-[5px]">Vencimiento</label>
                    <p className="text-sm font-bold text-red-600 mt-1 print:text-[7px]">
                      {format(expiryDate, "dd 'de' MMMM, yyyy", { locale: es })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column / QR Code */}
            <div className="w-24 flex flex-col items-center justify-end pb-2 print:w-14">
              <div className="w-24 h-24 bg-white border-2 border-slate-200 rounded p-1 shadow-sm flex items-center justify-center print:w-12 print:h-12">
                {/* QR Code Placeholder - Normally we'd use react-qr-code */}
                <div className="w-full h-full border border-dashed border-slate-300 flex flex-col items-center justify-center text-[10px] text-slate-400 text-center print:text-[5px] print:leading-tight">
                  <span className="font-bold">QR</span>
                  <span>Verificar</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 text-center leading-tight print:text-[5px] print:mt-1">
                Firma Autorizada
              </p>
              <div className="w-16 h-px bg-slate-300 mt-6 print:w-10 print:mt-4"></div>
            </div>

          </div>
          
          {/* Watermark Logo Placeholder */}
          <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none transform translate-x-1/4 translate-y-1/4">
             <div className="w-64 h-64 rounded-full border-[16px] border-[#1e3a8a] print:w-32 print:h-32 print:border-[8px]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
