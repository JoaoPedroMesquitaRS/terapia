import Profissional from "../models/Profissional.js";

export async function criarProfissional(req, res) {
    try{
        const profissional = await Profissional.create(req.body);
        res.status(201).json(profissional);
    } catch(error){
        res.status(401).json({error: error.message});
    }
};

export async function listarProfissional(req, res) {
    const profissionais = await Profissional.findAll();
    res.json(profissionais);
};