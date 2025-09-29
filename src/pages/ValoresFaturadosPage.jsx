import { useEffect, useState } from "react";

function ValoresFaturadosPage() {
    const [faturamentos, setFaturamentos] = useState([]);
    const [mesSelecionado, setMesSelecionado] = useState("");
    const [anoSelecionado, setAnoSelecionado] = useState("");

    useEffect(() => {
        async function buscarFaturamento() {
            const response = await fetch(
                `http://localhost:3001/guias/faturamento?mes=${mesSelecionado}&ano=${anoSelecionado}`
            );
            const dados = await response.json();

            const historicos = Array.isArray(dados.historicos) ? dados.historicos : [];

            const formatado = historicos.map((h) => ({
                senhaTratamento: h.guia?.senha || "-",
                tipoPlano: h.guia?.tipo || "Nenhum",
                descricaoServico: h.guia?.servico?.descricao || "N/D",
                qtdAtendida: 1,
                valorUnitario: parseFloat(h.guia?.servico?.valor || 0),
            }));
            setFaturamentos(formatado);
        }

        buscarFaturamento(mesSelecionado);
    }, [mesSelecionado, anoSelecionado]);

    const somaPercentuais = faturamentos.reduce((acc, item) => {
        const percentual = (item.tipoPlano / 100) * item.valorUnitario;
        if (!isNaN(percentual)) {
            return acc + percentual;
        }
        return acc;
    }, 0);

    return (
        <div className="max-w-7xl mx-auto p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
                Faturamento do Mês
            </h1>

            <div className="flex flex-wrap gap-4 justify-center mb-8">
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                        Selecione o mês:
                    </label>
                    <select
                        value={mesSelecionado}
                        onChange={(e) => setMesSelecionado(e.target.value)}
                        className="w-40 p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Mês</option>
                        <option value="01">Janeiro</option>
                        <option value="02">Fevereiro</option>
                        <option value="03">Março</option>
                        <option value="04">Abril</option>
                        <option value="05">Maio</option>
                        <option value="06">Junho</option>
                        <option value="07">Julho</option>
                        <option value="08">Agosto</option>
                        <option value="09">Setembro</option>
                        <option value="10">Outubro</option>
                        <option value="11">Novembro</option>
                        <option value="12">Dezembro</option>
                    </select>
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                        Selecione o ano:
                    </label>
                    <select
                        value={anoSelecionado}
                        onChange={(e) => setAnoSelecionado(e.target.value)}
                        className="w-40 p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Ano</option>
                        <option value="2023">2023</option>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
                    {/* <thead className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white"> */}
                    <thead className="bg-gradient-to-r bg-gray-800 text-white">
                        <tr>
                            <th className="px-6 py-3 text-left">Senha Guia</th>
                            <th className="px-6 py-3 text-left">Serviço</th>
                            <th className="px-6 py-3 text-center">Participação</th>
                            <th className="px-6 py-3 text-center">Qtd</th>
                            <th className="px-6 py-3 text-center">Valor Unit. (R$)</th>
                            <th className="px-6 py-3 text-center">Subtotal (R$)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {faturamentos.length > 0 ? (
                            faturamentos.map((item, index) => (
                                <tr
                                    key={index}
                                    className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition-colors"
                                >
                                    <td className="px-6 py-3 border-t">{item.senhaTratamento}</td>
                                    <td className="px-6 py-3 border-t">{item.descricaoServico}</td>
                                    <td className="px-6 py-3 text-center border-t">
                                        {item.tipoPlano}%
                                    </td>
                                    <td className="px-6 py-3 text-center border-t">
                                        {item.qtdAtendida}
                                    </td>
                                    <td className="px-6 py-3 text-center border-t">
                                        {item.valorUnitario.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-3 text-center border-t font-semibold">
                                        {((item.tipoPlano / 100) * item.valorUnitario).toFixed(2)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="text-center py-6 text-gray-500 italic"
                                >
                                    Nenhum dado encontrado
                                </td>
                            </tr>
                        )}
                        <tr className="bg-gray-100">
                            <td colSpan="5" className="px-6 py-3 text-right font-bold">
                                Total:
                            </td>
                            <td className="px-6 py-3 text-center font-bold text-green-600">
                                {somaPercentuais.toFixed(2)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ValoresFaturadosPage;
