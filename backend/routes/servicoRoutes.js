import express, { Router } from 'express';
import { buscaServico, criarServico } from '../controllers/servicoController.js';

const router = express.Router();

router.post('/', criarServico);
router.get('/', buscaServico);

export default router;