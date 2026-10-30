# CP3 — Cadastro de Equipamentos Eletrônicos

**FIAP | Ciência da Computação — 2º ano | Application Development | Checkpoint 3**

Aplicação web desenvolvida para o cadastro e a consulta de equipamentos eletrônicos recebidos por uma empresa de manutenção. O sistema permite registrar equipamentos, validar os dados informados e armazenar os registros em um banco de dados MongoDB.

## Tecnologias utilizadas

- **HTML5 e CSS3:** estrutura e estilização da interface.
- **Node.js:** ambiente de execução do servidor.
- **Express:** gerenciamento das rotas e requisições HTTP.
- **MongoDB:** armazenamento e consulta dos equipamentos por meio do driver oficial.

## Funcionalidades

- Cadastro de equipamentos com nome, fabricante, categoria e preço.
- Validação de campos obrigatórios e preços maiores que zero.
- Conversão do preço para valor numérico antes do armazenamento.
- Persistência dos registros no MongoDB com `insertOne()`.
- Consulta dos equipamentos cadastrados com `find()`.
- Exibição de mensagens de sucesso e erro após as operações.

## Requisitos

- Node.js 20.19 ou superior.
- MongoDB Community Server instalado e em execução.
- MongoDB Compass (opcional, para visualizar os registros).

## Instalação e execução

1. Abra a pasta do projeto no VS Code ou em outro editor.
2. Instale as dependências:

   ```bash
   npm install
   ```

3. Certifique-se de que o serviço do MongoDB esteja em execução na porta `27017`.
4. Inicie a aplicação:

   ```bash
   npm start
   ```

5. Acesse a aplicação pelo navegador:

   - Cadastro: http://localhost:3000
   - Consulta: http://localhost:3000/equipamentos

## Rotas da aplicação

| Método | Rota | Descrição |
|---|---|---|
| GET | `/` | Exibe o formulário de cadastro. |
| POST | `/cadastrar` | Valida os dados e registra o equipamento no MongoDB. |
| GET | `/equipamentos` | Consulta e apresenta os equipamentos cadastrados. |

## Banco de dados

A aplicação utiliza o MongoDB com a seguinte configuração:

- **Conexão local:** `mongodb://127.0.0.1:27017`
- **Banco:** `manutencao`
- **Coleção:** `equipamentos`

Exemplo de documento armazenado:

```json
{
  "nome": "Notebook IdeaPad 3",
  "fabricante": "Lenovo",
  "categoria": "Notebook",
  "preco": 2500
}
```

O MongoDB também gera automaticamente um identificador `_id` para cada documento.

## Validação dos dados

Os dados recebidos pelo servidor são verificados antes de serem armazenados. A aplicação rejeita campos vazios, preços não numéricos e valores menores ou iguais a zero.

Em caso de sucesso ou erro, uma mensagem de retorno é apresentada ao usuário.

## Testes

O projeto possui testes automatizados para verificar a validação dos campos e a conversão do preço.

Para executá-los:

```bash
npm test
```

Os testes de integração com o MongoDB podem ser verificados executando a aplicação e consultando os registros pelo navegador ou pelo MongoDB Compass.

## Evidências

A pasta `evidencias/` contém capturas de tela demonstrando o funcionamento do formulário, a consulta dos equipamentos e os documentos armazenados no MongoDB.