import sequelize from '../config/database.js';
import { Op } from 'sequelize';
import Guia from '../models/Guia.js';
import Servico from '../models/Servico.js';
import HistoricoAtendimento from '../models/HistoricoAtendimento.js';

export async function criarGuia(req, res) {
    try{
        const guia = await Guia.create(req.body);
        res.status(201).json(guia);
    }catch(error){
        res.status(401).json({error: error.message});
    }
};

export async function listarGuiasTratamento(req, res) {
    try{
        const { id } = req.params;
        const listarGuiasTratamento = await Guia.findAll({
            where: {
                idTratamento: {
                    [Op.eq]: `${id}`
                }
            },
            include: [
                {
                model: Servico,
                as: 'servico',
                attributes: ['descricao'] // pode incluir também 'valor' se quiser
                }
            ]
        })

        if(!listarGuiasTratamento || listarGuiasTratamento === 0){
            return res.status(404).json({error: 'Guia não localizada!'})
        };
        res.status(200).json(listarGuiasTratamento);
    } catch(error){
        res.status(500).json({error: error.message});
    }
};

export async function registrarAtendimento(req, res) {
    try{ 
        const { id } = req.params;
        const { acao } = req.body;

        const guia = await Guia.findByPk(id);
        if(!guia) return res.status(404).json({error: 'Guia não localizada!'});

        if(acao == 'Atender'){
            if(guia.qtdAtendida >= guia.qtdAtendimentoAutorizado){
                return res.status(400).json({error: 'Quantidade de atendimentos autorizados atingido!'})
            }

            guia.qtdAtendida += 1;
            await guia.save();

            await HistoricoAtendimento.create({
                idGuia: id,
                dataAtendimento: new Date().toISOString().split('T')[0]
            });

            res.status(200).json({message: 'Atendimento registrado com sucesso!'});
        }
    } catch(error){
        res.status(500).json({error: error.message});
    }
};

export async function calcularFaturamento(req, res) {
    const { mes, ano } = req.query;

    try {
        const historicos = await HistoricoAtendimento.findAll({
            include: [{
                model: Guia,
                as: 'guia',
                include: [{ model: Servico, as: 'servico' }]
            }]
        });

        const historicosFiltrados = historicos.filter(h => {
            const data = new Date(h.dataAtendimento);
            return (
                data.getMonth() + 1 === parseInt(mes) &&
                data.getFullYear() === parseInt(ano)
            );
        });

        // const total = historicos.reduce((soma, hist) => {
        //     return soma + parseFloat(hist.guia.servico.valor);
        // }, 0);

        res.status(200).json({ historicos: historicosFiltrados });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export async function deletarAtendimento(req, res) {
    try{
        const { id } = req.params;
        const quantidadeExcluida = await HistoricoAtendimento.destroy({where: {id}});

        if(quantidadeExcluida === 0){
            res.status(404).json({error: 'Historico de atendimento não localizado!'});
        }
        res.status(200).json({message: 'Historico de atendimento excluido!'});
    } catch(error){
        res.status(500).json({error: error.message});
    }
};