import { useEffect, useState } from "react";
import AdicionarGuia from "../components/adicionarGuia.jsx";
import { Trash, Plus, Calendar } from 'lucide-react';

function ListaEsperaPage(){

    const [tratamentos, setTratamentos] = useState([]);
    
    async function fetchPacientes(){
        const response = await fetch('http://localhost:3001/tratamentos/aguardando').then(res => (res.json()));
        setTratamentos(response);
    };

    useEffect(() => {
        fetchPacientes();
    }, []);

    /********** PROFISSIONAL **********/

    const [profissionais, setProfissionais] = useState([]);

    useEffect(() => {
        async function fetchProfissionais() {
            const response = await fetch('http://localhost:3001/profissionais').then(res =>(res.json()));
            setProfissionais(response);
        }

        fetchProfissionais();

    }, [])

    /********** MODAL **********/
    const [mostrarModal, setMostrarModal] = useState(false);
    const abrirModal = () => setMostrarModal(true);
    const fecharModal = () => setMostrarModal(false);

    /*******************************/
    const [tratamentoSelecionado, setTratamentoSelecionado] = useState([]);

    useEffect(() => {
    }, [tratamentoSelecionado])

    /************************************/

    const [tratamentoDigitado, setTratamentoDigitado] = useState({
        dataEntrada: "", indicacao: "", preferencia: "", situacao: "Aguardando"
    });

    async function adicionarCliente() {
        const response = await fetch('http://localhost:3001/tratamentos', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                idPaciente: selecionado.id, dataEntrada: tratamentoDigitado.dataEntrada, indicacao: tratamentoDigitado.indicacao, preferencia: tratamentoDigitado.preferencia, situacao: tratamentoDigitado.situacao
            })
        })
    }
    /************************************/

    const [mostrarFormulario, setMostrarFormulario] = useState(true);
    const abrirFormulario = () => setMostrarFormulario(true);
    const fecharFormulario = () => setMostrarFormulario(false);

    /***********************************/

    async function handleChange(e) {
        const { name, value } = e.target;
        setTratamentoDigitado(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const formatarData = (dataISO) => {
        if(!dataISO) return "";
        const [ano, mes, dia] = dataISO.split("-");
        return `${dia}/${mes}/${ano}`;
    };

    /*************************************/
    
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
            const response = await fetch(`http://localhost:3001/pacientes/busca?caracter=${value}`);
            const data = await response.json();

            setResultados(data);
        } catch (error) {
            setResultados([]);
        }
    }

    /***************** AVALIAÇÃO *****************/

    const [profissionalSelecionado, setProfissionalSelecionado] = useState(null);
    const [situacao, setSituacao] = useState(null);

    async function agendarAvaliacao(novoTratamento) {
        const response = await fetch(`http://localhost:3001/tratamentos/avaliacao/${novoTratamento.id}`,{
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(novoTratamento)
        }).then(res => res.json());
    }

    /*************************************/

    async function excluirItem(tratamentoId){
        const response = await fetch(`http://localhost:3001/tratamentos/${tratamentoId}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json'
            },
        }).then(res => (res.json()));

        setTratamentos(prev =>
            prev.filter(t => t.id !== tratamentoId)
        );
    }

    const hoje = new Date();

    return(
        <div className="max-w-7xl mx-auto p-8 bg-gray-50 min-h-screen">
            
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
                Aguardando
            </h1>

            {/* Formulário de adição na lista */}
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead className="max-w-7xl mx-auto p-8 bg-gray-800 min-h-screen text-white">
                    <tr className="text-left">
                        <th className="py-2 w-60 px-4 border-b">Paciente</th>
                        <th className="py-2 px-4 border-b">Data Entrada</th>
                        <th className="py-2 px-4 border-b">Indicação</th>
                        <th className="py-2 px-4 border-b">Preferência</th>
                        <th className="py-2 px-4 border-b">Ações</th>
                    </tr>
                </thead>
                <tbody>
                {mostrarFormulario && (
                    <tr className="bg-blue-50">
                    {/* Campo paciente com busca */}
                    <td className="py-2 px-4 border-b absolute">
                        <input
                        type="text"
                        value={busca}
                        onChange={keyPress}
                        className="w-full px-2 py-1 border rounded"
                        placeholder="Buscar paciente pelo nome"
                        />

                        {resultados.length > 0 && (
                        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-48 overflow-y-auto">
                            {resultados.map((paciente) => (
                            <li
                                key={paciente.id}
                                onClick={() => {
                                    setSelecionado(paciente);
                                    setBusca(paciente.nome);
                                    setResultados([]);
                                }}
                                className="px-2 py-1 hover:bg-blue-100 cursor-pointer"
                            >
                                {paciente.nome}
                            </li>
                            ))}
                        </ul>
                        )}
                    </td>

                    {/* Data entrada */}
                    <td className="py-2 px-4 border-b">
                        <input
                        type="date"
                        name="dataEntrada"
                        value={tratamentoDigitado.dataEntrada}
                        onChange={handleChange}
                        className="w-full px-2 py-1 border rounded"
                        />
                    </td>

                    {/* Indicação */}
                    <td className="py-2 px-4 border-b">
                        <input
                        type="text"
                        name="indicacao"
                        value={tratamentoDigitado.indicacao}
                        onChange={handleChange}
                        className="w-full px-2 py-1 border rounded"
                        />
                    </td>

                    {/* Preferência */}
                    <td className="py-2 px-4 border-b">
                        <input
                        type="text"
                        name="preferencia"
                        value={tratamentoDigitado.preferencia}
                        onChange={handleChange}
                        className="w-full px-2 py-1 border rounded"
                        />
                    </td>

                    {/* Botão adicionar */}
                    <td className="py-2 px-4 border-b">
                        <button
                            onClick={async () => {
                                adicionarCliente();
                                await fetchPacientes();
                                setResultados([]);
                                setTratamentoDigitado({
                                    dataEntrada: "", indicacao: "", preferencia: "", situacao: "Aguardando"
                                });
                                setBusca('');
                            }}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                            <Plus />
                        </button>
                    </td>
                    </tr>
                )}
                </tbody>
            </table>

            {/* Lista de pacientes aguardando */}
            <div className="overflow-x-auto mt-6">
                <table className="min-w-full bg-white rounded-t-lg overflow-hidden">
                    <thead className="max-w-7xl mx-auto p-8 bg-gray-800 min-h-screen text-white">
                        <tr className="text-left">
                            <th className="px-4 py-3">Nome</th>
                            <th className="px-4 py-3">Data Entrada</th>
                            {/* <th className="px-4 py-3">Dias</th> */}
                            <th className="px-4 py-3">Indicação</th>
                            <th className="px-4 py-3">Idade</th>
                            <th className="px-4 py-3">Preferência</th>
                            <th className="px-4 py-3">Ações</th>
                        </tr>
                </thead>
                <tbody>
                    {tratamentos.map((tratamento) => (
                    <tr
                        key={tratamento.id}
                        className="border-b hover:bg-gray-50"
                    >
                        <td className="px-4 py-2">{tratamento.nome}</td>
                        <td className="px-4 py-2">{formatarData(tratamento.dataEntrada)}</td>
                        {/* <td className="px-4 py-2">{tratamento.aguardando}</td> */}
                        <td className="px-4 py-2">{tratamento.indicacao}</td>
                        <td className="px-4 py-2">{tratamento.idade}</td>
                        <td className="px-4 py-2">{tratamento.preferencia}</td>
                        <td className="px-4 py-2 flex gap-2">
                        <button
                            className="text-green-500 hover:text-green-600 transition-colors"
                            onClick={() => {
                            setTratamentoSelecionado(tratamento);
                            abrirModal();
                            }}
                        >
                            <Calendar />
                        </button>
                        <button
                            className="text-red-600 hover:text-red-800 transition-colors"
                            onClick={() => {
                                excluirItem(tratamento.id);
                            }}
                        >
                            <Trash />
                        </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>

            {/* Modal de agendamento */}
            {mostrarModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Fundo escuro */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={ () => {
                            fecharModal();
                            setSituacao('');
                        }}
                    ></div>

                    {/* Conteúdo do modal */}
                    <div className="relative z-10 bg-white rounded-xl shadow-2xl w-full max-w-7xl mx-4 overflow-hidden">
                            <div className="border-b px-6 py-4 bg-gray-50">
                                <h3 className="text-xl font-semibold text-gray-800">Agendar Avaliação</h3>
                            </div>

                        <div className="p-6">
                            <form className="space-y-6">
                            <div className="mb-4 flex gap-5">
                            <div className="w-full">
                                <label className="block text-gray-700 mb-2 font-medium">Paciente:</label>
                                <span className="block px-3 py-2 bg-gray-50 border border-gray-200 rounded">
                                {tratamentoSelecionado.nome}
                                </span>
                            </div>

                            <div className="w-full">
                                <label className="block text-gray-700 mb-2 font-medium">Profissional:</label>
                                <select
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={profissionalSelecionado}
                                onChange={(e) => setProfissionalSelecionado(e.target.value)}
                                >
                                <option value="">Selecione...</option>
                                {profissionais.map((profissional) => (
                                    <option key={profissional.id} value={profissional.id}>
                                    {profissional.nome}
                                    </option>
                                ))}
                                </select>
                            </div>
                            </div>

                            {/* Infos adicionais */}
                            <div className="mb-4 grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-gray-700 mb-2 font-medium">Data de Entrada:</label>
                                <span className="block px-3 py-2 bg-gray-50 border border-gray-200 rounded">
                                {formatarData(tratamentoSelecionado.dataEntrada)}
                                </span>
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2 font-medium">Idade:</label>
                                <span className="block px-3 py-2 bg-gray-50 border border-gray-200 rounded">
                                {tratamentoSelecionado.idade}
                                </span>
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2 font-medium">Indicação:</label>
                                <span className="block px-3 py-2 bg-gray-50 border border-gray-200 rounded">
                                {tratamentoSelecionado.indicacao}
                                </span>
                            </div>
                            </div>

                            {/* Componente de guia */}
                            <AdicionarGuia idTratamento={tratamentoSelecionado.id} />

                            {/* Situação */}
                            <div className="mb-6">
                            <label className="block text-gray-700 mb-2 font-medium">Situação:</label>
                            <select
                                value={situacao}
                                onChange={(e) => setSituacao(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Selecione...</option>
                                <option value="Em Tratamento">Em Tratamento</option>
                                <option value="Avaliação">Avaliação</option>
                                <option value="Desistiu">Desistiu</option>
                                <option value="Sem Contato">Sem Contato</option>
                            </select>
                            </div>

                            {/* Botões */}
                            <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={ () => { 
                                    fecharModal();
                                    setSituacao('');
                                }}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                onClick={async () => {
                                    const novoTratamento = {
                                        id: tratamentoSelecionado.id,
                                        situacao,
                                        dataInicio: hoje,
                                        idProfissional: profissionalSelecionado,
                                    };
                                    await agendarAvaliacao(novoTratamento);
                                    fecharModal();
                                    setTratamentoSelecionado('');
                                    setProfissionalSelecionado('');
                                    await fetchPacientes();
                                    setSituacao('');
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
        </div>
    )
}

export default ListaEsperaPage;