import { Op } from 'sequelize';
import Paciente from '../models/Paciente.js';

export async function criarPaciente(req, res) {
    try{
        const paciente = await Paciente.create(req.body);
        res.status(201).json(paciente);
    } catch(error){
        res.status(401).json({error: error.message});
    }
};

export async function listarPacientes(req, res) {
    const pacientes = await Paciente.findAll();
    res.json(pacientes);
};

export async function buscaNome(req, res) {

    const { caracter } = req.query;

    try{
        const listaNomes = await Paciente.findAll({
            where: {
                nome: {
                    [Op.like]: `${caracter}%`
                }
            }
        });
        
        if(!listaNomes || listaNomes.length === 0){
            return res.status(404).json({error: 'Paciente não localizado!'});
        }

        res.status(200).json(listaNomes);
    } catch(error){
        res.status(500).json({error: 'Erro'});
    }
}