import { useEffect, useState } from "react";
import AdicionarGuia from "../components/adicionarGuia.jsx";

function ListaEsperaPage(){

    const [tratamentos, setTratamentos] = useState([]);
    
    async function fetchPacientes(){
        const response = await fetch('http://localhost:3001/tratamentos/aguardando').then(res => (res.json()));
        setTratamentos(response);
        console.log(response)
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
        console.log(tratamentoSelecionado);
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
            console.log(data)

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


    return(
        <div className="min-h-screen bg-gray-100 p-4">
            <h1 className="text-3xl font-bold text-center text-blue-800 mb-6">
                Lista de Espera
            </h1>

            <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-100">
                    <tr className="text-left">
                        <th className="py-2 px-4 border-b">Paciente</th>
                        <th className="py-2 px-4 border-b">Data Entrada</th>
                        <th className="py-2 px-4 border-b">Indicação</th>
                        <th className="py-2 px-4 border-b">Preferência</th>
                        <th className="py-2 px-4 border-b">Ações</th>
                    </tr>
                </thead>
                <tbody>
                
                    {mostrarFormulario && (
                    <tr className="bg-blue-50">
                        <td className="py-2 px-4 border-b">
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
                        <td className="py-2 px-4 border-b">
                        <input
                            type="date"
                            name="dataEntrada"
                            value={tratamentoDigitado.dataEntrada}
                            onChange={handleChange}
                            className="w-full px-2 py-1 border rounded"
                        />
                        </td>
                        <td className="py-2 px-4 border-b">
                        <input
                            type="text"
                            name="indicacao"
                            value={tratamentoDigitado.indicacao}
                            onChange={handleChange}
                            className="w-full px-2 py-1 border rounded"
                        />
                        </td>

                        <td className="py-2 px-4 border-b">
                        <input
                            type="text"
                            name="preferencia"
                            value={tratamentoDigitado.preferencia}
                            onChange={handleChange}
                            className="w-full px-2 py-1 border rounded"
                        />
                        </td>
                        
                        <td className="py-2 px-4 border-b">
                            <span
                                onClick={async () => {
                                    console.log(tratamentoDigitado);
                                    adicionarCliente();
                                    await fetchPacientes();
                                }}
                            >
                                Adicionar
                            </span>
                        </td>
                    </tr>
                )}
                </tbody>
            </table>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded shadow">
                    <thead>
                        <tr className="bg-blue-100 text-left text-gray-700 uppercase text-sm">
                            <th className="px-4 py-3">Nome</th>
                            <th className="px-4 py-3">Data Entrada</th>
                            <th className="px-4 py-3">Aguardando</th>
                            <th className="px-4 py-3">Indicação</th>
                            <th className="px-4 py-3">Idade</th>
                            <th className="px-4 py-3">Preferência</th>
                            <th className="px-4 py-3">Ações</th>
                        </tr>
                </thead>
                <tbody>
                    {tratamentos.map((tratamento) => (
                        <tr key={tratamento.id} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-2">{tratamento.nome}</td>
                            <td className="px-4 py-2">{tratamento.dataEntrada}</td>
                            <td className="px-4 py-2">{tratamento.aguardando}</td>
                            <td className="px-4 py-2">{tratamento.indicacao}</td>
                            <td className="px-4 py-2">{tratamento.idade}</td>
                            <td className="px-4 py-2">{tratamento.preferencia}</td>
                            <td className="px-4 py-2">
                                <button 
                                    className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 mr-2"
                                    onClick={() => {
                                        setTratamentoSelecionado(tratamento);
                                        abrirModal();
                                    }}    
                                >
                                    Agendar
                                </button>
                                <button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                                    Remover
                                </button>
                            </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>

            {mostrarModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div 
                    className="absolute inset-0 bg-black bg-opacity-50"
                    onClick={fecharModal} // Adicione esta função para fechar ao clicar fora
                ></div>
                
                <div className="relative z-10 bg-white rounded-lg shadow-xl w-full max-w-7xl mx-4">
                    <div className="p-6">
                        <h3 className="text-lg font-bold mb-4">Agendar Avaliação</h3>
                        
                        <form>
                            <div className="mb-4 flex gap-5">
                                <div className="w-full">
                                    <label className="block text-gray-700 mb-2">Paciente:</label>
                                    <label>
                                        {tratamentoSelecionado.nome}
                                    </label>
                                </div>


                                <div className="w-full">
                                    <label className="block text-gray-700 mb-2">Profissional:</label>
                                    <select 
                                        className="w-full px-3 py-2 border border-gray-300 rounded"
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

                            {/* <div className="mb-4 flex gap-2">
                                <label className="block text-gray-700 mb-2">ID TRATAMENTO:</label>
                                <div className="flex gap-2">
                                    {tratamentoSelecionado.id}
                                </div>
                            </div> */}

                            <div className="flex gap-4 justify-between">
                                <div className="mb-4 flex gap-2">
                                    <label className="block text-gray-700 mb-2">Data de Entrada:</label>
                                    <div className="flex gap-2">
                                        {tratamentoSelecionado.dataEntrada}
                                    </div>
                                </div>

                                <div className="mb-4 flex gap-2">
                                    <label className="block text-gray-700 mb-2">Idade:</label>
                                    <div className="flex gap-2">
                                        {tratamentoSelecionado.idade}
                                    </div>
                                </div>

                                <div className="mb-4 flex gap-2">
                                    <label className="block text-gray-700 mb-2">Indicação:</label>
                                    <div className="flex gap-2">
                                        {tratamentoSelecionado.indicacao}
                                    </div>
                                </div>
                            </div>

                            <AdicionarGuia idTratamento={tratamentoSelecionado.id} />
                            
                            {/* <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Observações</label>
                                <textarea 
                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                    rows="3"
                                ></textarea>
                            </div> */}

                            <div className="mb-4 flex gap-2">
                                <label className="block text-gray-700 mb-2">Situação:</label>
                                <select
                                    value={situacao}
                                    onChange={(e) => setSituacao(e.target.value)}
                                >
                                    <option value="">Selecione...</option>
                                    <option value="Em Tratamento">Em Tratamento</option>
                                    <option value="Avaliação">Avaliação</option>
                                    <option value="Desistiu">Desistiu</option>
                                    <option value="Sem Contato">Sem Contato</option>
                                </select>
                                {/* <div className="flex gap-2">
                                    {tratamentoSelecionado.idade}
                                </div> */}
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
                                        const novoTratamento = {
                                            id: tratamentoSelecionado.id,
                                            situacao: situacao,
                                            dataInicio: '2025-07-27',
                                            idProfissional: profissionalSelecionado
                                        };
                                        await agendarAvaliacao(novoTratamento);
                                        console.log(novoTratamento);
                                        fecharModal();
                                        setTratamentoSelecionado('');
                                        setProfissionalSelecionado('');
                                        await fetchPacientes();
                                    }}
                                >
                                    Confirmar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>)}

        </div>
    )
}

export default ListaEsperaPage;