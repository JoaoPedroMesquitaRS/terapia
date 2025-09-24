import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'

// Pages
import ListaEsperaPage from './pages/ListaEsperaPage.jsx'
import VisaoGeral from './pages/VisaoGeralPage.jsx';
import AtendimentoProfissional from './pages/AtendimentoProfissional.jsx'
import ValoresFaturadosPage from './pages/ValoresFaturadosPage.jsx';
import AltaPage from './pages/AltaPage.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    children: [
      { path: '/lista-espera', element: <ListaEsperaPage /> },
      { path: '/visao-geral', element: <VisaoGeral /> },
      { path: '/atendimento-profissional', element: <AtendimentoProfissional /> },
      { path: '/faturamento', element: <ValoresFaturadosPage /> },
      { path: '/alta', element: <AltaPage /> },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)