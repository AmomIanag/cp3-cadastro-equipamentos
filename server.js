const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('node:path');
const { validarEquipamento } = require('./validacao');

const app = express();
const PORTA = Number(process.env.PORT || 3000);
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const BANCO = 'manutencao';
const COLECAO = 'equipamentos';

const cliente = new MongoClient(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000
});
let colecaoEquipamentos;

// Lê os dados enviados pelo formulário HTML com method="POST".
app.use(express.urlencoded({ extended: false }));

// 1) Página de cadastro.
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Disponibiliza o CSS e outros arquivos estáticos da pasta public.
app.use(express.static(path.join(__dirname, 'public')));

// 2) Recebe, valida e persiste os dados no MongoDB.
app.post('/cadastrar', async (req, res) => {
  const resultado = validarEquipamento(req.body);

  if (!resultado.valido) {
    return res.redirect(303, `/?status=${resultado.motivo}`);
  }

  try {
    const insercao = await colecaoEquipamentos.insertOne(resultado.equipamento);
    if (!insercao.acknowledged || !insercao.insertedId) {
      throw new Error('O MongoDB não confirmou a inserção.');
    }
    return res.redirect(
      303,
      `/?status=sucesso&nome=${encodeURIComponent(resultado.equipamento.nome)}`
    );
  } catch (erro) {
    console.error('Falha ao cadastrar equipamento:', erro);
    return res.redirect(303, '/?status=erro');
  }
});

// Escapa valores antes de colocá-los no HTML da tabela.
function escaparHtml(valor) {
  return String(valor).replace(/[&<>"']/g, (caractere) => {
    const entidades = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return entidades[caractere];
  });
}

const moeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

// 3) Consulta os registros usando find() e exibe uma tabela HTML.
app.get('/equipamentos', async (_req, res) => {
  try {
    const equipamentos = await colecaoEquipamentos
      .find({})
      .sort({ _id: -1 })
      .toArray();

    const linhas = equipamentos
      .map((item) => `
        <tr>
          <td class="nome-tabela">${escaparHtml(item.nome)}</td>
          <td>${escaparHtml(item.fabricante)}</td>
          <td>${escaparHtml(item.categoria)}</td>
          <td class="preco-tabela">${moeda.format(item.preco)}</td>
        </tr>`)
      .join('');

    const conteudo = equipamentos.length
      ? `<div class="tabela-container">
           <table>
             <thead><tr><th>Equipamento</th><th>Fabricante</th><th>Categoria</th><th>Preço (R$)</th></tr></thead>
             <tbody>${linhas}</tbody>
           </table>
         </div>`
      : '<div class="estado-vazio">Nenhum equipamento cadastrado ainda.</div>';

    res.type('html').send(`<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Equipamentos cadastrados | Controle de Manutenção</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <div class="site-container">
    <header class="topo">
      <a class="marca" href="/" aria-label="Voltar para o cadastro"><span class="marca-icone">E</span><span>Controle de Manutenção</span></a>
      <span class="marca-legenda">CP3 · Application Development</span>
    </header>
    <main class="conteudo">
      <div class="secao-titulo">
        <div><span class="etiqueta">VISÃO GERAL</span>
        <h1>Equipamentos cadastrados</h1>
        <p>Consulte os equipamentos recebidos pela manutenção eletrônica.</p></div>
        <a class="botao botao-secundario" href="/">+ Novo cadastro</a>
      </div>
      <section class="cartao cartao-tabela">
        <div class="cartao-cabecalho"><div><h2>Registros salvos</h2><p>Dados armazenados no MongoDB.</p></div><span class="contador">${equipamentos.length} registro(s)</span></div>
        ${conteudo}
      </section>
    </main>
    <footer class="rodape">FIAP · Checkpoint 3 · HTML, Node.js, Express e MongoDB</footer>
  </div>
</body>
</html>`);
  } catch (erro) {
    console.error('Falha ao consultar equipamentos:', erro);
    res.status(500).type('html').send(`<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Erro na consulta</title><link rel="stylesheet" href="/style.css"></head><body><main class="erro-consulta"><h1>Não foi possível consultar os equipamentos.</h1><p>Verifique a conexão com o MongoDB e tente novamente.</p><a class="botao" href="/">Voltar ao cadastro</a></main></body></html>`);
  }
});

// Só inicia o servidor depois de confirmar a conexão com o banco.
async function iniciar() {
  try {
    await cliente.connect();
    colecaoEquipamentos = cliente.db(BANCO).collection(COLECAO);
    app.listen(PORTA, () => {
      console.log(`Aplicação: http://localhost:${PORTA}`);
      console.log(`MongoDB conectado | Banco: ${BANCO} | Coleção: ${COLECAO}`);
    });
  } catch (erro) {
    console.error('Não foi possível conectar ao MongoDB:', erro.message);
    console.error('Confira se o MongoDB está em execução e a URI está correta.');
    await cliente.close();
    process.exitCode = 1;
  }
}

iniciar();
