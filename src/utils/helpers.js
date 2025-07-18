export function isFimDeSemana(date) {
  const dia = date.getDay();
  return dia === 0 || dia === 6;
}

export function obterPreco(tipo, date = new Date()) {
  if (isFimDeSemana(date)) {
    return tipo === "adulto" ? 3.5 : 2.0;
  }
  const hora = date.getHours();
  if (hora >= 17) {
    return tipo === "adulto" ? 2.25 : 1.5;
  }
  return tipo === "adulto" ? 3.5 : 2.0;
}

export function formatMoney(valor) {
  return valor.toLocaleString("pt-PT", {
    style: "currency",
    currency: "EUR",
  });
}

export function dataHoje() {
  return new Date().toISOString().slice(0, 10);
}
