import { useEffect, useState } from "react";
import { Check, X, CircleAlert } from 'lucide-react';

function Guia({ idTratamento }){

    const [guias, setGuias] = useState([]);
    
    async function fetchGuias() {
        const response = await fetch(`http://localhost:3001/guias/busca/${idTratamento}`).then(res => (res.json()));
        setGuias(response);
        // console.log(response);
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

    /*************************** */

    const [tipoSelecionado, setTipoSelecionado] = useState("");

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
            // console.log(data)

            setResultados(data);
        } catch (error) {
            setResultados([]);
        }
    }

    /****************************************/

    async function registrarAtendimento(guiaAtendida) {
        const response = await fetch(`http://localhost:3001/guias/${guiaAtendida.id}/registrar-atendimento`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({acao: guiaAtendida.acao})
        }).then(res => (res.json()));
    }

    return(
        <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden">
            <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
                <tr className="text-left text-gray-700 text-sm font-semibold">
                <th className="py-3 px-4 border-b w-40">Senha</th>
                <th className="py-3 px-4 border-b w-40">Data Validade</th>
                <th className="py-3 px-4 border-b">Indicação</th>
                <th className="py-3 px-4 border-b">Serviço</th>
                <th className="py-3 px-4 border-b w-16 text-center">Qtd. Aut.</th>
                <th className="py-3 px-4 border-b w-16 text-center">Qtd. Exe.</th>
                <th className="py-3 px-4 border-b w-16 text-center">Just.</th>
                <th className="py-3 px-4 border-b w-16 text-center">Tipo</th>
                <th className="py-3 px-4 border-b w-40 text-center">Ações</th>
                </tr>
            </thead>
            <tbody className="text-sm">
                {mostrarFormulario && (
                <tr className="bg-blue-50 animate-fade-in">
                    {/* SENHA */}
                    <td className="py-2 px-4 border-b">
                    <input
                        type="text"
                        name="senha"
                        value={guiaDigitada.senha}
                        onChange={handleChange}
                        className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
                    />
                    </td>

                    {/* DATA */}
                    <td className="py-2 px-4 border-b">
                    <input
                        type="date"
                        name="validade"
                        value={guiaDigitada.validade}
                        onChange={handleChange}
                        className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
                    />
                    </td>

                    {/* INDICAÇÃO */}
                    <td className="py-2 px-4 border-b">
                    <input
                        type="text"
                        name="indicacao"
                        value={guiaDigitada.indicacao}
                        onChange={handleChange}
                        className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
                    />
                    </td>

                    {/* SERVIÇO COM DROPDOWN */}
                    <td className="py-2 px-4 border-b relative">
                    <input
                        type="text"
                        name="servico"
                        value={busca}
                        onChange={keyPress}
                        className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
                    />
                    {resultados.length > 0 && (
                        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-48 overflow-y-auto shadow-lg">
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

                    {/* QTD AUTORIZADA */}
                    <td className="py-2 px-4 border-b text-center">
                    <input
                        type="text"
                        name="qtdAtendimentoAutorizado"
                        value={guiaDigitada.qtdAtendimentoAutorizado}
                        onChange={handleChange}
                        className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
                    />
                    </td>

                    <td className="py-2 px-4 border-b text-center">-</td>
                    <td className="py-2 px-4 border-b text-center">-</td>

                    {/* SELECT */}
                    <td className="py-2 px-4 border-b text-center">
                    <select
                        value={guiaDigitada.tipo}
                        onChange={(e) =>
                        setGuiaDigitada((prev) => ({ ...prev, tipo: e.target.value }))
                        }
                        className="px-2 py-1 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
                    >
                        <option value="">...</option>
                        <option value="30">30</option>
                        <option value="40">40</option>
                    </select>
                    </td>

                    {/* BOTÃO ADICIONAR */}
                    <td className="py-2 px-4 border-b text-center">
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors"
                        onClick={async () => {
                        const novaGuia = {
                            idTratamento: idTratamento,
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
                    <tr key={guia.id} className="hover:bg-blue-50 transition-colors">
                    <td className="py-2 px-4 border-b">{guia.senha}</td>
                    <td className="py-2 px-4 border-b">{guia.validade}</td>
                    <td className="py-2 px-4 border-b">{guia.indicacao}</td>
                    <td className="py-2 px-4 border-b">{guia.servico?.descricao}</td>
                    <td className="py-2 px-4 border-b text-center">{guia.qtdAtendimentoAutorizado}</td>
                    <td className="py-2 px-4 border-b text-center">{guia.qtdAtendida}</td>
                    <td className="py-2 px-4 border-b text-center">-</td>
                    <td className="py-2 px-4 border-b text-center">{guia.tipo}</td>
                    <td className="py-2 px-4 border-b flex justify-center gap-3">
                        <button
                        className="text-green-600 hover:text-green-800 transition-colors"
                        onClick={async () => {
                            await registrarAtendimento({ id: guia.id, acao: 'Atender' });
                            await fetchGuias();
                        }}
                        >
                        <Check />
                        </button>
                        <button className="text-red-600 hover:text-red-800 transition-colors">
                        <X />
                        </button>
                        <button className="text-yellow-600 hover:text-yellow-800 transition-colors">
                        <CircleAlert />
                        </button>
                    </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default Guia;