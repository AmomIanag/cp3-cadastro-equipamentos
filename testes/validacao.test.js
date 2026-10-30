const test = require('node:test');
const assert = require('node:assert/strict');
const { validarEquipamento } = require('../validacao');

const dadosValidos = {
  nome: 'Notebook IdeaPad 3',
  fabricante: 'Lenovo',
  categoria: 'Notebook',
  preco: '2500.00'
};

test('aceita cadastro completo e converte preço em número', () => {
  const resultado = validarEquipamento(dadosValidos);
  assert.equal(resultado.valido, true);
  assert.deepEqual(resultado.equipamento, { ...dadosValidos, preco: 2500 });
});

test('aceita vírgula decimal e remove espaços extras', () => {
  const resultado = validarEquipamento({ ...dadosValidos, nome: '  Notebook  ', preco: '99,90' });
  assert.equal(resultado.valido, true);
  assert.equal(resultado.equipamento.nome, 'Notebook');
  assert.equal(resultado.equipamento.preco, 99.9);
});

test('rejeita cada um dos campos obrigatórios vazio', () => {
  for (const campo of ['nome', 'fabricante', 'categoria', 'preco']) {
    const resultado = validarEquipamento({ ...dadosValidos, [campo]: '  ' });
    assert.deepEqual(resultado, { valido: false, motivo: 'campos' });
  }
});

test('rejeita preço zero ou negativo', () => {
  for (const preco of ['0', '-1', '0.00', '-5.50']) {
    const resultado = validarEquipamento({ ...dadosValidos, preco });
    assert.deepEqual(resultado, { valido: false, motivo: 'preco' });
  }
});

test('rejeita preço não numérico e mais de duas casas decimais', () => {
  for (const preco of ['abc', '12.345', '1e3', 'Infinity', '10,00abc']) {
    const resultado = validarEquipamento({ ...dadosValidos, preco });
    assert.deepEqual(resultado, { valido: false, motivo: 'preco' });
  }
});

test('rejeita valores inesperados e textos acima de 100 caracteres', () => {
  assert.equal(validarEquipamento({ ...dadosValidos, nome: ['nome'] }).valido, false);
  assert.deepEqual(
    validarEquipamento({ ...dadosValidos, fabricante: 'A'.repeat(101) }),
    { valido: false, motivo: 'tamanho' }
  );
});
