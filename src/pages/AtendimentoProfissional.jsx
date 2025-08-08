import { useEffect, useState } from "react";
import Guia from "../components/guia.jsx";

export default function ProfissionalAtendimentosPage() {
    const [profissionais, setProfissionais] = useState([]);
    const [profissionalSelecionado, setProfissionalSelecionado] = useState("");
    const [aguardandoAvaliacao, setAguardandoAvaliacao] = useState([]);
    const [emTratamento, setEmTratamento] = useState([]);

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
                
                console.log(dados);
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
    const [dataInicio, setDataInicio] = useState('');

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


    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Profissional</h1>

            <label className="block mb-4">
            <span className="text-gray-700">Selecione o Profissional</span>
            <select
                className="block mt-1 p-2 border rounded w-full"
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
                <section className="mt-6">
                    <h2 className="text-xl font-semibold text-blue-700 mb-2">Aguardando Avaliação</h2>
                    <table className="w-full border">
                        <thead className="bg-blue-100">
                            <tr className="text-left">
                                <th className="border px-3 py-2">Paciente</th>
                                <th className="border px-3 py-2">Data Nascimento</th>
                                <th className="border px-3 py-2">Data Entrada</th>
                                <th className="border px-3 py-2">Indicação</th>
                                <th className="border px-3 py-2">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {aguardandoAvaliacao.map((tratamento) => (
                                <tr key={tratamento.id}>
                                    <td className="border px-3 py-2">{tratamento.paciente.nome}</td>
                                    <td className="border px-3 py-2">{tratamento.paciente.dataNascimento}</td>
                                    <td className="border px-3 py-2">{tratamento.dataEntrada}</td>
                                    <td className="border px-3 py-2">{tratamento.indicacao}</td>
                                    <td className="border px-3 py-2">
                                        <button 
                                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
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
                </section>

                {mostrarModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div 
                            className="absolute inset-0 bg-black bg-opacity-50"
                            onClick={fecharModal} // Adicione esta função para fechar ao clicar fora
                        ></div>
                        
                        <div className="relative z-10 bg-white rounded-lg shadow-xl w-full max-w-7xl mx-4">
                            <div className="p-6">
                                <h3 className="text-lg font-bold mb-4">Iniciar Avaliação</h3>
                                
                                <form>
                                    <div className="mb-4 flex gap-5">
                                        <div className="w-full">
                                            <label className="block text-gray-700 mb-2">Paciente</label>
                                            <label>{tratamentoSelecionado.paciente.nome}</label>
                                        </div>

                                        <div className="w-full">
                                            <label className="block text-gray-700 mb-2">Indicacao</label>
                                            <label>{tratamentoSelecionado.indicacao}</label>
                                        </div>

                                        <div className="w-full">
                                            <label className="block text-gray-700 mb-2">Data de Entrada:</label>
                                            <div className="flex gap-2">
                                                {tratamentoSelecionado.dataEntrada}
                                            </div>
                                        </div>

                                        <div className="w-full">
                                            <label className="block text-gray-700 mb-2">Idade:</label>
                                            <div className="flex gap-2">
                                                {tratamentoSelecionado.paciente.dataNascimento}
                                            </div>
                                        </div>

                                        <div className="w-full">
                                            <label className="block text-gray-700 mb-2">Data Início:</label>
                                            <div className="flex gap-2">
                                                <input 
                                                    type="date" 
                                                    defaultValue={'2025-08-02'}
                                                    value={dataInicio}
                                                    onChange={(e) => setDataInicio(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                    </div>

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
                                                    situacao: situacao,
                                                    dataInicio: dataInicio,
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

                <section className="mt-10">
                    <h2 className="text-xl font-semibold text-green-700 mb-2">Em Tratamento</h2>
                    <table className="w-full border">
                        <thead className="bg-green-100">
                            <tr className="text-left">
                                <th className="border px-3 py-2">Paciente</th>
                                <th className="border px-3 py-2">Data Nascimento</th>
                                <th className="border px-3 py-2">Data Início</th>
                                <th className="border px-3 py-2">Indicação</th>
                                <th className="border px-3 py-2">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {emTratamento.map((tratamento) => (
                                <tr key={tratamento.id}>
                                    <td className="border px-3 py-2">{tratamento.paciente.nome}</td>
                                    <td className="border px-3 py-2">{tratamento.paciente.dataNascimento}</td>
                                    <td className="border px-3 py-2">{tratamento.dataInicio}</td>
                                    <td className="border px-3 py-2">{tratamento.indicacao}</td>
                                    <td className="border px-3 py-2">
                                        <button 
                                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                            onClick={() => {
                                                setTratamentoSelecionado(tratamento);
                                                // console.log(tratamento);
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
                </section>

                {mostrarModalEditar && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div 
                            className="absolute inset-0 bg-black bg-opacity-50"
                            onClick={fecharModalEditar} // Adicione esta função para fechar ao clicar fora
                        ></div>
                        
                        <div className="relative z-10 bg-white rounded-lg shadow-xl w-full max-w-7xl mx-4">
                            <div className="p-6">
                                <h3 className="text-lg font-bold mb-4">Atendimento</h3>
                                
                                <form>
                                    <div className="mb-4 flex gap-5">
                                        <div className="w-full">
                                            <label className="block text-gray-700 mb-2">Paciente</label>
                                            <label>{tratamentoSelecionado.paciente.nome}</label>
                                        </div>

                                        <div className="w-full">
                                            <label className="block text-gray-700 mb-2">Indicacao</label>
                                            <label>{tratamentoSelecionado.indicacao}</label>
                                        </div>

                                        <div className="w-full">
                                            <label className="block text-gray-700 mb-2">Data de Entrada:</label>
                                            <div className="flex gap-2">
                                                {tratamentoSelecionado.dataEntrada}
                                            </div>
                                        </div>

                                        <div className="w-full">
                                            <label className="block text-gray-700 mb-2">Data de Nascimento:</label>
                                            <div className="flex gap-2">
                                                {tratamentoSelecionado.paciente.dataNascimento}
                                            </div>
                                        </div>

                                        <div className="w-full">
                                            <label className="block text-gray-700 mb-2">Data Início:</label>
                                            <div className="flex gap-2">
                                                <input 
                                                    type="date" 
                                                    // defaultValue={'2025-08-02'}
                                                    value={dataInicio}
                                                    onChange={(e) => setDataInicio(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                    </div>

                                    <Guia idTratamento={tratamentoSelecionado.id} />

                                    <div className="mb-4 flex gap-2">
                                        <label className="block text-gray-700 mb-2">Situação:</label>
                                        <select
                                            // value={situacao}
                                            // onChange={(e) => setSituacao(e.target.value)}
                                        >
                                            <option value="">Selecione...</option>
                                            <option value="Em Tratamento">Em Tratamento</option>
                                            <option value="Avaliação">Avaliação</option>
                                            <option value="Desistiu">Desistiu</option>
                                            <option value="Sem Contato">Sem Contato</option>
                                        </select>
                                    </div>
                                    
                                    <div className="flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={fecharModalEditar}
                                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="button"
                                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                            onClick={async () => {
                                                // const finalizarAvalicao = {
                                                //     id: tratamentoSelecionado.id,
                                                //     situacao: situacao,
                                                //     dataInicio: dataInicio,
                                                // };
                                                // await finalizarAvaliacao(finalizarAvalicao);
                                                // fecharModal();
                                                // setTratamentoSelecionado('');
                                                // await fetchTratamentos();
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