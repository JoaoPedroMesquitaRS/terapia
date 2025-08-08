import express, { Router } from 'express';
import { criarProfissional, listarProfissional } from '../controllers/profissionalController.js';

const router = express.Router();

router.post('/', criarProfissional);
router.get('/', listarProfissional);

export default router;