import { useEffect, useState } from "react";

function DetalhesAtendimento({ listaIdGuia }) {
    const [listaId, setListaId] = useState([]);
    const [atendimentos, setAtendimentos] = useState([]);

    useEffect(() => {
        setListaId(listaIdGuia);
    }, [listaIdGuia]);

    useEffect(() => {
        async function buscarAtendimentos() {
            if (listaId.length > 0) {
                try {
                // cria uma lista de Promises
                const promises = listaId.map((id) =>
                    fetch(`http://localhost:3001/guias/busca-historico/${id}`).then((res) =>
                    res.json()
                    )
                );

                // aguarda todas terminarem
                const resultados = await Promise.all(promises);

                setAtendimentos(resultados.flat());
                } catch (error) {
                console.error("Erro ao buscar atendimentos:", error);
                }
            } else {
                setAtendimentos([]);
            }
        }

        buscarAtendimentos();
    }, [listaId]);

    const formatarData = (dataIso) =>{
        if(!dataIso) return "";
        const [ano, mes, dia] = dataIso.split("-");
        return `${dia}/${mes}/${ano}`
    }

    // cria um contador por situação
    const totaisSituacao = atendimentos.reduce((acc, item) => {
        acc[item.situacao] = (acc[item.situacao] || 0) + 1;
        return acc;
    }, {});

    return (
        <table className="min-w-full border border-gray-200 rounded shadow">
            <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
                <tr className="text-left text-gray-700 text-sm font-semibold">
                    <th className="py-3 px-4 border-b w-40">Paciente</th>
                    <th className="py-3 px-4 border-b w-40">Senha Guia</th>
                    <th className="py-3 px-4 border-b w-40">Data Atendimento</th>
                    <th className="py-3 px-4 border-b w-40">Situação</th>
                </tr>
            </thead>

            <tbody className="text-sm">
                {atendimentos.length > 0 ? (
                atendimentos.map((item, index) => (
                    <tr
                        key={index}
                        className="hover:bg-gray-50 transition-colors animate-fade-in"
                    >
                        <td className="px-4 py-2 border-b">{item.paciente.nome}</td>
                        <td className="px-4 py-2 border-b">{item.guia.senha}</td>
                        <td className="px-4 py-2 border-b">{formatarData(item.dataAtendimento)}</td>
                        <td className="px-4 py-2 border-b">{item.situacao}</td>
                    </tr>
                ))) : (
                    <tr>
                        <td
                            colSpan="6"
                            className="text-center py-6 text-gray-500 italic"
                        >
                            Nenhum dado encontrado
                        </td>
                    </tr>
                )}
            </tbody>
            <tfoot>
                {Object.entries(totaisSituacao).map(([situacao, total]) => (
                    <tr key={situacao} className="bg-gray-100 font-semibold">
                        <td colSpan={3} className="px-4 py-2 border-b text-right">
                            {situacao}
                        </td>
                        <td className="px-4 py-2 border-b">{total}</td>
                    </tr>
                ))}
            </tfoot>
        </table>
    );
}

export default DetalhesAtendimento;
