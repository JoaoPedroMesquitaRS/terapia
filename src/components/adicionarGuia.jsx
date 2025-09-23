import { useEffect, useState } from "react";

function AdicionarGuia({ idTratamento }){

    const [guias, setGuias] = useState([]);
    
    async function fetchGuias() {
        const response = await fetch(`http://localhost:3001/guias/busca/${idTratamento}`).then(res => (res.json()));
        setGuias(response);
    }
    
    useEffect(() => {
        if (idTratamento) {
            fetchGuias();
        }
    }, [idTratamento]);

    /****************************************/

    const [mostrarFormulario, setMostrarFormulario] = useState(true);
    const [guiaDigitada, setGuiaDigitada] = useState([]);

    async function adicionarGuia(novaGuia) {
        const response = await fetch('http://localhost:3001/guias', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(novaGuia)
        }).then(res => (res.json()));
    };

    async function handleChange(e) {
        const { name, value } = e.target;
        setGuiaDigitada(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const formatarData = (dataISO) => {
      if(!dataISO) return "";
      const [ano, mes, dia] = dataISO.split("-");
      return `${dia}/${mes}/${ano}`
    }

    /*************************** */

    const [busca, setBusca] = useState('');
    const [resultados, setResultados] = useState([]);
    const [selecionado, setSelecionado] = useState(null);

    async function keyPress(e) {
        const { value } = e.target;
        setBusca(value);

        if (value.trim() === '') {
            setResultados([]);
            return;
        }

        try {
            const response = await fetch(`http://localhost:3001/servicos?caracter=${value}`);
            const data = await response.json();
            console.log(data)

            setResultados(data);
        } catch (error) {
            setResultados([]);
        }
    }

    return(
        <table className="min-w-full bg-white border border-gray-200">

    <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
        <tr className="text-left text-gray-700 text-sm font-semibold">
            <th className="py-3 px-4 border-b w-40">Senha</th>
            <th className="py-3 px-4 border-b w-40">Data Validade</th>
            <th className="py-3 px-4 border-b">Indicação</th>
            <th className="py-3 px-4 border-b">Serviço</th>
            <th className="py-3 px-4 border-b w-16 text-center">Qtd. Aut.</th>
            <th className="py-3 px-4 border-b w-16 text-center">Tipo</th>
            <th className="py-3 px-4 border-b w-40 text-center">Ações</th>
        </tr>
    </thead>

  <tbody>
    {mostrarFormulario && (
      <tr className="bg-blue-50">
        <td className="py-2 px-4 border-b">
          <input
            type="text"
            name="senha"
            value={guiaDigitada.senha}
            onChange={handleChange}
            className="w-full px-2 py-1 border rounded"
          />
        </td>

        <td className="py-2 px-4 border-b">
          <input
            type="date"
            name="validade"
            value={guiaDigitada.validade}
            onChange={handleChange}
            className="w-full px-2 py-1 border rounded"
          />
        </td>

        <td className="py-2 px-4 border-b">
          <input
            type="text"
            name="indicacao"
            value={guiaDigitada.indicacao}
            onChange={handleChange}
            className="w-full px-2 py-1 border rounded"
          />
        </td>

        <td className="py-2 px-4 border-b relative">
          <input
            type="text"
            name="servico"
            value={busca}
            onChange={keyPress}
            className="w-full px-2 py-1 border rounded"
          />

          {resultados.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-48 overflow-y-auto">
              {resultados.map((servico) => (
                <li
                  key={servico.id}
                  onClick={() => {
                    setSelecionado(servico);
                    setBusca(servico.descricao);
                    setResultados([]);
                  }}
                  className="px-2 py-1 hover:bg-blue-100 cursor-pointer"
                >
                  {servico.descricao}
                </li>
              ))}
            </ul>
          )}
        </td>

        <td className="py-2 px-4 border-b w-1/12">
          <input
            type="text"
            name="qtdAtendimentoAutorizado"
            value={guiaDigitada.qtdAtendimentoAutorizado}
            onChange={handleChange}
            className="w-full px-2 py-1 border rounded"
          />
        </td>

        <td className="py-2 px-4 border-b w-1/12">
          <select
            value={guiaDigitada.tipo}
            onChange={(e) =>
              setGuiaDigitada((prev) => ({
                ...prev,
                tipo: e.target.value
              }))
            }
            className="w-full px-2 py-1 border rounded"
          >
            <option value="">...</option>
            <option value="80">80</option>
            <option value="60">60</option>
          </select>
        </td>

        <td className="py-2 px-4 border-b text-center">
          <button
          type="button"
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors"
            onClick={async () => {
              const novaGuia = {
                idTratamento,
                senha: guiaDigitada.senha,
                indicacao: guiaDigitada.indicacao,
                validade: guiaDigitada.validade,
                idServico: selecionado.id,
                qtdAtendimentoAutorizado: guiaDigitada.qtdAtendimentoAutorizado,
                tipo: guiaDigitada.tipo,
                situacao: 'Iniciada'
              };
              await adicionarGuia(novaGuia);
              setGuiaDigitada({});
              await fetchGuias();
            }}
          >
            Adicionar
          </button>
        </td>
      </tr>
    )}

    {Array.isArray(guias) &&
      guias.length > 0 &&
      guias.map((guia) => (
        <tr key={guia.id} className="bg-blue-50">
          <td className="py-2 px-4 border-b">{guia.senha}</td>
          <td className="py-2 px-4 border-b text-center">{formatarData(guia.validade)}</td>
          <td className="py-2 px-4 border-b">{guia.indicacao}</td>
          <td className="py-2 px-4 border-b">{guia.servico?.descricao}</td>
          <td className="py-2 px-4 border-b text-center">{guia.qtdAtendimentoAutorizado}</td>
          <td className="py-2 px-4 border-b text-center">{guia.tipo}</td>
        </tr>
      ))}
  </tbody>
</table>

    )
}

export default AdicionarGuia;