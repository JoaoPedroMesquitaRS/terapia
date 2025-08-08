import { useEffect, useState } from "react";

function ValoresFaturadosPage() {
    const [faturamentos, setFaturamentos] = useState([]);
    const [mesAtual, setMesAtual] = useState('08');
    const [anoAtual, setAnoAtual] = useState('2025');
    const [totalGeral, setTotalGeral] = useState(0);

    useEffect(() => {
        async function buscarFaturamento() {
            const response = await fetch(`http://localhost:3001/guias/faturamento?mes=08&ano=2025`);
            const dados = await response.json();
            
            // Verifica se "historicos" veio como array
            const historicos = Array.isArray(dados.historicos) ? dados.historicos : [];
            
            console.log(historicos);
            const formatado = historicos.map(h => ({
                senhaTratamento: h.guia?.senha || '-',
                tipoPlano: h.guia?.tipo || 'Nenhum', 
                descricaoServico: h.guia?.servico?.descricao || 'N/D',
                qtdAtendida: 1,
                valorUnitario: parseFloat(h.guia?.servico?.valor || 0)
            }));

            setFaturamentos(formatado);

            // Calcular total geral
            // const total = dados.reduce((acc, item) => acc + (item.valorUnitario * item.qtdAtendida), 0);
            // setTotalGeral(total);

            // Mês atual formatado
            // const dataAtual = new Date();
            // const nomeMes = dataAtual.toLocaleString('default', { month: 'long' });
            // setMesAtual(nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1));
        }

        buscarFaturamento();
    }, []);

    const somaPercentuais = faturamentos.reduce((acc, item) => {
        const percentual = (item.tipoPlano / item.valorUnitario) * 100;
        if (!isNaN(percentual)) {
            return acc + percentual;
        }
        return acc; // se o percentual for NaN, apenas retorna o acumulador
    }, 0);

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-center mb-6">
                Faturamento do Mês {mesAtual}/{anoAtual}
            </h1>

            <table className="min-w-full bg-white border border-gray-300 shadow rounded">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2 border">Senha Guia</th>
                        <th className="px-4 py-2 border">Serviço</th>
                        <th className="px-4 py-2 border">Tipo Plano</th>
                        <th className="px-4 py-2 border">Qtd Atendida</th>
                        <th className="px-4 py-2 border">Valor Unitário (R$)</th>
                        <th className="px-4 py-2 border">Subtotal (R$)</th>
                    </tr>
                </thead>
                <tbody>
                    {faturamentos && faturamentos.map((item, index) => (
                        <tr key={index} className="text-center">
                            <td className="border px-4 py-2">{item.senhaTratamento}</td>
                            <td className="border px-4 py-2">{item.descricaoServico}</td>
                            <td className="border px-4 py-2">{item.tipoPlano}%</td>
                            <td className="border px-4 py-2">{item.qtdAtendida}</td>
                            <td className="border px-4 py-2">{item.valorUnitario.toFixed(2)}</td>
                            <td className="border px-4 py-2">{((item.tipoPlano / item.valorUnitario) * 100).toFixed(2)}</td>
                        </tr>
                    ))}

                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className="text-center font-bold px-4 py-2">{somaPercentuais.toFixed(2)}</td>
                    </tr>

                </tbody>
            </table>

            {/* <div className="mt-4 text-right text-xl font-semibold">
                Total Faturado: R$ {totalGeral.toFixed(2)}
            </div> */}
        </div>
    );
}

export default ValoresFaturadosPage;