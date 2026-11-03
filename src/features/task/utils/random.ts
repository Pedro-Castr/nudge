export const tasksMokup = [
  "Tirar a carne do freezer",
  "Regar as plantas da varanda",
  "Trocar o filtro da água",
  "Separar o lixo reciclável",
  "Comprar pilha para o controle",
  "Ver se o gás está acabando",
  "Pagar o boleto do condomínio",
  "Comprar ração do cachorro",
  "Pedir a segunda via da conta de luz",
  "Renovar a assinatura do antivírus",
  "Comprar presente para o Higor",
  "Perguntar ao João do carregador",
  "Responder o convite do casamento",
  "Avisar o síndico do vazamento",
  "Procurar o recibo da garantia",
  "Imprimir o documento do banco",
  "Devolver o livro da biblioteca",
  "Marcar o dentista",
  "Agendar a revisão do carro",
  "Fazer backup das fotos do celular",
  "Investir em ações",
  "Comprar o jogo que lançou ontem",
  "Rever assinaturas do cartão",
  "Programar a viagem de fim de ano",
];

export function pickRandom<T>(items: readonly T[]): T | undefined {
  return items[Math.floor(Math.random() * items.length)];
}
