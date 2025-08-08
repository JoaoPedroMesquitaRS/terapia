import { Op } from 'sequelize';
import Servico from '../models/Servico.js';

export async function criarServico(req, res) {
    try{
        const servico = await Servico.create(req.body);
        res.status(201).json(servico);
    } catch(error){
        res.status(401).json({error: error.message});
    } 
};

export async function buscaServico(req, res) {

    try{
        const { caracter } = req.query;
        const listaServico = await Servico.findAll({
            where: {
                descricao:{
                    [Op.like]: `${caracter}%`
                }
            }
        });
        if(!listaServico || listaServico === 0){
            return res.status(404).json({error: 'Serviço não localizadao!'})
        };
        res.status(200).json(listaServico);
    } catch(error){
        res.status(500).json({error: error.message});
    }
};