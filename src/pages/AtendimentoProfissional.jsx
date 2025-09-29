import { useEffect, useState } from "react";
import Guia from "../components/guia.jsx";

export default function ProfissionalAtendimentosPage() {
    const [profissionais, setProfissionais] = useState([]);
    const [profissionalSelecionado, setProfissionalSelecionado] = useState("");
    const [aguardandoAvaliacao, setAguardandoAvaliacao] = useState([]);
    const [emTratamento, setEmTratamento] = useState([]);
    const [ dataFinal, setDataFinal ] = useState([]);

    useEffect(() => {
        
        fetch("http://localhost:3001/profissionais")
            .then((res) => res.json())
            .then(setProfissionais);
    }, []);

    async function fetchTratamentos() {
        if (profissionalSelecionado) {
            // Buscar atendimentos filtrados pelo profissional
            fetch(`http://localhost:3001/tratamentos/${profissionalSelecionado}`)
            .then((res) => res.json())
            .then((dados) => {
                // Supondo que a API retorna { aguardandoAvaliacao: [], emTratamento: [] }
                const aguardando = dados.filter(item => item.situacao === 'Avaliação');
                const emTratamento = dados.filter(item => item.situacao === 'Em Tratamento');
                
                setAguardandoAvaliacao(aguardando);
                setEmTratamento(emTratamento);
            });
        }            
    }

    useEffect(() => {
        fetchTratamentos();
    }, [profissionalSelecionado]);
    
    /********** MODAL **********/
    const [mostrarModal, setMostrarModal] = useState(false);
    const abrirModal = () => setMostrarModal(true);
    const fecharModal = () => setMostrarModal(false);

    const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
    const abrirModalEditar = () => setMostrarModalEditar(true);
    const fecharModalEditar = () => setMostrarModalEditar(false);

    /**************************************/

    const [situacao, setSituacao] = useState(null);

    const [tratamentoSelecionado, setTratamentoSelecionado] = useState([]);

    async function finalizarAvaliacao(novoTratamento) {
        const response = await fetch(`http://localhost:3001/tratamentos/avaliacao/${novoTratamento.id}`,{
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(novoTratamento)
        }).then(res => res.json());

    }

    const formatarData = (dataISO) => {
        if(!dataISO) return "";
        const [ano, mes, dia] = dataISO.split("-");
        return `${dia}/${mes}/${ano}`;
    }

    /********** ALTERAR SITUACAO **********/

    async function alterarSituacao(tratamentoId, dataFinal) {
        const response = await fetch(`http://localhost:3001/tratamentos/situacao/${tratamentoId}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({situacao: 'Alta', dataFinal})
        }).then(res => res.json())
    }

    return (
        <div className="max-w-7xl mx-auto p-8 bg-gray-50 min-h-screen">
            
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
                Atendimentos por Profissional
            </h1>

            <label className="block mb-6">
                <span className="text-gray-700 font-medium">Selecione o Profissional</span>
                <select
                    className="block mt-1 p-2 border border-gray-300 rounded w-full shadow-sm"
                    value={profissionalSelecionado}
                    onChange={(e) => setProfissionalSelecionado(e.target.value)}
                >
                    <option value="">-- Selecione --</option>
                    {profissionais.map((prof) => (
                        <option key={prof.id} value={prof.id}>
                            {prof.nome}
                        </option>
                    ))}
                </select>
            </label>

            {profissionalSelecionado && (
                <>
                    <section className="mt-10">
                        <h2 className="text-2xl font-medium text-blue-700 mb-4 text-center">
                            Avaliações Agendadas
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
                            <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                                <tr className="text-center text-sm font-semibold">
                                <th className="px-6 py-3">Paciente</th>
                                <th className="px-6 py-3">Idade</th>
                                <th className="px-6 py-3">Data Entrada</th>
                                <th className="px-6 py-3">Indicação</th>
                                <th className="px-6 py-3">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {aguardandoAvaliacao.map((tratamento, idx) => (
                                <tr
                                    key={tratamento.id}
                                    className={`text-center text-sm ${
                                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                                    } hover:bg-gray-100 transition-colors`}
                                >
                                    <td className="px-6 py-3 border-t">{tratamento.paciente.nome}</td>
                                    <td className="px-6 py-3 border-t">{tratamento.idade}</td>
                                    <td className="px-6 py-3 border-t">
                                    {formatarData(tratamento.dataEntrada)}
                                    </td>
                                    <td className="px-6 py-3 border-t">{tratamento.indicacao}</td>
                                    <td className="px-6 py-3 border-t">
                                    <button
                                        className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition-colors"
                                        onClick={() => {
                                        setTratamentoSelecionado(tratamento);
                                        abrirModal();
                                        }}
                                    >
                                        Iniciar Avaliação
                                    </button>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                            </table>
                        </div>
                    </section>

                    {mostrarModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center">
                            <div
                                className="absolute inset-0 bg-black bg-opacity-50"
                                onClick={fecharModal}
                            ></div>

                            <div className="relative z-10 bg-white rounded-lg shadow-xl w-full max-w-7xl mx-4">
                                <div className="p-6">
                                    <h3 className="text-lg font-bold mb-4">Iniciar Avaliação</h3>

                                    <form>
                                        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                            <div>
                                                <label className="block text-gray-700 font-medium mb-1">Paciente</label>
                                                <p>{tratamentoSelecionado.paciente.nome}</p>
                                            </div>

                                            <div>
                                                <label className="block text-gray-700 font-medium mb-1">Indicação</label>
                                                <p>{tratamentoSelecionado.indicacao}</p>
                                            </div>

                                            <div>
                                                <label className="block text-gray-700 font-medium mb-1">Data de Entrada</label>
                                                <p>{formatarData(tratamentoSelecionado.dataEntrada)}</p>
                                            </div>

                                            <div>
                                                <label className="block text-gray-700 font-medium mb-1">Idade</label>
                                                <p>{tratamentoSelecionado.idade}</p>
                                            </div>

                                            <div>
                                                <label className="block text-gray-700 font-medium mb-1">Data Início</label>
                                                <p>{formatarData(tratamentoSelecionado.dataInicio)}</p>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-medium mb-1">Situação</label>
                                            <select
                                                value={situacao}
                                                onChange={(e) => setSituacao(e.target.value)}
                                                className="border border-gray-300 rounded px-2 py-1 w-full"
                                            >
                                                <option value="">Selecione...</option>
                                                <option value="Em Tratamento">Em Tratamento</option>
                                                <option value="Avaliação">Avaliação</option>
                                                <option value="Desistiu">Desistiu</option>
                                                <option value="Alta">Alta</option>
                                            </select>
                                        </div>

                                        <div className="flex justify-end gap-3">
                                            <button
                                                type="button"
                                                onClick={fecharModal}
                                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                type="button"
                                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                                onClick={async () => {
                                                    const finalizarAvalicao = {
                                                        id: tratamentoSelecionado.id,
                                                        situacao: situacao
                                                    };
                                                    await finalizarAvaliacao(finalizarAvalicao);
                                                    fecharModal();
                                                    setTratamentoSelecionado('');
                                                    await fetchTratamentos();
                                                }}
                                            >
                                                Confirmar
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}

                    <section className="mt-16">
                        <h2 className="text-2xl font-medium text-green-700 mb-4 text-center">
                            Em Tratamento
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
                            <thead className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                                <tr className="text-center text-sm font-semibold">
                                <th className="px-6 py-3">Paciente</th>
                                <th className="px-6 py-3">Idade</th>
                                <th className="px-6 py-3">Data Início</th>
                                <th className="px-6 py-3">Indicação</th>
                                <th className="px-6 py-3">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {emTratamento.map((tratamento, idx) => (
                                <tr
                                    key={tratamento.id}
                                    className={`text-center text-sm ${
                                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                                    } hover:bg-gray-100 transition-colors`}
                                >
                                    <td className="px-6 py-3 border-t">{tratamento.paciente.nome}</td>
                                    <td className="px-6 py-3 border-t">{tratamento.idade}</td>
                                    <td className="px-6 py-3 border-t">
                                    {formatarData(tratamento.dataInicio)}
                                    </td>
                                    <td className="px-6 py-3 border-t">{tratamento.indicacao}</td>
                                    <td className="px-6 py-3 border-t">
                                    <button
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition-colors"
                                        onClick={() => {
                                        setTratamentoSelecionado(tratamento);
                                        abrirModalEditar();
                                        }}
                                    >
                                        Editar
                                    </button>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                            </table>
                        </div>
                    </section>
                    
                    {mostrarModalEditar && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        {/* Fundo escurecido */}
                        <div
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={fecharModalEditar}
                        ></div>

                        {/* Conteúdo do modal */}
                        <div className="relative z-10 bg-white rounded-xl shadow-2xl w-full max-w-7xl mx-4 overflow-hidden">
                            <div className="border-b px-6 py-4 bg-gray-50">
                                <h3 className="text-xl font-semibold text-gray-800">Atendimento</h3>
                            </div>

                            <div className="p-6">
                            <form className="space-y-6">
                                {/* Dados do paciente */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
                                <div>
                                    <label className="block text-gray-600 text-sm font-medium mb-1">
                                    Paciente
                                    </label>
                                    <p className="text-gray-900">
                                        {tratamentoSelecionado?.paciente?.nome || "Paciente não informado"}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-gray-600 text-sm font-medium mb-1">
                                    Indicação
                                    </label>
                                    <p className="text-gray-900">{tratamentoSelecionado.indicacao}</p>
                                </div>

                                <div>
                                    <label className="block text-gray-600 text-sm font-medium mb-1">
                                    Data de Entrada
                                    </label>
                                    <p className="text-gray-900">{formatarData(tratamentoSelecionado.dataEntrada)}</p>
                                </div>

                                <div>
                                    <label className="block text-gray-600 text-sm font-medium mb-1">
                                    Idade
                                    </label>
                                    <p className="text-gray-900">{tratamentoSelecionado.idade}</p>
                                </div>

                                <div>
                                    <label className="block text-gray-600 text-sm font-medium mb-1">
                                    Data Início
                                    </label>
                                    <p>{formatarData(tratamentoSelecionado.dataInicio)}</p>
                                </div>
                                </div>

                                {/* Guia */}
                                <Guia idTratamento={tratamentoSelecionado.id} />

                                {/* Situação */}
                                <div>
                                    <label className="block text-gray-600 text-sm font-medium mb-1">
                                        Situação
                                    </label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-500"
                                        value={situacao}
                                        onChange={(e) => setSituacao(e.target.value)}
                                    >
                                        <option value={tratamentoSelecionado.situacao}>{tratamentoSelecionado.situacao}</option>
                                        <option value="Em Tratamento">Em Tratamento</option>
                                        <option value="Avaliação">Avaliação</option>
                                        <option value="Desistiu">Desistiu</option>
                                        <option value="Alta">Alta</option>
                                    </select>

                                    {situacao === 'Alta' && (
                                        <div>
                                            <label>Data Alta:</label>
                                            <input 
                                                type="date" 
                                                name="dataFinal"
                                                value={dataFinal}
                                                onChange={(e) => setDataFinal(e.target.value)}
                                               className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
                                            />
                                        </div>
                                    )}

                                </div>

                                {/* Botões */}
                                <div className="flex justify-end gap-3 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={fecharModalEditar}
                                    className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow"
                                    onClick={async () => {
                                        if(situacao === 'Alta'){
                                            await alterarSituacao(tratamentoSelecionado.id, dataFinal);
                                        }
                                        fecharModalEditar();
                                        setTratamentoSelecionado('');
                                        setSituacao('');
                                        await fetchTratamentos();
                                    }}
                                >
                                    Confirmar
                                </button>
                                </div>
                            </form>
                            </div>
                        </div>
                        </div>

                )}

                </>
            )}
        </div>
    );
}