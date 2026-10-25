"use client";

import { useState } from "react";
import { FaCheck, FaGripVertical } from "react-icons/fa6";

import styles from "./previewCard.module.css";

const tasksMokup = [
  // Casa
  "Tirar a carne do freezer",
  "Regar as plantas da varanda",
  "Trocar o filtro da água",
  "Separar o lixo reciclável",

  // Compras e contas
  "Comprar pilha para o controle",
  "Ver se o gás está acabando",
  "Pagar o boleto do condomínio",
  "Comprar ração do cachorro",
  "Pedir a segunda via da conta de luz",
  "Renovar a assinatura do antivírus",
  "Comprar presente para o Higor",

  // Pessoas
  "Perguntar ao João do carregador",
  "Responder o convite do casamento",
  "Avisar o síndico do vazamento",

  // Coisas que dependem de estar em casa
  "Procurar o recibo da garantia",
  "Imprimir o documento do banco",
  "Devolver o livro da biblioteca",
  "Marcar o dentista",
  "Agendar a revisão do carro",
  "Fazer backup das fotos do celular",
];

export default function PreviewCard({ dragging }: { dragging?: boolean }) {
  const [nome] = useState(
    () => tasksMokup[Math.floor(Math.random() * tasksMokup.length)],
  );

  return (
    <li className={`${styles.card} ${dragging ? styles.dragging : ""}`}>
      <span className={styles.handle}>
        <FaGripVertical />
      </span>
      <span className={styles.name} suppressHydrationWarning>
        {nome}
      </span>
      <span className={styles.check}>
        <FaCheck />
      </span>
    </li>
  );
}
