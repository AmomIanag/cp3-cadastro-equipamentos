/**
 * Valida e prepara os dados do formulário antes da gravação no MongoDB.
 * O preço é convertido para Number, aceitando ponto ou vírgula decimal.
 */
function validarEquipamento(dados = {}) {
  const comoTexto = (valor) =>
    typeof valor === 'string' ? valor.trim() : '';

  const nome = comoTexto(dados.nome);
  const fabricante = comoTexto(dados.fabricante);
  const categoria = comoTexto(dados.categoria);
  const precoTexto = comoTexto(dados.preco);

  if (!nome || !fabricante || !categoria || !precoTexto) {
    return { valido: false, motivo: 'campos' };
  }

  if ([nome, fabricante, categoria].some((campo) => campo.length > 100)) {
    return { valido: false, motivo: 'tamanho' };
  }

  // Preços em reais com até duas casas decimais, sem sinais ou letras.
  const formatoValido = /^\d+(?:[.,]\d{1,2})?$/.test(precoTexto);
  const preco = Number(precoTexto.replace(',', '.'));

  if (!formatoValido || !Number.isFinite(preco) || preco <= 0) {
    return { valido: false, motivo: 'preco' };
  }

  return {
    valido: true,
    equipamento: { nome, fabricante, categoria, preco }
  };
}

module.exports = { validarEquipamento };
