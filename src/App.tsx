/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/views/Dashboard';
import { Analytics } from './components/views/Analytics';
import { CreateEmployee } from './components/views/CreateEmployee';
import { Settings } from './components/views/Settings';
import { Premium } from './components/views/Premium';
import { EmployeeInteraction } from './components/views/EmployeeInteraction';
import { Employee, ViewState } from './types';
import { INITIAL_EMPLOYEES } from './constants';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const handleSelectEmployee = (emp: Employee) => {
    setSelectedEmployee(emp);
    setCurrentView('interaction');
  };

  return (
    <div className="flex h-screen w-full bg-[#050505] text-[#E4E3E0] font-sans overflow-hidden">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} employeeCount={employees.length} />
      <main className="flex-1 overflow-y-auto relative bg-[#0a0a0a] border-l border-white/5">
        {currentView === 'dashboard' && <Dashboard employees={employees} onSelect={handleSelectEmployee} />}
        {currentView === 'analytics' && <Analytics employees={employees} />}
        {currentView === 'create' && <CreateEmployee onAdd={(emp) => { setEmployees([...employees, emp]); setCurrentView('dashboard'); }} />}
        {currentView === 'settings' && <Settings />}
        {currentView === 'premium' && <Premium />}
        {currentView === 'interaction' && selectedEmployee && <EmployeeInteraction employee={selectedEmployee} onBack={() => setCurrentView('dashboard')} />}
      </main>
    </div>
  );
}
