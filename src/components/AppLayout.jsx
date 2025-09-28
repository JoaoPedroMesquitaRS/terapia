// components/AppLayout.jsx
import Sidebar from './Sidebar.jsx';
import { Outlet } from 'react-router-dom';

const AppLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 flex-1 bg-gray-100 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;