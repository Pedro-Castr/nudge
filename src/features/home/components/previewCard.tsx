"use client";

import { useState } from "react";
import { FaCheck, FaGripVertical } from "react-icons/fa6";

import styles from "./previewCard.module.css";

const tasksMokup = [
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
  "Investir nas ações que subiram",
  "Comprar o jogo que lançou ontem",
  "Renovar assinatura do YouTube",
  "Marcar de reunir com o Enrico",
];

export default function PreviewCard() {
  const [nome] = useState(() =>
    [...tasksMokup].sort(() => Math.random() - 0.5).slice(0, 3),
  );

  return (
    <div className={styles.preview} aria-hidden="true">
      <ul className={styles.previewList}>
        <li className={styles.card}>
          <span className={styles.handle}>
            <FaGripVertical />
          </span>
          <span className={styles.name} suppressHydrationWarning>
            {nome[0]}
          </span>
          <span className={styles.check}>
            <FaCheck />
          </span>
        </li>

        <li className={`${styles.card} ${styles.dragging}`}>
          <span className={styles.handle}>
            <FaGripVertical />
          </span>
          <span className={styles.name} suppressHydrationWarning>
            {nome[1]}
          </span>
          <span className={styles.check}>
            <FaCheck />
          </span>
        </li>

        <li className={styles.slot} />

        <li className={styles.card}>
          <span className={styles.handle}>
            <FaGripVertical />
          </span>
          <span className={styles.name} suppressHydrationWarning>
            {nome[2]}
          </span>
          <span className={styles.check}>
            <FaCheck />
          </span>
        </li>
      </ul>
    </div>
  );
}
