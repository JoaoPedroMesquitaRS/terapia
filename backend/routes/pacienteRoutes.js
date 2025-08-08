import express, { Router } from 'express';
import { buscaNome, criarPaciente, listarPacientes } from '../controllers/pacienteController.js';

const router = express.Router();

router.post('/', criarPaciente);
router.get('/', listarPacientes);
router.get('/busca', buscaNome);

export default router;