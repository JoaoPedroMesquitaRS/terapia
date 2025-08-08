import express, { Router } from 'express';
import { agendarAvaliacao, buscarTProfissional, criarTratamento, deletarTratamento, listarPorProfissional, listarTratamentosAguardando } from '../controllers/tratamentoController.js';

const router = express.Router();

router.post('/', criarTratamento);
router.get('/aguardando', listarTratamentosAguardando);
router.get('/', listarPorProfissional);
router.delete('/:id', deletarTratamento);
router.get('/:profissionalSelecionado', buscarTProfissional);
router.put('/avaliacao/:id', agendarAvaliacao);

export default router;