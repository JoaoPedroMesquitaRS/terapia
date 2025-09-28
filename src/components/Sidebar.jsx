// components/Sidebar.jsx
import { Calendar, Users, LogOutIcon, ListOrdered, CircleDollarSign, ListCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {

  const { pathname } = useLocation();

  const menu = [
    { to: '/lista-espera', label: 'Lista de Espera', icon: <ListOrdered size={20} /> },
    { to: '/visao-geral', label: 'Visão Geral', icon: <Calendar size={20} /> },
    { to: '/atendimento-profissional', label: 'Atendimentos', icon: <Users size={20} /> },
    { to: '/faturamento', label: 'Faturamento', icon: <CircleDollarSign size={20} /> },
    { to: '/alta', label: 'Altas', icon: <ListCheck size={20} /> },
  ];

  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-4 shadow-lg fixed left-0 top-0 flex flex-col">
      <div>
        <h2 className="text-2xl font-bold mb-8">Sistema Terapia</h2>
        <nav className="space-y-3">
          {menu.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center space-x-3 p-2 rounded hover:bg-gray-700 transition-colors ${
                pathname === to ? 'bg-gray-700' : ''
              }`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </div>

    </div>
  );
};

export default Sidebar;