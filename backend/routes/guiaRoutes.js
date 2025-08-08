import express, { Router } from 'express';
import { calcularFaturamento, criarGuia, deletarAtendimento, listarGuiasTratamento, registrarAtendimento } from '../controllers/guiaController.js';

const router = express.Router();

router.post('/', criarGuia);
router.get('/busca/:id', listarGuiasTratamento);
router.delete('/atendimento/:id', deletarAtendimento);
router.post('/:id/registrar-atendimento', registrarAtendimento);
router.get('/faturamento', calcularFaturamento);


export default router;