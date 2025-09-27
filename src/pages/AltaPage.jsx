import { useEffect, useState } from "react"

export default function AltaPage(){

    const [ tratamentos, setTratamentos ] = useState([]);
    const [ profissionais, setProfissionais ] = useState([]);
    const [ profissionalSelecionado, setProfissionalSelecionado ] = useState([]);
    const [mesSelecionado, setMesSelecionado] = useState("");
    const [anoSelecionado, setAnoSelecionado] = useState("");

    useEffect(() => {
        fetch("http://localhost:3001/profissionais")
            .then((res) => res.json())
            .then(setProfissionais);
    }, []);

    useEffect(() => {
        
        async function altaData() {
            if (profissionalSelecionado && mesSelecionado && profissionalSelecionado) {
    
                const response = await fetch(`http://localhost:3001/tratamentos/altaData?idProfissional=${profissionalSelecionado}&ano=${anoSelecionado}&mes=${mesSelecionado}`)
                .then(res => res.json())

                setTratamentos(response);
    
            } else {
                setTratamentos([]);
            }
        }

        altaData();

    }, [anoSelecionado, mesSelecionado, profissionalSelecionado]);

    /*************************/
    function formatarData(dataISO){
        if(!dataISO) return "";
        const [ano, mes, dia] = dataISO.split("-");
        return `${dia}/${mes}/${ano}`;
    }


    return(
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-center mb-6">Altas por Profissional</h1>


            <div className="flex flex-wrap gap-4 justify-center mb-8">

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                        Selecione o Profissional:
                    </label>
                    <select
                        value={profissionalSelecionado}
                        onChange={(e) => setProfissionalSelecionado(e.target.value)}
                        className="w-full p-2 border rounded mb-6"
                    >
                        <option value="">-</option>
                        {profissionais.map((profissional) => (
                            <option key={profissional.id} value={profissional.id}>
                                {profissional.nome}
                            </option>
                        ))}
                    </select>
                </div>

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
                
            <tr className="bg-gray-100">
                <td colSpan="3" className="px-6 py-3 text-right font-bold">
                    Total:
                </td>
                <td className="px-6 py-3 text-center font-bold text-green-600">
                    {tratamentos.length}
                </td>
            </tr>

            {tratamentos.length > 0 ? (
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                        <th className="p-2 border text-left">Paciente</th>
                        <th className="p-2 border">Início</th>
                        <th className="p-2 border">Alta</th>
                        <th className="p-2 border">Situação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tratamentos.map((t) => (
                        <tr key={t.id} className="hover:bg-gray-50">
                            <td className="p-2 border">{t.paciente?.nome}</td>
                            <td className="p-2 border text-center">{formatarData(t.dataInicio)}</td>
                            <td className="p-2 border text-center">{formatarData(t.dataFinal)}</td>
                            <td className="p-2 border text-center">{t.situacao}</td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            ) : profissionalSelecionado ? (
                <p className="text-center mt-4 text-gray-500">Nenhuma alta para este profissional.</p>
            ) : null}
    </div>
    )
}