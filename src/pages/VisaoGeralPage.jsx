import { useEffect, useState } from 'react';
import axios from 'axios';

export default function TratamentosPorProfissional() {
  const [profissionais, setProfissionais] = useState([]);
  const [tratamentos, setTratamentos] = useState([]);
  const [profissionalSelecionado, setProfissionalSelecionado] = useState('');

  useEffect(() => {
    // Busca os profissionais ao carregar a página
    axios.get('http://localhost:3001/profissionais')
      .then(res => setProfissionais(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (profissionalSelecionado) {
      axios.get(`http://localhost:3001/tratamentos?profissional=${profissionalSelecionado}&situacao=Em%20Tratamento`)
        .then(res => setTratamentos(res.data))
        .catch(err => console.error(err));
    } else {
      setTratamentos([]);
    }
  }, [profissionalSelecionado]);

  const formatarData = (dataISO) =>{
    if(!dataISO) return "";
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}/${mes}/${ano}`;
  } 

  return (
    <div className="max-w-7xl mx-auto p-8 bg-gray-50 min-h-screen">
      
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Visão Geral
      </h1>

      <select
        value={profissionalSelecionado}
        onChange={(e) => setProfissionalSelecionado(e.target.value)}
        className="w-full p-2 border rounded mb-6"
      >
        <option value="">Selecionar um Profissional</option>
        {profissionais.map((profissional) => (
          <option key={profissional.id} value={profissional.id}>
            {profissional.nome}
          </option>
        ))}
      </select>

      {tratamentos.length > 0 ? (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border text-left">Paciente</th>
              <th className="p-2 border">Início</th>
              <th className="p-2 border">Situação</th>
            </tr>
          </thead>
          <tbody>
            {tratamentos.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="p-2 border">{t.paciente?.nome}</td>
                <td className="p-2 border text-center">{formatarData(t.dataInicio)}</td>
                <td className="p-2 border text-center">{t.situacao}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : profissionalSelecionado ? (
        <p className="text-center mt-4 text-gray-500">Nenhum tratamento em andamento para este profissional.</p>
      ) : null}
    </div>
  );
}
