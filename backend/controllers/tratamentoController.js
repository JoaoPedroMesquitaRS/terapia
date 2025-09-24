import Tratamento from '../models/Tratamento.js';
import Paciente from '../models/Paciente.js';

export async function criarTratamento(req, res) {
    try{
        const tratamento = await Tratamento.create(req.body);
        res.status(201).json(tratamento);
    } catch(error){
        res.status(400).json({error: error.message});
    }
};

function calcularIdade(dataNascimento) {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }
    return idade;
}
function calcularDiasAguardando(dataEntrada) {
    const hoje = new Date();
    const entrada = new Date(dataEntrada);
    const diffEmMs = hoje - entrada;
    const dias = Math.floor(diffEmMs / (1000 * 60 * 60 * 24));
    return dias;
}

export async function listarTratamentosAguardando(req, res) {
    try {
        const tratamentos = await Tratamento.findAll({
            where: { situacao: 'Aguardando' },
            include: [{
              model: Paciente,
              as: 'paciente',
              attributes: ['nome', 'dataNascimento']
            }],
            order: [['createdAt', 'ASC']]
        });

        // Adiciona a idade calculada a cada tratamento
        const tratamentosComIdade = tratamentos.map(t => ({
            id: t.id,
            nome: t.paciente.nome,
            dataEntrada: t.dataEntrada,
            idade: calcularIdade(t.paciente.dataNascimento),
            indicacao: t.indicacao,
            preferencia: t.preferencia,
            aguardando: calcularDiasAguardando(t.dataEntrada),
        }));

        res.json(tratamentosComIdade);
    } catch (error) {
        console.error('Erro ao buscar tratamentos aguardando:', error);
        res.status(500).json({ error: 'Erro ao buscar tratamentos aguardando' });
    }
};

export async function listarPorProfissional(req, res) {
  const { profissional, situacao } = req.query;

  try {
    const tratamentos = await Tratamento.findAll({
      where: {
        idProfissional: profissional,
        situacao: situacao || 'Em Tratamento'
      },
      include: {
        model: Paciente,
        as: 'paciente'
      }
    });

    res.json(tratamentos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export async function agendarAvaliacao(req, res) {
  
  try{
    const { id } = req.params;
    const { idProfissional, dataInicio, situacao } = req.body;
    
    const [quantidadeAtualizada] = await Tratamento.update(
      {
        idProfissional, dataInicio, situacao
      },
      {where: {id}}
    );

    if(quantidadeAtualizada === 0){
      return res.status(400).json({error: `Tratamento não localizado!`});
    }
    res.status(200).json({message: 'Tratamento agendado!'});
  } catch(error){
    res.status(500).json({error: error.message});
  }
};

export async function buscarTProfissional(req, res) {
  try{
    const { profissionalSelecionado } = req.params;
    const listaTratamentos = await Tratamento.findAll({
      where: {
        idProfissional: profissionalSelecionado,
      },
      include: [{
          model: Paciente,
          as: 'paciente',
          attributes: ['nome', 'dataNascimento']
      }],
      order: [['createdAt', 'ASC']]
    });
    
    if (!listaTratamentos || listaTratamentos.length === 0) {
      return res.status(404).json({ error: 'Não foram localizados tratamentos para este Profissional!' });
    }

    const tratamentosComIdade = listaTratamentos.map((t) => {
      const plain = t.get({ plain: true }); // transforma em objeto puro
      return {
        ...plain,
        idade: calcularIdade(t.paciente.dataNascimento),
      };
    });

    res.status(200).json(tratamentosComIdade);
  } catch(error){
    res.status(500).json({error: error.message});
  }
};

export async function deletarTratamento(req, res) {
  try{
    const { id } = req.params;

    const qtdExcluida = await Tratamento.destroy({where: {id}});

    if(qtdExcluida === 0){
      res.status(404).json({error: 'Tratamento não localizado!'});
    }
    res.status(200).json({message: 'Tratamento excluido com sucesso!'});
  } catch{
    res.status(500).json({error: error.message});
  }
};

export async function alterarSituacao(req, res) {
  
  try{
    const { id } = req.params;
    const { situacao, dataFinal } = req.body;
  
    const [quantidadeAtualizada] = await Tratamento.update(
      {
        situacao, dataFinal
      },
      {where: {id}}
    );

    if(quantidadeAtualizada === 0){
      return res.status(400).json({error: 'Tratamento não localizado!'})
    }
    res.status(200).json({message: 'Tratamento alterado com sucesso!'})
  } catch(error){
    res.status(500).json({error: error.message});
  }
}