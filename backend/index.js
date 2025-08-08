import express from 'express';
import cors from 'cors';
import sequelize from './config/database.js';

// ROTAS
import pacienteRoutes from './routes/pacienteRoutes.js';
import tratamentoRoutes from './routes/tratamentoRoutes.js';
import profissionalRoutes from './routes/profissionalRoutes.js';
import guiaRoutes from './routes/guiaRoutes.js';
import servicoRoutes from './routes/servicoRoutes.js';

// MODELOS
import Paciente from './models/Paciente.js';
import Tratamento from './models/Tratamento.js';
import Profissional from './models/Profissional.js';
import Guia from './models/Guia.js';
import HistoricoAtendimento from './models/HistoricoAtendimento.js';
import Servico from './models/Servico.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

//
app.use('/pacientes', pacienteRoutes);
app.use('/tratamentos', tratamentoRoutes);
app.use('/profissionais', profissionalRoutes);
app.use('/guias', guiaRoutes);
app.use('/servicos', servicoRoutes);

// Associações
const models = { Paciente, Tratamento, Profissional, Guia, HistoricoAtendimento, Servico };
Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

// Sincroniza o banco (gera tabelas se ainda não existem)
sequelize.sync().then(() => {
  console.log('Banco de dados sincronizado.');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});