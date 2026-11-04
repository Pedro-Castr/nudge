import Link from "next/link";
import type { ReactNode } from "react";

import Logo from "@/components/logo";

import styles from "./legalPage.module.css";

interface LegalPageProps {
  title: string;
  updatedAt: string;
  children: ReactNode;
}

export default function LegalPage({
  title,
  updatedAt,
  children,
}: LegalPageProps) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" aria-label="Voltar para o início">
          <Logo size={28} />
        </Link>
      </header>

      <main className={styles.main}>
        <article className={styles.doc}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.updated}>Última atualização: {updatedAt}</p>
          {children}
        </article>
      </main>
    </div>
  );
}
