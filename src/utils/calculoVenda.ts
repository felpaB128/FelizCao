// src/utils/calculoVenda.ts
export type Produto = {
  id: number;
  nome: string;
  precoSaco: number;
  precoQuilo: number;
  quantidadeSacos: number;
};

export type VendaInfo = {
  valor: string;
  unidade: "kg" | "g";
};

export function calcularValorVenda(produto: Produto, info?: VendaInfo) {
  if (!info || !info.valor) return 0;

  const pesoNum = Number(info.valor);
  if (!pesoNum || pesoNum <= 0) return 0;

  // se unidade for kg, 1 = 1kg; se for g, 1000 = 1kg
  const pesoKg = info.unidade === "kg" ? pesoNum : pesoNum / 1000;

  return pesoKg * produto.precoQuilo;
}
