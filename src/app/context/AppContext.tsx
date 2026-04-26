import React, { createContext, useContext, useState, ReactNode } from 'react';

export type PaymentStatus = 'Pendiente' | 'Pagado';
export type MedicalStatus = 'Pendiente' | 'Apto' | 'No Apto';

export interface Citizen {
  id: string;
  name: string;
  dni: string;
  paymentStatus: PaymentStatus;
  medicalStatus: MedicalStatus;
  carnetIssued: boolean;
  photoUrl?: string;
  createdAt: string;
}

export type Role = 'Caja' | 'Medico' | null;

interface AppContextType {
  userRole: Role;
  citizens: Citizen[];
  setUserRole: (role: Role) => void;
  addCitizen: (citizen: Omit<Citizen, 'id' | 'createdAt'>) => void;
  updateCitizen: (id: string, updates: Partial<Citizen>) => void;
  logout: () => void;
}

const defaultContext: AppContextType = {
  userRole: null,
  citizens: [],
  setUserRole: () => {},
  addCitizen: () => {},
  updateCitizen: () => {},
  logout: () => {},
};

const AppContext = createContext<AppContextType>(defaultContext);

const initialCitizens: Citizen[] = [
  {
    id: '1',
    name: 'Juan Perez',
    dni: '71234567',
    paymentStatus: 'Pagado',
    medicalStatus: 'Pendiente',
    carnetIssued: false,
    photoUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Maria Garcia',
    dni: '43987654',
    paymentStatus: 'Pendiente',
    medicalStatus: 'Pendiente',
    carnetIssued: false,
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    name: 'Carlos Sanchez',
    dni: '10928374',
    paymentStatus: 'Pagado',
    medicalStatus: 'Apto',
    carnetIssued: false,
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: '4',
    name: 'Laura Torres',
    dni: '87654321',
    paymentStatus: 'Pagado',
    medicalStatus: 'No Apto',
    carnetIssued: false,
    photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  }
];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [userRole, setUserRole] = useState<Role>(null);
  const [citizens, setCitizens] = useState<Citizen[]>(initialCitizens);

  const addCitizen = (citizenData: Omit<Citizen, 'id' | 'createdAt'>) => {
    const newCitizen: Citizen = {
      ...citizenData,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      // Add a random generic placeholder photo for demo
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80'
    };
    setCitizens(prev => [newCitizen, ...prev]);
  };

  const updateCitizen = (id: string, updates: Partial<Citizen>) => {
    setCitizens(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const logout = () => {
    setUserRole(null);
  };

  return (
    <AppContext.Provider value={{ userRole, citizens, setUserRole, addCitizen, updateCitizen, logout }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
